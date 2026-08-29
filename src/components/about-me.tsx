import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IconPlus } from "symbols-react";

import { AboutActions } from "@/components/about-actions";

export default function AboutMe() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showMoreProjects, setShowMoreProjects] = useState(false);
    const [showMoreHistory, setShowMoreHistory] = useState(false);
    const [showMoreBrd, setShowMoreBrd] = useState(false);


    const variants = {
      hidden: { opacity: 0, filter: "blur(4px)" },
      visible: { opacity: 1, filter: "blur(0px)" }
    };

  return (
    <div className="flex flex-col items-left w-full">
      <div className="flex flex-col items-left font-nuvo gap-y-6 mt-6 px-4 ">
        {/* <h2 className="text-lg font-nuvo text-zinc-50/30/30">TLDR;</h2> */}

        <p className="group text-lg text-zinc-50 hover:text-zinc-50 cursor-crosshair transition-all duration-150 ease-in-out">
          <span className="border-b-2 border-transparent border-dotted group-hover:border-zinc-50/20">Pushing towards building thoughtful experiences <br /> and solving interesting problems with code.</span>
        </p>

        <AboutActions
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded((expanded) => !expanded)}
        />
        <AnimatePresence>

          {isExpanded && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col items-left gap-y-6 w-full sm:w-[520px]"
              variants={variants}
              transition={{ duration: 0.5 }}
            >
              <p className="group text-md text-white hover:text-zinc-50/30 cursor-crosshair transition-all duration-150 ease-in-out">
                Today, <span className="border-b-2 border-transparent border-dotted group-hover:border-zinc-50/20">I&apos;m building products and tools for the  
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

              <p className="group text-md text-white hover:text-zinc-50/30 cursor-crosshair transition-all duration-150 ease-in-out">
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
                </a> on product, design and engineering.</span>
              </p>

              <p className="group text-md text-white hover:text-zinc-50/30 cursor-crosshair transition-all duration-150 ease-in-out">
                I like to build things - <span className="border-b-2 border-transparent border-dotted group-hover:border-zinc-50/20">
                 <a href="https://apps.apple.com/us/app/senko-simple-pro-camera/id6584516223" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 border-b-2 border-transparent group-hover:border-[#ffb7b7] inline-flex space-x-1 items-baseline gap-1 ml-1">
                    <Image 
                      src="/img/work-senko.png" 
                      alt="Senko" 
                      width={18} 
                      height={18} 
                      className="inline-block rounded-sm ring-1 ring-white/20 mr-1 transform translate-y-[2.5px]" 
                    />
                    Senko
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
                <a href="https://aggr.watch" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 border-b-2 border-transparent group-hover:border-[#ffb7b7] inline-flex space-x-1 items-baseline gap-1 ml-1 mr-1">
                  <Image
                    src="/img/work-svela.png"
                    alt="AggrWatch"
                    width={18}
                    height={18}
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1 transform translate-y-[2.5px]"
                  />
                  Aggr Watch
                </a>
                 and more{showMoreProjects ? ' like' : '.'}
                <button 
                  onClick={() => setShowMoreProjects(!showMoreProjects)}
                  className="w-0 group-hover:w-4 ml-2 cursor-pointer"
                >
                  <IconPlus className={`hidden group-hover:block w-2.5 h-2.5 fill-zinc-50/50 group-hover:fill-zinc-50 ${showMoreProjects ? 'rotate-45' : ''} transition-all duration-150 ease-in-out`} />
                </button>
                 
                {showMoreProjects && (
                  <>
                    <a href="https://github.com/rescomputer/res-ios" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 border-b-2 border-transparent group-hover:border-[#ffb7b7] inline-flex space-x-1 items-baseline gap-1 ml-1">
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

              <p className="group text-md text-white hover:text-zinc-50/30 cursor-crosshair transition-all duration-150 ease-in-out">
                Previously, <span className="border-b-2 border-transparent border-dotted group-hover:border-zinc-50/20">I was a core contributor to 
                <a href="https://x.com/mangomarkets" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 border-b-2 border-transparent group-hover:border-[#ffb7b7] inline-flex space-x-1 items-baseline gap-1 ml-2">
                  <Image 
                    src="/img/work-mango.png" 
                    alt="Mango" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1 transform translate-y-[2.5px]" 
                  />
                  Mango
                </a>,
                <button 
                  onClick={() => setShowMoreHistory(!showMoreHistory)}
                  className="w-0 group-hover:w-4 ml-2 cursor-pointer"
                >
                  <IconPlus className={`hidden group-hover:block w-2.5 h-2.5 fill-zinc-50/50 group-hover:fill-zinc-50 ${showMoreHistory ? 'rotate-45' : ''} transition-all duration-150 ease-in-out`} />
                </button>              
                {showMoreHistory ? 'a open-source defi platform on Solana ' : 'a open-source defi platform on Solana. '}                 
                {showMoreHistory && (
                  <>
                    where I worked on community growth, product strategy, and frontend development.
                  </>
                )}
                </span>
                </p>
                <p className="group text-md text-white hover:text-zinc-50/30 cursor-crosshair transition-all duration-150 ease-in-out">
                 Prior to that, I was on the marketing team for
                 <span className="border-b-2 border-transparent border-dotted group-hover:border-zinc-50/20">
                <a href="https://www.nasdaq.com/articles/coinbase-acquires-crypto-wallet-firm-brd" target="_blank" rel="noreferrer" className="group-hover:text-zinc-50 border-b-2 border-transparent group-hover:border-[#ffb7b7] inline-flex items-baseline gap-1 ml-2">
                  <Image 
                    src="/img/work-brd.png" 
                    alt="BRD" 
                    width={18} 
                    height={18} 
                    className="inline-block rounded-sm ring-1 ring-white/20 mr-1 transform translate-y-[2.5px]" 
                  />
                  BRD
                </a>,
                <button 
                  onClick={() => setShowMoreBrd(!showMoreBrd)}
                  className="w-0 group-hover:w-4 ml-2 cursor-pointer"
                >
                  <IconPlus className={`hidden group-hover:block w-2.5 h-2.5 fill-zinc-50/50 group-hover:fill-zinc-50 ${showMoreBrd ? 'rotate-45' : ''} transition-all duration-150 ease-in-out`} />
                </button>
                {showMoreBrd ? 'a crypto wallet ' : 'a crypto wallet.'}</span>
                {showMoreBrd && (
                  <>
                    where I worked as a visual designer and marketing manager, leading user acquisition and growth.
                  </>
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
