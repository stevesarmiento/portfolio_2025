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
import { IconScribble } from "symbols-react";

export default function Playground() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <main className="h-screen w-full bg-[#e8f0ff] overflow-hidden">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -5, filter: 'blur(5px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.3 }}        
        className="group relative flex flex-row items-center justify-center gap-2 w-full p-4 z-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(46, 77, 97, 0.05) 10px,
            rgba(46, 77, 97, 0.05) 11px
          )`
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex-col text-center">
          <span className="text-lg text-[#2E4D61] font-nuvo flex flex-row items-center gap-x-1">
            <IconScribble className="w-5 h-5 fill-[#2E4D61]/30 mr-2" />
            <AnimatedText text="Playground" isAnimating={isHovering} />
            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>_</motion.span>
          </span>
        </div>
      </motion.div>

      {/* 4x2 Grid Layout */}
      <motion.div 
        initial={{ opacity: 0, y: 5, filter: 'blur(5px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className="grid grid-cols-12 divide-x divide-y divide-[#b3ccff] divide-dashed h-[calc(100vh-60px)] w-full overflow-y-auto"
      >
        {/* Row 1 - Left */}
        <div className="p-6 flex flex-col items-center justify-center col-span-4 border-t border-[#2E4D61]/30 border-dashed">
          <div className="flex h-full w-full items-center justify-center rounded-[23px] ring-slate-700/10 ring-[1px] mb-3">
            <FamilyWalletCreation />
          </div>
          <div className="text-left w-full">
            <h2 className="text-base font-nuvo text-[#2E4D61]/40 mb-1">Family Wallet Creation</h2>
            <span className="text-xs text-[#2E4D61]/80">Wallet creation animation experiment</span>
          </div>
        </div>

        {/* Row 2 - Left */}
        <div className="p-6 flex flex-col items-center justify-center col-span-4 ">
          <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-[#2E4D61]/10 bg-bkg-ios-bkg bg-cover bg-center ring-slate-700/10 ring-[1px] mb-3">
            <IosAppFolder />
          </div>
          <div className="text-left w-full">
            <h2 className="text-base font-nuvo text-[#2E4D61]/40 mb-1">iOS App Folder</h2>
            <span className="text-xs text-[#2E4D61]/80">iOS folder animation replica</span>
          </div>
        </div>

        {/* Row 1 - Right */}
        <div className="grid grid-cols-1 divide-y divide-[#b3ccff] divide-dashed col-span-4">
          <div className="p-6 flex flex-col items-center justify-center col-span-1">
            <div 
            className="flex h-full w-full items-center justify-center rounded-[20px] ring-slate-700/10 ring-[1px] mb-3"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(46, 77, 97, 0.05) 10px,
                rgba(46, 77, 97, 0.05) 11px
              )`
            }}>
              <WalletModal />
            </div>
            <div className="text-left w-full">
              <h2 className="text-base font-nuvo text-[#2E4D61]/40 mb-1">Wallet Info Modal</h2>
              <span className="text-xs text-[#2E4D61]/80">Transitional animations experiment</span>
            </div>
          </div>


          {/* Row 2 - Right */}
          <div className="p-6 flex flex-col items-center justify-center col-span-1 ">
          <div 
            className="flex h-full w-full items-center justify-center rounded-[20px] ring-slate-700/10 ring-[1px] mb-3"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(46, 77, 97, 0.05) 10px,
                rgba(46, 77, 97, 0.05) 11px
              )`
            }}>
              <WalletCommander />
            </div>
            <div className="text-left w-full">
              <h2 className="text-base font-nuvo text-[#2E4D61]/40 mb-1">Wallet CMD + K</h2>
              <span className="text-xs text-[#2E4D61]/80">Natural language wallet interface</span>
            </div>
          </div>          
        </div>


        {/* Row 3 - Left */}
        <div className="p-6 flex flex-col items-center justify-center col-span-4 ">
        <div 
            className="flex h-full w-full items-center justify-center rounded-[20px] ring-slate-700/10 ring-[1px] mb-3"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(46, 77, 97, 0.05) 10px,
                rgba(46, 77, 97, 0.05) 11px
              )`
            }}>
            <FamilyGasSelector isDark={false} />
          </div>
          <div className="text-left w-full">
            <h2 className="text-base font-nuvo text-[#2E4D61]/40 mb-1">Family TX Confirmation</h2>
            <span className="text-xs text-[#2E4D61]/80">Transaction simulator with gas selector</span>
          </div>
        </div>

        {/* Row 3 - Right */}
        <div className="p-6 flex flex-col items-center justify-center col-span-4 ">
        <div 
            className="flex h-full w-full items-center justify-center rounded-[20px] ring-slate-700/10 ring-[1px] mb-3"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(46, 77, 97, 0.05) 10px,
                rgba(46, 77, 97, 0.05) 11px
              )`
            }}>
            <DrawerDemo />
          </div>
          <div className="text-left w-full">
            <h2 className="text-base font-nuvo text-[#2E4D61]/40 mb-1">Family Feedback Modal</h2>
            <span className="text-xs text-[#2E4D61]/80">Family feedback modal with drawer</span>
          </div>
        </div>

        {/* Row 4 - Left */}
        <div className="p-6 flex flex-col items-center justify-center col-span-4 ">
        <div 
            className="flex h-full w-full items-center justify-center rounded-[20px] ring-slate-700/10 ring-[1px] mb-3"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(46, 77, 97, 0.05) 10px,
                rgba(46, 77, 97, 0.05) 11px
              )`
            }}>
            <FamilyActionButton />
          </div>
          <div className="text-left w-full">
            <h2 className="text-base font-nuvo text-[#2E4D61]/40 mb-1">Family Action Button</h2>
            <span className="text-xs text-[#2E4D61]/80">Action button with state transitions</span>
          </div>
        </div>

        {/* Row 4 - Right - Empty for future component */}
        <div className="p-6 flex-col items-center justify-center col-span-3 hidden">
          <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-[#2E4D61]/5 border border-dashed border-[#2E4D61]/20 mb-3">
            <div className="text-center text-[#2E4D61]/30">
              <IconScribble className="w-10 h-10 fill-[#2E4D61]/30" />
            </div>
          </div>
          <div className="text-left w-full">
            <h2 className="text-base font-nuvo text-[#2E4D61]/30 mb-1">Coming Soon</h2>
            <span className="text-xs text-[#2E4D61]/40">Space for your next experiment</span>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

