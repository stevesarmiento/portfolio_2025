import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { IconEyes, IconApplescript } from "symbols-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

export default function AboutMe() {
    const [isExpanded, setIsExpanded] = useState(true);

    const variants = {
      hidden: { opacity: 0, filter: "blur(4px)" },
      visible: { opacity: 1, filter: "blur(0px)" }
    };

  return (
    <div className="flex flex-col items-left w-full">
      <div className="flex flex-col items-left font-nuvo gap-y-6 mt-6 px-4 ">
        {/* <h2 className="text-lg font-nuvo text-zinc-50/30/30">TLDR;</h2> */}


        <p className="group text-2xl text-zinc-50 hover:text-zinc-50 cursor-crosshair transition-all duration-150 ease-in-out">
          <span className="group-hover:border-b-2 border-dotted group-hover:border-zinc-50/50">I&apos;m a designer &amp; engineer who <br /> enjoys crafting thoughtful <br />design into code</span>.
        </p>

        <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                  variant="link"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="group text-lg font-nuvo text-zinc-50/50 hover:text-zinc-50 transition-colors duration-150 ease-in-out mr-auto p-0"
                  endIcon={isExpanded ? <IconApplescript className="mt-[2px] w-5 h-5 fill-zinc-50/50 group-hover:fill-zinc-50" />: <IconEyes className="mt-[2px] w-5 h-5 fill-zinc-50/50 group-hover:fill-zinc-50" />}
                >
                  {isExpanded ? <span style={{ textDecoration: "line-through" }}>TLDR;</span> : "TLDR;"}
                </Button>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                sideOffset={10}
                className="text-zinc-50 bg-zinc-950 border border-zinc-50/10 text-xs font-nuvo shadow-none"
              >
                dive deeper
              </TooltipContent>
            </Tooltip>          
          </TooltipProvider>
        <AnimatePresence>

          {isExpanded && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col items-left gap-y-6 w-[600px]"
              variants={variants}
              transition={{ duration: 0.5 }}
            >
              <p className="group text-md text-zinc-50/50 hover:text-zinc-50/30 cursor-crosshair transition-all duration-150 ease-in-out">
                Today, <span className="group-hover:border-b-2 border-dotted group-hover:border-[#2E4D61]/70">I&apos;m helping move internet capital markets forward with the  
                <a href="https://solana.foundation" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 group-hover:border-b-2 group-hover:border-[#ffb7b7] inline-flex space-x-1 items-center gap-1 ml-2">
                  <Image 
                    src="/img/work-solana.png" 
                    alt="Solana Foundation" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1" 
                  />
                  Solana Foundation
                </a></span>.
              </p>

              <p className="group text-md text-zinc-50/50 hover:text-zinc-50/30 cursor-crosshair transition-all duration-150 ease-in-out">
                I&apos;ve built some things - <span className="group-hover:border-b-2 border-dotted group-hover:border-[#2E4D61]/70">
                <a href="https://capi.dev" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 group-hover:border-b-2 group-hover:border-[#ffb7b7] inline-flex space-x-1 items-center gap-1 ml-1">
                  <Image 
                    src="/img/work-capi.png" 
                    alt="Capi" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1" 
                  />
                  Capi
                </a>, 
                <a href="https://symbols.dev" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 group-hover:border-b-2 group-hover:border-[#ffb7b7] inline-flex space-x-1 items-center gap-1 ml-1">
                  <Image 
                    src="/img/work-symbols.png" 
                    alt="Symbols" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1" 
                  />
                  Symbols
                </a>, and 
                <a href="https://svela.xyz" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 group-hover:border-b-2 group-hover:border-[#ffb7b7] inline-flex space-x-1 items-center gap-1 ml-3">
                  <Image 
                    src="/img/work-svela.png" 
                    alt="Svela" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1" 
                  />
                  Svela
                </a></span>.
              </p>

              <p className="group text-md text-zinc-50/50 hover:text-zinc-50/30 cursor-crosshair transition-all duration-150 ease-in-out">
                Most recently, <span className="group-hover:border-b-2 border-dotted group-hover:border-[#2E4D61]/70">I helped startups, like 
                <a href="https://metadao.fi" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 group-hover:border-b-2 group-hover:border-[#ffb7b7] inline-flex space-x-1 items-center gap-1 ml-2">
                  <Image 
                    src="/img/work-metadao.png" 
                    alt="MetaDAO" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1" 
                  />
                  MetaDAO
                </a>, 
                <a href="https://triton.one" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 group-hover:border-b-2 group-hover:border-[#ffb7b7] inline-flex space-x-1 items-center gap-1 ml-2">
                  <Image 
                    src="/img/work-triton.png" 
                    alt="Triton" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1" 
                  />
                  Triton
                </a>, and 
                <a href="https://vapi.ai" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 group-hover:border-b-2 group-hover:border-[#ffb7b7] inline-flex space-x-1 items-center gap-1 ml-2">
                  <Image 
                    src="/img/work-vapi.png" 
                    alt="Vapi" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1" 
                  />
                  Vapi
                </a>, with product design and engineering.</span>
              </p>

              <p className="group text-md text-zinc-50/50 hover:text-zinc-50/30 cursor-crosshair transition-all duration-150 ease-in-out">
                Previously, <span className="group-hover:border-b-2 border-dotted group-hover:border-[#2E4D61]/70">I was a contributor to 
                <a href="https://mango.markets" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 group-hover:border-b-2 group-hover:border-[#ffb7b7] inline-flex space-x-1 items-center gap-1 ml-2">
                  <Image 
                    src="/img/work-mango.png" 
                    alt="Mango" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1" 
                  />
                  Mango
                </a> a defi protocol. and was on the marketing team for 
                <a href="https://www.nasdaq.com/articles/coinbase-acquires-crypto-wallet-firm-brd" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 group-hover:border-b-2 group-hover:border-[#ffb7b7] inline-flex items-center gap-1 ml-2">
                  <Image 
                    src="/img/work-brd.png" 
                    alt="BRD" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1" 
                  />
                  BRD
                </a> a crypto wallet.</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};