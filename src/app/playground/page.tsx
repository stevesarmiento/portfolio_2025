"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FamilyActionButton } from "@/components/playground/FamilyActionButton";
import { FamilyGasSelector } from "@/components/playground/FamilyGasSelector";
import { DrawerDemo } from "@/components/playground/DrawerDemo";
import { IosAppFolder } from "@/components/playground/IosAppFolder";
import { WalletCommander } from "@/components/playground/WalletCommander";
import { WalletModal } from "@/components/playground/WalletModal";
import FamilyWalletCreation from "@/components/playground/FamilyWalletCreation";
import { AnimatedText } from "@/components/ui/animated-text";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export default function Playground() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <main className="flex flex-col items-center text-[#2E4D61] bg-[#E1E7F3]">
      <div className="flex flex-col w-[320px] sm:w-[600px] mx-auto gap-y-2 mb-8 items-center justify-between py-24 border-l border-r border-dashed border-[#2E4D61]/30">
      <motion.div 
          initial={{ opacity: 0, y: -5, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.3 }}        
          className="group relative flex flex-row items-center justify-start gap-2 w-full p-2 px-4 border-b border-t border-[#2E4D61]/30 border-dashed"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          >
          <div className="flex-col text-right">
              <span className="text-lg text-[#2E4D61] font-nuvo flex flex-row items-center gap-x-1">
                <AnimatedText text="Playground" isAnimating={isHovering} />
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
          className="w-full mt-[40px]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">

            <div className="flex flex-col col-span-2 gap-y-2 mb-8">
            <div className="flex h-[450px] items-center justify-center p-8 rounded-[30px] bg-[#2E4D61]/10 bg-grid bg-contain bg-center ring-slate-700/10 ring-[1px] ">
              <FamilyWalletCreation />
              </div>
              <div className="px-4 text-left w-[320px]">
                <h2 className="text-lg font-nuvo text-[#2E4D61]/40">Family Wallet Creation</h2>
                <span className="text-sm text-[#2E4D61]/80">An experiment recreating the wallet creation animation from family wallet. </span>
              </div>
            </div>

            <div className="flex flex-col col-span-2 gap-y-2 mb-8">
            <div className="flex h-[300px] items-center justify-center p-8 rounded-[30px] bg-[#2E4D61]/10 bg-grid bg-contain bg-center ring-slate-700/10 ring-[1px] ">
              <WalletModal />
              </div>
              <div className="px-4 text-left w-[320px]">
                <h2 className="text-lg font-nuvo text-[#2E4D61]/40">Wallet Info Modal</h2>
                <span className="text-sm text-[#2E4D61]/80">An experiment in transitional animations using consistent element throught out states. </span>
              </div>
            </div>

            <div className="flex flex-col col-span-2 gap-y-2 mb-8">
              <div className="flex h-[450px] items-center justify-center p-8 rounded-[30px] bg-[#2E4D61]/10 bg-bkg-ios-bkg bg-cover bg-center ring-slate-700/10 ring-[1px] ">
              <IosAppFolder />
              </div>
              <div className="px-4 text-left w-[320px]">
                <h2 className="text-lg font-nuvo text-[#2E4D61]/40">iOS App Folder</h2>
                <span className="text-sm text-[#2E4D61]/80">Replicating the iOS app folder open animation using shadcn/ui and framer motion.</span>
              </div>
            </div>

            <div className="flex flex-col col-span-2 gap-y-2 mb-8">
              <div className="flex h-[300px] items-center justify-center p-8 rounded-[30px] bg-[#2E4D61]/10 bg-grid bg-contain bg-center ring-slate-700/10 ring-[1px] ">
                <WalletCommander />
              </div>
              <div className="px-4 text-left w-[320px]">
                <h2 className="text-lg font-nuvo text-[#2E4D61]/40">Wallet CMD + K</h2>
                <span className="text-sm text-[#2E4D61]/80">Wallet Commander is a natural language interface experiment for your wallet built with shadcn/ui.</span>
              </div>
            </div>

            <div className="flex flex-col col-span-2 gap-y-2 mb-8">
              <div className="flex h-[450px] items-center justify-center p-8 rounded-[30px] bg-[#2E4D61]/10 bg-grid bg-contain bg-center ring-slate-700/10 ring-[1px] ">
              <FamilyGasSelector isDark={false} />
              </div>
              <div className="px-4 text-left w-[320px]">  
                <h2 className="text-lg font-nuvo text-[#2E4D61]/40">Family TX Confirmation</h2>
                <span className="text-sm text-[#2E4D61]/80">Transaction simulator with gas selector from family wallet built with shadcn/ui and framer motion.</span>
              </div>
            </div>

            <div className="flex flex-col col-span-2 gap-y-2 mb-8">
              <div className="flex h-[300px] items-center justify-center p-8 rounded-[30px] bg-[#2E4D61]/10 bg-grid bg-contain bg-center ring-slate-700/10 ring-[1px] ">
                <DrawerDemo />
              </div>
              <div className="px-4 text-left w-[320px]">
                <h2 className="text-lg font-nuvo text-[#2E4D61]/40">Family Feedback Modal</h2>
                <span className="text-sm text-[#2E4D61]/80">Family feedback modal demo built with shadcn drawer and animated using framer motion.</span>
              </div>
            </div>

            <div className="flex flex-col col-span-2 gap-y-2 mb-8">
              <div className="flex h-[300px] items-center justify-center p-8 rounded-[30px] bg-[#2E4D61]/10 bg-grid bg-contain bg-center ring-slate-700/10 ring-[1px] ">
                <FamilyActionButton />
              </div>
              <div className="px-4 text-left w-[320px]">
                <h2 className="text-lg font-nuvo text-[#2E4D61]/40">Family Action Button</h2>
                <span className="text-sm text-[#2E4D61]/80">Family action button built transitioning between states using framer motion.</span>
              </div>
            </div>

          </div>
        </motion.div>
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