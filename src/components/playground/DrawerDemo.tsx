import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
    IconLadybugFill,
    IconTextBubbleFill,
    IconSquareTextSquareFill,
    IconPaperplane,
    IconArrowTriangle2Circlepath,
    IconWaveformPathEcg,
    IconCircleBottomrighthalfCheckered,
    IconPhoto,
    IconQuestionmarkCircle,
    IconCheckmarkCircleFill,
    IconCircle,
    IconPhotoBadgePlus,
    IconMegaphoneFill,
} from "symbols-react"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer-family"

export function DrawerDemo() {
    const [step, setStep] = React.useState(0)
    const [selectedOption, setSelectedOption] = React.useState("")
    const [, setDirection] = React.useState(1);
    const [selectedColor, setSelectedColor] = React.useState("");
    //const [isChecked, setIsChecked] = React.useState(false);

      const nextStep = () => {
      setDirection(1);
          setStep((prevStep) => prevStep + 1);
      };
  
      const getAnimationProps = () => ({
          initial: { opacity: 0.3, scale: 0.98, y: 5},
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0.3, scale: 0.98, y: -5 },
        });
  
      const prevStep = () => {
      setDirection(-1);
          setStep((prevStep) => prevStep - 1);
      };
  
      const handleOptionClick = (option: string, color: string) => {
          setSelectedOption(option);
          setSelectedColor(color);
          nextStep();
        };

    // const handleCheckboxChange = () => {
    //     setIsChecked(!isChecked);
    //   };
  
    const getHeadline = () => {
      if (step === 0) return "How can we help?"
      if (step === 1) return "Choose Areas"
      if (step === 2) {
        switch (selectedOption) {
          case "Report Bug":
            return "Report Bug Details"
          case "Share Feedback":
            return "Share Your Feedback"
          case "Something Else":
            return "Additional Information"
          default:
            return ""
        }
      }
      if (step === 3) return "Attach Media"
      if (step === 4) return "Your Details"
      return ""
    }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
        endIcon={<IconMegaphoneFill className="h-4 w-4 fill-orange-300" />}
        className="rounded-full hover:bg-primary/80">
          Send Feedback
        </Button>
      </DrawerTrigger>
      <DrawerContent hideTitle>
        <div className="mx-auto w-full max-w-sm pb-6 px-6 pt-2.5">
          <DrawerHeader>
            <div className="flex flex-row justify-between">
                <span className="text-xl font-semibold">{getHeadline()}</span>
                {step !== 0 && (
                    <Button onClick={prevStep} className="relative flex items-center justify-center h-8 w-8 rounded-full active:scale-95 transition-all duration-150 ease-in-out mr-[-10px] !overflow-hidden bg-[#F7F8F9] hover:bg-[#F7F8F9]">
                        <div className="text-[#949595]" >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path 
                                d="M10.4854 1.99998L2.00007 10.4853" stroke="#999999" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path><path d="M10.4854 10.4844L2.00007 1.99908" stroke="#999999" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                </path>
                            </svg>
                        </div>
                    </Button>
                )}
                {step === 0 && (
                <DrawerClose asChild>
                    <Button className="relative flex items-center justify-center h-8 w-8 rounded-full active:scale-95 transition-all duration-150 ease-in-out mr-[-10px] !overflow-hidden bg-[#F7F8F9] hover:bg-[#F7F8F9]">
                        <div className="text-[#949595]" >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path 
                                d="M10.4854 1.99998L2.00007 10.4853" stroke="#999999" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path><path d="M10.4854 10.4844L2.00007 1.99908" stroke="#999999" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                </path>
                            </svg>
                        </div>
                    </Button>
                </DrawerClose>
                )}
            </div>

          </DrawerHeader>

        <Separator className="scale-95 mb-3 bg-[#F7F8F9]" />

        {step === 0 && (
          <motion.div 
            className="flex flex-col items-center space-y-4">
            <motion.div
                {...getAnimationProps()}
                className="flex flex-col items-start gap-y-2 w-full">
                <div className="w-full h-auto cursor-pointer rounded-3xl p-4 bg-[#F7F8F9] active:scale-95 transition-all duration-150 ease-in-out" onClick={() => handleOptionClick("Report Bug", "orange-400")}>
                <div className="flex flex-row items-start justify-start space-x-2">
                    <div className="flex items-center justify-center rounded-full bg-orange-400 p-2">
                    <IconLadybugFill className="h-4 w-4 fill-white" />
                    </div>
                    <div className="flex flex-col">
                    <span className="text-md font-medium">Report Bug</span>
                    <span className="text-sm text-primary/60">Let us know about a specific issue you&apos;re experiencing.</span>
                    </div>
                </div>
                </div>
                <div className="w-full h-auto cursor-pointer rounded-3xl p-4 bg-[#F7F8F9] active:scale-95 transition-all duration-150 ease-in-out" onClick={() => handleOptionClick("Share Feedback", "blue-400")}>
                <div className="flex flex-row items-start justify-start space-x-2">
                    <div className="flex items-center justify-center rounded-full bg-blue-400 p-2">
                    <IconTextBubbleFill className="h-4 w-4 fill-white" />
                    </div>
                    <div className="flex flex-col">
                    <span className="text-md font-medium">Share Feedback</span>
                    <span className="text-sm text-primary/60">Let us know how to improve by providing some feedback.</span>
                    </div>
                </div>
                </div>
                <div className="w-full h-auto cursor-pointer rounded-3xl p-4 bg-[#F7F8F9] active:scale-95 transition-all duration-150 ease-in-out" onClick={() => handleOptionClick("Something Else", "green-400")}>
                <div className="flex flex-row items-start justify-start space-x-2">
                    <div className="flex items-center justify-center rounded-full bg-green-400 p-2">
                    <IconSquareTextSquareFill className="h-4 w-4 fill-white" />
                    </div>
                    <div className="flex flex-col">
                    <span className="text-md font-medium">Something Else</span>
                    <span className="text-sm text-primary/60">Request features, leave a nice comment, or anything else.</span>
                    </div>
                </div>
                </div>           
            </motion.div>
          </motion.div>
        )}
        {step === 1 && (
        <motion.div 
            className="flex flex-col items-center space-y-4">
            <motion.div 
                {...getAnimationProps()}
                className="flex flex-col items-start gap-y-2 w-full px-2">
                <div className="flex items-center space-x-2 justify-between w-full cursor-pointer hover:bg-primary/5 p-3 rounded-xl transition-all duration-150 ease-in-out active:scale-[0.98]" onClick={() => document.getElementById('send')?.click()}>
                    <div className="flex items-center space-x-2 flex-row">
                    <IconPaperplane className="h-5 w-5 fill-primary/40" />
                    <label
                        htmlFor="send"
                        className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                        Send
                    </label>
                    </div>
                    <Checkbox 
                        id="send" 
                        baseIcon={<IconCircle className="h-[20px] w-[20px] fill-primary/0 ring-offset-background" />} 
                        checkmarkIcon={<IconCheckmarkCircleFill className={`h-[20px] w-[20px] animate-scale-in-check-family fill-${selectedColor}`} />} 
                    />
                </div>
                <div className="flex items-center space-x-2 justify-between w-full cursor-pointer hover:bg-primary/5 p-3 rounded-xl transition-all duration-150 ease-in-out active:scale-[0.98]" onClick={() => document.getElementById('swaps')?.click()}>
                    <div className="flex items-center space-x-2 flex-row">
                    <IconArrowTriangle2Circlepath className="h-5 w-5 fill-primary/40" />
                    <label
                    htmlFor="swaps"
                    className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                    Swaps
                    </label>
                    </div>
                    <Checkbox 
                        id="swaps" 
                        baseIcon={<IconCircle className="h-[20px] w-[20px] fill-primary/0 ring-offset-background" />} 
                        checkmarkIcon={<IconCheckmarkCircleFill className={`h-[20px] w-[20px] animate-scale-in-check-family fill-${selectedColor}`} />} 
                    />
                </div>
                <div className="flex items-center space-x-2 justify-between w-full cursor-pointer hover:bg-primary/5 p-3 rounded-xl transition-all duration-150 ease-in-out active:scale-[0.98]" onClick={() => document.getElementById('activity')?.click()}>
                    <div className="flex items-center space-x-2 flex-row">
                    <IconWaveformPathEcg className="h-5 w-5 fill-primary/40" />
                    <label
                    htmlFor="activity"
                    className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                    Activity
                    </label>
                    </div>
                    <Checkbox 
                        id="activity" 
                        baseIcon={<IconCircle className="h-[20px] w-[20px] fill-primary/0 ring-offset-background" />} 
                        checkmarkIcon={<IconCheckmarkCircleFill className={`h-[20px] w-[20px] animate-scale-in-check-family fill-${selectedColor}`} />} 
                    />
                </div>
                <div className="flex items-center space-x-2 justify-between w-full cursor-pointer hover:bg-primary/5 p-3 rounded-xl transition-all duration-150 ease-in-out active:scale-[0.98]" onClick={() => document.getElementById('tokens')?.click()}>
                    <div className="flex items-center space-x-2 flex-row">
                    <IconCircleBottomrighthalfCheckered className="h-5 w-5 fill-primary/40" />
                    <label
                    htmlFor="tokens"
                    className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                    Tokens
                    </label>
                    </div>
                    <Checkbox 
                        id="tokens" 
                        baseIcon={<IconCircle className="h-[20px] w-[20px] fill-primary/0 ring-offset-background" />} 
                        checkmarkIcon={<IconCheckmarkCircleFill className={`h-[20px] w-[20px] animate-scale-in-check-family fill-${selectedColor}`} />} 
                    />
                </div>
                <div className="flex items-center space-x-2 justify-between w-full cursor-pointer hover:bg-primary/5 p-3 rounded-xl transition-all duration-150 ease-in-out active:scale-[0.98]" onClick={() => document.getElementById('collectables')?.click()}>
                    <div className="flex items-center space-x-2 flex-row">
                    <IconPhoto className="h-5 w-5 fill-primary/40" />
                    <label
                    htmlFor="collectables"
                    className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                    Collectables
                    </label>
                    </div>
                    <Checkbox 
                        id="collectables" 
                        baseIcon={<IconCircle className="h-[20px] w-[20px] fill-primary/0 ring-offset-background" />} 
                        checkmarkIcon={<IconCheckmarkCircleFill className={`h-[20px] w-[20px] animate-scale-in-check-family fill-${selectedColor}`} />} 
                    />
                </div>
                <div className="flex items-center space-x-2 justify-between w-full cursor-pointer hover:bg-primary/5 p-3 rounded-xl transition-all duration-150 ease-in-out active:scale-[0.98]" onClick={() => document.getElementById('other')?.click()}>
                    <div className="flex items-center space-x-2 flex-row">
                    <IconQuestionmarkCircle className="h-5 w-5 fill-primary/40" />
                    <label
                    htmlFor="other"
                    className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                    Other
                    </label>
                    </div>
                    <Checkbox 
                        id="other" 
                        baseIcon={<IconCircle className="h-[20px] w-[20px] fill-primary/0 ring-offset-background" />} 
                        checkmarkIcon={<IconCheckmarkCircleFill className={`h-[20px] w-[20px] animate-scale-in-check-family fill-${selectedColor}`} />}
                    />
                </div>
            </motion.div>
            <div className="w-full">
                <Button variant="default" className={`w-full h-12 text-lg rounded-full bg-${selectedColor} hover:bg-${selectedColor}/90`} onClick={nextStep}>Continue</Button>
            </div>
        </motion.div>
        )}
        {step === 2 && (
          <motion.div className="flex flex-col items-center space-y-4">
            <motion.div 
                {...getAnimationProps()}
                className="flex flex-col items-start gap-y-2 w-full px-2">
                <Input placeholder="Subject" className="bg-[#F7F8F9] h-12 rounded-xl border-[#F7F8F9] placeholder:text-primary/30 placeholder:font-medium font-medium" />
                <Textarea placeholder="Describe the issue in more detail, including steps to reproduce" className="bg-[#F7F8F9] rounded-xl border-[#F7F8F9] placeholder:text-primary/30 placeholder:font-medium font-medium h-[150px]" />
            </motion.div>
            <div className="w-full">
            <Button variant="default" className={`w-full h-12 text-lg rounded-full bg-${selectedColor} hover:bg-${selectedColor}/90`} onClick={nextStep}>Continue</Button>
            </div>
          </motion.div>
        )}
        {step === 3 && (
        <motion.div className="flex flex-col items-center gap-y-2">
            <div className="flex flex-col items-center p-2">
                <motion.div 
                {...getAnimationProps()}
                className="flex flex-col items-center justify-center w-full h-[180px] border-2 border-[#F7F8F9] rounded-2xl cursor-pointer"
                onClick={() => document.getElementById('file-upload')?.click()}
                >
                <input id="file-upload" type="file" className="hidden" />
                <TooltipProvider>
                    <Tooltip defaultOpen={true} delayDuration={0}>
                        <TooltipTrigger asChild>
                            <IconPhotoBadgePlus className="h-[80px] w-[80px] fill-gray-300" />
                        </TooltipTrigger>
                    <TooltipContent className="text-xs font-medium border border-primary/5 bg-primary text-white">
                        Tap to add attachments
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <div className="text-center text-[10px] text-pretty px-2">
                    <span className="text-gray-400">If you&apos;d like, upload any helpful screenshots or screen recordings. Do not include any private, sensitive, or inappropriate imagery.</span>
                </div>
                </motion.div>
            </div>
            <div className="w-full">
            <Button variant="default" className={`w-full h-12 text-lg rounded-full bg-${selectedColor} hover:bg-${selectedColor}/90`} onClick={nextStep}>Submit</Button>
            </div>
        </motion.div>
        )}
        {step === 4 && (
            <div className="flex flex-col items-center">
                <motion.div 
                    {...getAnimationProps()}
                    className="flex flex-col items-center text-left gap-y-2 w-full"
                    >
                    <div className="flex flex-col px-2 gap-y-2">
                    <div className="text-left text-md text-pretty px-2 mb-1">
                     <span className="text-primary/50">Please let us know your email so we can follow up if we need to.</span>
                    </div>
                    <Input placeholder="Name" className="bg-[#F7F8F9] h-12 rounded-xl border-[#F7F8F9] placeholder:text-primary/30 placeholder:font-medium font-medium" />
                    <Input placeholder="name@email.com" className="bg-[#F7F8F9] h-12 rounded-xl border-[#F7F8F9] placeholder:text-primary/30 placeholder:font-medium font-medium" />
                    <div className="flex flex-row items-center justify-between w-full h-12 bg-[#F7F8F9] rounded-xl p-2 pl-4 cursor-pointer active:scale-95 transition-all duration-150 ease-in-out">
                        <span className="text-md font-medium">Wallet</span>
                        <Avatar className="h-6 w-6">
                            <AvatarImage src="" alt="Burger.eth" />
                            <AvatarFallback className="text-md bg-green-400 rounded-full">🌮</AvatarFallback>
                        </Avatar>
                    </div>
                    </div>

                    <DrawerClose asChild>
                            <Button variant="default" className={`w-full h-12 text-lg rounded-full bg-${selectedColor} hover:bg-${selectedColor}/90`} onClick={() => setStep(0)}>Continue to Report</Button>
                    </DrawerClose>
                </motion.div>
            </div>

        )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
