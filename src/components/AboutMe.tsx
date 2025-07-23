import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { IconEyes, IconApplescript, IconPlus } from "symbols-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

export default function AboutMe() {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showMoreProjects, setShowMoreProjects] = useState(false);

    const variants = {
      hidden: { opacity: 0, filter: "blur(4px)" },
      visible: { opacity: 1, filter: "blur(0px)" }
    };

  return (
    <div className="flex flex-col items-left w-full">
      <div className="flex flex-col items-left font-nuvo gap-y-6 mt-6 px-4 ">
        {/* <h2 className="text-lg font-nuvo text-zinc-50/30/30">TLDR;</h2> */}

        <p className="group text-3xl text-zinc-50 hover:text-zinc-50 cursor-crosshair transition-all duration-150 ease-in-out">
          <span className="border-b-2 border-transparent border-dotted group-hover:border-zinc-50/20">I design thoughtful experiences &amp; solve problems with code.</span>
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
               {isExpanded ? "Less is more" : "Dive deeper"}
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
                Today, <span className="border-b-2 border-transparent border-dotted group-hover:border-zinc-50/20">I&apos;m building tools to help move internet capital markets forward for the  
                <a href="https://solana.com" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 border-b-2 border-transparent group-hover:border-[#ffb7b7] inline-flex space-x-1 items-baseline gap-1 ml-2">
                  <Image 
                    src="/img/work-solana.png" 
                    alt="Solana Foundation" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1 transform translate-y-[2.5px]" 
                  />
                  Solana ecosystem.
                </a></span>
              </p>

              <p className="group text-md text-zinc-50/50 hover:text-zinc-50/30 cursor-crosshair transition-all duration-150 ease-in-out">
                Most recently, <span className="border-b-2 border-transparent border-dotted group-hover:border-zinc-50/20">I worked with startups like 
                <a href="https://metadao.fi" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 border-b-2 border-transparent group-hover:border-[#ffb7b7] inline-flex space-x-1 items-baseline gap-1 ml-2">
                  <Image 
                    src="/img/work-metadao.png" 
                    alt="MetaDAO" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1 transform translate-y-[2.5px]" 
                  />
                  MetaDAO
                </a>, 
                <br />
                <a href="https://triton.one" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 border-b-2 border-transparent group-hover:border-[#ffb7b7] inline-flex space-x-1 items-baseline gap-1">
                  <Image 
                    src="/img/work-triton.png" 
                    alt="Triton" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1 transform translate-y-[2.5px]" 
                  />
                  Triton
                </a>, and 
                <a href="https://vapi.ai" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 border-b-2 border-transparent group-hover:border-[#ffb7b7] inline-flex space-x-1 items-baseline gap-1 ml-2">
                  <Image 
                    src="/img/work-vapi.png" 
                    alt="Vapi" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1 transform translate-y-[2.5px] transform translate-y-[2.5px]" 
                  />
                  Vapi
                </a> on product, design and <br />engineering.</span>
              </p>

              <p className="group text-md text-zinc-50/50 hover:text-zinc-50/30 cursor-crosshair transition-all duration-150 ease-in-out">
                I&apos;ve also built some things - <span className="border-b-2 border-transparent border-dotted group-hover:border-zinc-50/20">
                <a href="https://capi.dev" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 border-b-2 border-transparent group-hover:border-[#ffb7b7] inline-flex space-x-1 items-baseline gap-1 ml-1">
                  <Image 
                    src="/img/work-capi.png" 
                    alt="Capi" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1 transform translate-y-[2.5px]" 
                  />
                  Capi
                </a>, 
                <a href="https://symbols.dev" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 border-b-2 border-transparent group-hover:border-[#ffb7b7] inline-flex space-x-1 items-baseline gap-1 ml-1">
                  <Image 
                    src="/img/work-symbols.png" 
                    alt="Symbols" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1 transform translate-y-[2.5px]" 
                  />
                  Symbols
                </a>, 
                <a href="https://svela.xyz" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 border-b-2 border-transparent group-hover:border-[#ffb7b7] inline-flex space-x-1 items-baseline gap-1 ml-3">
                  <Image 
                    src="/img/work-svela.png" 
                    alt="Svela" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1 transform translate-y-[2.5px]" 
                  />
                  Svela
                </a>
                <br />
                and more{showMoreProjects ? ' like' : '.'}
                <button 
                  onClick={() => setShowMoreProjects(!showMoreProjects)}
                  className="w-0 group-hover:w-4 ml-2 cursor-pointer"
                >
                  <IconPlus className={`hidden group-hover:block w-2.5 h-2.5 fill-zinc-50/50 group-hover:fill-zinc-50 ${showMoreProjects ? 'rotate-45' : ''} transition-all duration-150 ease-in-out`} />
                </button>
                 
                {showMoreProjects && (
                  <>
                    <a href="https://senko.xyz" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 border-b-2 border-transparent group-hover:border-[#ffb7b7] inline-flex space-x-1 items-baseline gap-1 ml-1">
                      <Image 
                        src="/img/work-senko.png" 
                        alt="Senko" 
                        width={18} 
                        height={18} 
                        className="inline-block rounded-sm ring-1 ring-white/20 mr-1 transform translate-y-[2.5px]" 
                      />
                      Senko
                    </a>
                    , and
                    <a href="https://zenmail.xyz" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 border-b-2 border-transparent group-hover:border-[#ffb7b7] inline-flex space-x-1 items-baseline gap-1 ml-1">
                      <Image 
                        src="/img/work-res.png" 
                        alt="RES" 
                        width={18} 
                        height={18} 
                        className="inline-block rounded-sm ring-1 ring-white/20 mr-1 transform translate-y-[2.5px]" 
                      />
                      RES
                    </a>
                    .
                  </>
                )}
                </span>
              </p>

              <p className="group text-md text-zinc-50/50 hover:text-zinc-50/30 cursor-crosshair transition-all duration-150 ease-in-out">
                Previously, <span className="border-b-2 border-transparent border-dotted group-hover:border-zinc-50/20">I was a contributor to 
                <a href="https://mango.markets" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 border-b-2 border-transparent group-hover:border-[#ffb7b7] inline-flex space-x-1 items-baseline gap-1 ml-2">
                  <Image 
                    src="/img/work-mango.png" 
                    alt="Mango" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1 transform translate-y-[2.5px]" 
                  />
                  Mango
                </a> a defi protocol. Prior to that, I was on the marketing team for 
                <a href="https://www.nasdaq.com/articles/coinbase-acquires-crypto-wallet-firm-brd" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 border-b-2 border-transparent group-hover:border-[#ffb7b7] inline-flex items-baseline gap-1 ml-2">
                  <Image 
                    src="/img/work-brd.png" 
                    alt="BRD" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1 transform translate-y-[2.5px]" 
                  />
                  BRD
                </a> <br />a crypto wallet.</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};