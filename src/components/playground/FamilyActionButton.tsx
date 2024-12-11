"use client"

import React, { useState, useEffect, useRef } from "react"
import {
    IconArrowTrianglehead2Clockwise,
    IconPlus,
    IconArrowDown,
    IconPaperplaneFill,
} from "symbols-react"
import { motion, AnimatePresence } from "framer-motion"

export function FamilyActionButton() {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
  
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && (ref.current as HTMLElement).contains && !(ref.current as HTMLElement).contains(event.target as Node)) {
              setIsOpen(false);
          }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);

  return (
    <AnimatePresence>
      <div ref={ref} className="w-full flex flex-col justify-center items-center">
        {!isOpen ? (
          <motion.div 
            layoutId="family-button" 
            className="flex flex-row items-center justify-center group p-1 rounded-full w-[40px] h-[40px] transition-all duration-150 ease-in-out bg-primary hover:bg-primary/90 border-[1px] border-white/5 shadow-lg shadow-black/40 cursor-pointer"
            transition={{ type: "spring", stiffness: 500, damping: 30}} 
            style={{ transformOrigin: "bottom right" }}           
            onClick={() => setIsOpen(true)}
          >           
            <IconPlus className="h-[16px] w-[16px] fill-white/90" />
          </motion.div>
        ) : (
          <motion.div 
            layoutId="family-button" 
            className="bg-primary h-[226px] w-[300px] rounded-[18px] p-1 cursor-pointer shadow-lg shadow-black/40"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{ transformOrigin: "bottom right" }}

          >
            <div className="flex flex-col items-center justify-between w-full space-y-1">
              <div className="w-[290px] cursor-pointer rounded-[13px] p-2 bg-accent/5 border-[1px] border-white/5 hover:bg-accent/10 active:scale-95 transition-all duration-150 ease-in-out">
                <div className="flex flex-row items-start justify-start space-x-2">
                  <div className="flex items-center justify-center rounded-full bg-blue-500 p-2">
                    <IconPaperplaneFill className="h-4 w-4 fill-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">Send</span>
                    <span className="text-xs text-white/60">Send tokens or collectables to any address or ENS username.</span>
                  </div>
                </div>
              </div>
              <div className="w-[290px] cursor-pointer rounded-[13px] p-2 bg-accent/5 border-[1px] border-white/5 hover:bg-accent/10 active:scale-95 transition-all duration-150 ease-in-out">
                <div className="flex flex-row items-start justify-start space-x-2">
                  <div className="flex items-center justify-center rounded-full bg-gray-500 p-2">
                    <IconArrowTrianglehead2Clockwise className="h-4 w-4 fill-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">Swap</span>
                    <span className="text-xs text-white/60">Swap your tokens without ever leaving your wallet</span>
                  </div>
                </div>
              </div>
              <div className="w-[290px] cursor-pointer rounded-[13px] p-2 bg-accent/5 border-[1px] border-white/5 hover:bg-accent/10 active:scale-95 transition-all duration-150 ease-in-out">
                <div className="flex flex-row items-start justify-start space-x-2">
                  <div className="flex items-center justify-center rounded-full bg-green-500 p-2">
                    <IconArrowDown className="h-4 w-4 fill-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">Receive</span>
                    <span className="text-xs text-white/60">Receive Ethereum based assets through your unique address.</span>
                  </div>
                </div>
              </div>           
            </div>
          </motion.div>
        )}
      </div> 
    </AnimatePresence>
  )
}