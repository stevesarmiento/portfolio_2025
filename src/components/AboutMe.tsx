import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { IconEyes, IconApplescript } from "symbols-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

export default function AboutMe() {
    const [isExpanded, setIsExpanded] = useState(false);

    const variants = {
      hidden: { opacity: 0, filter: "blur(4px)" },
      visible: { opacity: 1, filter: "blur(0px)" }
    };

  return (
    <div className="flex flex-col items-left w-full">
      <div className="flex flex-col items-left font-nuvo gap-y-6 mt-6 px-4 ">
        {/* <h2 className="text-lg font-nuvo text-[#2E4D61]/30">TLDR;</h2> */}


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
              className="flex flex-col items-left gap-y-6"
              variants={variants}
              transition={{ duration: 0.5 }}
            >
              <p className="group text-md text-[#2E4D61]/80 hover:text-[#2E4D61] cursor-crosshair transition-all duration-150 ease-in-out">
                Today, <span className="group-hover:border-b-2 border-dotted group-hover:border-[#2E4D61]/70">I&apos;m having fun building side projects like <a href="https://zenmail.xyz" target="_blank" rel="noreferrer" className="group-hover:text-[#ffb7b7] group-hover:border-b-2 group-hover:border-[#ffb7b7]">Zenmail</a>, an AI powered email client</span> and contributing to open-source initiatives.
            </p>
              <p className="group text-md text-[#2E4D61]/80 hover:text-[#2E4D61] cursor-crosshair transition-all duration-150 ease-in-out">
                I&apos;m <span className="group-hover:border-b-2 border-dotted group-hover:border-[#2E4D61]/70">helping build applications with <a href="https://artificialtechnologycorp.com" target="_blank" rel="noreferrer" className="group-hover:text-[#ffb7b7] group-hover:border-b-2 group-hover:border-[#ffb7b7]">Artificial Technology Corp</a>, a group of internet friends building <a href="https://res.computer" target="_blank" rel="noreferrer" className="group-hover:text-[#ffb7b7] group-hover:border-b-2 group-hover:border-[#ffb7b7]">RES</a>, an open-source iOS app</span> for having interactive voice conversations with the latest AI models.
              </p>

              <p className="group text-md text-[#2E4D61]/80 hover:text-[#2E4D61] cursor-crosshair transition-all duration-150 ease-in-out">
                Most recently, <span className="group-hover:border-b-2 border-dotted group-hover:border-[#2E4D61]/70">I was a core contributor to <a href="https://mango.markets" target="_blank" rel="noreferrer" className="group-hover:text-[#ffb7b7] group-hover:border-b-2 group-hover:border-[#ffb7b7]">Mango</a></span>, a DAO building a permissionless lending markets and spot/futures trading, I also work and contribute to various projects within the Solana ecosystem.
              </p>
              
              <p className="group text-md text-[#2E4D61]/80 hover:text-[#2E4D61] cursor-crosshair transition-all duration-150 ease-in-out">
                Prior to that, <span className="group-hover:border-b-2 border-dotted group-hover:border-[#2E4D61]/70">I worked as a visual designer, web developer and managed user-acquisition for the marketing team for BRD (formerly Breadwallet). <a href="https://www.nasdaq.com/articles/coinbase-acquires-crypto-wallet-firm-brd" target="_blank" rel="noreferrer" className="group-hover:text-[#ffb7b7] group-hover:border-b-2 group-hover:border-[#ffb7b7]">BRD was acquired by Coinbase</a></span> in 2021.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};