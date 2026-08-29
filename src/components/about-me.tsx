import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IconPlus } from "symbols-react";

import { AboutActions } from "@/components/about-actions";
import { SolanaLogo } from "@/components/solana-logo";

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

        <p className="group cursor-crosshair text-lg text-zinc-950">
          <span className="border-b-2 border-dotted border-transparent group-hover:border-zinc-950/20">Pushing towards building thoughtful experiences <br /> and solving interesting problems with code.</span>
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
              <p className="group cursor-crosshair text-sm text-zinc-900 hover:text-zinc-900/35">
                Today, <span className="border-b-2 border-dotted border-transparent group-hover:border-zinc-950/20">I&apos;m building products and tools for the{" "}
                <a href="https://solana.com" target="_blank" rel="noreferrer" className="ml-2 inline-flex items-baseline gap-1 space-x-1 border-b-2 border-transparent group-hover:border-[#df8f93] group-hover:text-zinc-950">
                  <SolanaLogo className="mr-1 size-[18px] shrink-0 translate-y-[2.5px]" />
                  Solana ecosystem.
                </a></span>
              </p>

              <p className="group cursor-crosshair text-sm text-zinc-900 hover:text-zinc-900/35">
                <span className="border-b-2 border-dotted border-transparent group-hover:border-zinc-950/20">I&apos;ve worked with startups like{" "} <a href="https://metadao.fi" target="_blank" rel="noreferrer" className="ml-2 inline-flex items-baseline gap-1 space-x-1 border-b-2 border-transparent group-hover:border-[#df8f93] group-hover:text-zinc-950">
                  <Image 
                    src="/img/work-metadao.png" 
                    alt="MetaDAO" 
                    width={18} 
                    height={18} 
                    className="mr-1 inline-block translate-y-[2.5px] rounded-sm ring-1 ring-black/10"
                  />
                  MetaDAO
                </a>, 
                <br />
                <a href="https://triton.one" target="_blank" rel="noreferrer" className="inline-flex items-baseline gap-1 space-x-1 border-b-2 border-transparent group-hover:border-[#df8f93] group-hover:text-zinc-950">
                  <Image 
                    src="/img/work-triton.png" 
                    alt="Triton" 
                    width={18} 
                    height={18} 
                    className="mr-1 inline-block translate-y-[2.5px] rounded-sm ring-1 ring-black/10"
                  />
                  Triton
                </a>, and 
                <a href="https://vapi.ai" target="_blank" rel="noreferrer" className="ml-2 inline-flex items-baseline gap-1 space-x-1 border-b-2 border-transparent group-hover:border-[#df8f93] group-hover:text-zinc-950">
                  <Image 
                    src="/img/work-vapi.png" 
                    alt="Vapi" 
                    width={18} 
                    height={18} 
                    className="mr-1 inline-block translate-y-[2.5px] rounded-sm ring-1 ring-black/10"
                  />
                  Vapi
                </a> on product, design and engineering.</span>
              </p>

              <p className="group cursor-crosshair text-sm text-zinc-900 hover:text-zinc-900/35">
                I like to build things - <span className="border-b-2 border-dotted border-transparent group-hover:border-zinc-950/20">
                 <a href="https://apps.apple.com/us/app/senko-simple-pro-camera/id6584516223" target="_blank" rel="noreferrer" className="ml-1 inline-flex items-baseline gap-1 space-x-1 border-b-2 border-transparent group-hover:border-[#df8f93] group-hover:text-zinc-950">
                    <Image 
                      src="/img/work-senko.png" 
                      alt="Senko" 
                      width={18} 
                      height={18} 
                      className="mr-1 inline-block translate-y-[2.5px] rounded-sm ring-1 ring-black/10"
                    />
                    Senko
                  </a>, 
                <a href="https://symbols.dev" target="_blank" rel="noreferrer" className="ml-1 inline-flex items-baseline gap-1 space-x-1 border-b-2 border-transparent group-hover:border-[#df8f93] group-hover:text-zinc-950">
                  <Image 
                    src="/img/work-symbols.png" 
                    alt="Symbols" 
                    width={18} 
                    height={18} 
                    className="mr-1 inline-block translate-y-[2.5px] rounded-sm ring-1 ring-black/10"
                  />
                  Symbols
                </a>, 
                <a href="https://aggr.watch" target="_blank" rel="noreferrer" className="ml-1 mr-1 inline-flex items-baseline gap-1 space-x-1 border-b-2 border-transparent group-hover:border-[#df8f93] group-hover:text-zinc-950">
                  <Image
                    src="/img/work-svela.png"
                    alt="AggrWatch"
                    width={18}
                    height={18}
                    className="mr-1 inline-block translate-y-[2.5px] rounded-sm ring-1 ring-black/10"
                  />
                  Aggr Watch
                </a>
                 and more{showMoreProjects ? ' like' : '.'}
                <button 
                  onClick={() => setShowMoreProjects(!showMoreProjects)}
                  className="w-0 group-hover:w-4 ml-2 cursor-pointer"
                >
                  <IconPlus className={`hidden h-2.5 w-2.5 fill-zinc-950/40 transition-transform duration-150 ease-out group-hover:block group-hover:fill-zinc-950 ${showMoreProjects ? 'rotate-45' : ''}`} />
                </button>
                 
                {showMoreProjects && (
                  <>
                    <a href="https://github.com/rescomputer/res-ios" target="_blank" rel="noreferrer" className="ml-1 inline-flex items-baseline gap-1 space-x-1 border-b-2 border-transparent group-hover:border-[#df8f93] group-hover:text-zinc-950">
                      <Image 
                        src="/img/work-res.png" 
                        alt="RES" 
                        width={18} 
                        height={18} 
                        className="mr-1 inline-block translate-y-[2.5px] rounded-sm ring-1 ring-black/10"
                      />
                      RES
                    </a>
                    .
                  </>
                )}
                </span>
              </p>

              <p className="group cursor-crosshair text-sm text-zinc-900 hover:text-zinc-900/35">
                Previously, <span className="border-b-2 border-dotted border-transparent group-hover:border-zinc-950/20">I was a core contributor to{" "}
                <a href="https://x.com/mangomarkets" target="_blank" rel="noreferrer" className="ml-2 inline-flex items-baseline gap-1 space-x-1 border-b-2 border-transparent group-hover:border-[#df8f93] group-hover:text-zinc-950">
                  <Image 
                    src="/img/work-mango.png" 
                    alt="Mango" 
                    width={18} 
                    height={18} 
                    className="mr-1 inline-block translate-y-[2.5px] rounded-sm ring-1 ring-black/10"
                  />
                  Mango
                </a>,
                <button 
                  onClick={() => setShowMoreHistory(!showMoreHistory)}
                  className="w-0 group-hover:w-4 ml-2 cursor-pointer"
                >
                  <IconPlus className={`hidden h-2.5 w-2.5 fill-zinc-950/40 transition-transform duration-150 ease-out group-hover:block group-hover:fill-zinc-950 ${showMoreHistory ? 'rotate-45' : ''}`} />
                </button>              
                {showMoreHistory ? 'a open-source defi platform on Solana ' : 'a open-source defi platform on Solana. '}                 
                {showMoreHistory && (
                  <>
                    where I worked on community growth, product strategy, and frontend development.
                  </>
                )}
                </span>
                </p>
                <p className="group cursor-crosshair text-sm text-zinc-900 hover:text-zinc-900/35">
                 Prior to that, I was on the marketing team for
                 <span className="border-b-2 border-dotted border-transparent group-hover:border-zinc-950/20">
                <a href="https://www.nasdaq.com/articles/coinbase-acquires-crypto-wallet-firm-brd" target="_blank" rel="noreferrer" className="ml-2 inline-flex items-baseline gap-1 border-b-2 border-transparent group-hover:border-[#df8f93] group-hover:text-zinc-950">
                  <Image 
                    src="/img/work-brd.png" 
                    alt="BRD" 
                    width={18} 
                    height={18} 
                    className="mr-1 inline-block translate-y-[2.5px] rounded-sm ring-1 ring-black/10"
                  />
                  BRD
                </a>,
                <button 
                  onClick={() => setShowMoreBrd(!showMoreBrd)}
                  className="w-0 group-hover:w-4 ml-2 cursor-pointer"
                >
                  <IconPlus className={`hidden h-2.5 w-2.5 fill-zinc-950/40 transition-transform duration-150 ease-out group-hover:block group-hover:fill-zinc-950 ${showMoreBrd ? 'rotate-45' : ''}`} />
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
