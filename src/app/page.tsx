"use client";

import { useState, useEffect } from "react";
import { 
  IconLaurelLeading,
  IconLaurelTrailing,
  IconSealFill, 
  IconArrowUpForward,
  IconGithubLogo,
} from "symbols-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import InitialLoader from "@/components/InitialLoader";
import InteractiveIntro from "@/components/InteractiveIntro";
import SeparatorDots from "@/components/SeparatorDots";

import Work from "@/components/Work";
import GithubSection from "@/components/GithubSection";
import { AnimatedText } from "@/components/ui/animated-text";
import AboutMe from "@/components/AboutMe";
import CommunityLinks from "@/components/CommunityLinks";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <InitialLoader />;
  }

  return (
    <main className="flex flex-col items-center text-[#2E4D61] bg-[#E1E7F3] overflow-hidden">
      <div 
          className="flex flex-col w-[300px] mx-auto xl:w-[600px] gap-y-2 items-center justify-between py-24 border-l border-r border-dashed border-[#2E4D61]/30">
        <motion.div 
          initial={{ opacity: 0, y: -5, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.3 }}        
          className="group relative flex flex-row items-center justify-start gap-2 w-full p-2 border-b border-t border-[#2E4D61]/30 border-dashed"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          >
          <div className="relative hover:cursor-crosshair hover:scale-110 active:scale-95 transition-all duration-150 ease-in-out">
            <IconSealFill className=" h-[24px] w-[24px] fill-[#2E4D61] group-hover:fill-slate-150 transition-all duration-150 ease-in-out group-hover:animate-spin-slow" />
            <h1 className="absolute left-[9px] top-[3.5px] text-xs font-rafaella text-white transition-all duration-150 ease-in-out">S</h1>
          </div>
          <div className="flex-col text-right">
              <span className="text-lg text-[#2E4D61] font-nuvo flex flex-row items-center gap-x-1">
                <AnimatedText text="Steven Sarmi" isAnimating={isHovering} />
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>_</motion.span>
              </span>
            </div>
            <Icon className="absolute h-6 w-6 -top-[13px] -left-[13px]  text-[#2E4D61] p-1 bg-[#E1E7F3]" />
            <Icon className="absolute h-6 w-6 -bottom-[13px] -left-[13px]  text-[#2E4D61] p-1 bg-[#E1E7F3]" />
            <Icon className="absolute h-6 w-6 -top-[13px] -right-[11px] text-[#2E4D61] p-1 bg-[#E1E7F3]" />
            <Icon className="absolute h-6 w-6 -bottom-[13px] -right-[11px] text-[#2E4D61] p-1 bg-[#E1E7F3]" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 5, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="flex flex-col w-[300px] mx-auto xl:w-[600px] items-center justify-center gap-y-2 mt-[40px]">
            <InteractiveIntro />
            <AboutMe /> 
            <CommunityLinks />
            <SeparatorDots />
            <div className="w-full relative ">
              <div className="relative flex flex-row items-center font-nuvo gap-x-3 mb-2 border-b border-t border-[#2E4D61]/30 border-dashed px-4 py-2">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <a 
                        href="https://github.com/stevesarmiento" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group inline-flex items-center text-xl font-bold text-[#2E4D61] cursor-pointer hover:text-[#2E4D61]/70 transition-colors duration-150"
                      >
                        <AnimatedText text="Work" isAnimating={isHovering} />
                        <IconArrowUpForward className="ml-2 w-[10px] h-[10px] transition-all duration-150 ease-in-out fill-[#2E4D61]/50 group-hover:fill-[#2E4D61] translate-y-[1px] group-hover:translate-y-[-1px]" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-[#E1E7F3] text-[#2E4D61]/50 border-none font-nuvo shadow-none">
                      Check out my <IconGithubLogo className="w-[18px] h-[18px] fill-[#2E4D61]/50 inline-block align-middle" /> Github
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Icon className="absolute h-6 w-6 -top-[13px] -left-[13px]  text-[#2E4D61] p-1 bg-[#E1E7F3]" />
                <Icon className="absolute h-6 w-6 -bottom-[13px] -left-[13px]  text-[#2E4D61] p-1 bg-[#E1E7F3]" />
                <Icon className="absolute h-6 w-6 -top-[13px] -right-[11px] text-[#2E4D61] p-1 bg-[#E1E7F3]" />
                <Icon className="absolute h-6 w-6 -bottom-[13px] -right-[11px] text-[#2E4D61] p-1 bg-[#E1E7F3]" />
              </div>
              <div className="w-full relative">
                <div className="w-full sm:flex hidden justify-center items-center py-4">
                  <GithubSection />
                </div>
              </div>
              <div className="relative w-full pt-4 pb-6 px-6">
                <Work />
              </div>
            </div>
        </motion.div>

          <div className="flex flex-col items-left justify-center gap-y-2 w-full my-12">
            <div className="relative flex items-center justify-center w-full">
              <div className="absolute h-[1px] w-full border-t border-[#2E4D61]/30 border-dashed"></div>
              <div className="group absolute bg-[#E1E7F3] flex flex-row items-center justify-center border-[#2E4D61]/30 ring-[8px] ring-[#E1E7F3]">
                <IconLaurelLeading className="h-[50px] w-[20px] fill-slate-400 group-hover:fill-[#2E4D61] transition-all duration-150 ease-in-out" />
                <div className="bg-[#E1E7F3] p-1 relative hover:cursor-crosshair hover:scale-110 active:scale-95 transition-all duration-150 ease-in-out">
                  <IconSealFill className=" h-[50px] w-[50px] fill-[#2E4D61]/70 group-hover:fill-[#2E4D61] transition-all duration-150 ease-in-out group-hover:animate-spin-slow" />
                  <span className="absolute left-[11px] top-[15px] text-lg font-rafaella text-white transition-all duration-150 ease-in-out">1989</span>
                </div> 
                <IconLaurelTrailing className="h-[50px] w-[20px] fill-slate-400 group-hover:fill-[#2E4D61] transition-all duration-150 ease-in-out" />
              </div>
              <Icon className="absolute h-6 w-6 -bottom-[13px] -left-[13px]  text-[#2E4D61] p-1 bg-[#E1E7F3]" />
              <Icon className="absolute h-6 w-6 -bottom-[13px] -right-[11px] text-[#2E4D61] p-1 bg-[#E1E7F3]" />
            </div>
          </div>
      </div>
    </main>
  );
}

const Icon = ({ className, ...rest }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};