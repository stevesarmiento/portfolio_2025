"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  // IconLaurelLeading,
  // IconLaurelTrailing,
  IconSealFill, 
} from "symbols-react";
import { motion } from "framer-motion";

import InitialLoader from "@/components/initial-loader";
// import InteractiveIntro from "@/components/interactive-intro";
import { BlackHoleScene } from "@/components/black-hole-scene";

// import Work from "@/components/work";
import { AnimatedText } from "@/components/ui/animated-text";
import AboutMe from "@/components/about-me";
//import CommunityLinks from "@/components/community-links";


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
    <main 
      className="relative h-dvh w-full overflow-hidden bg-black"
      >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[70dvh] overflow-hidden">
        <BlackHoleScene isAsciiEnabled />
      </div>

      <div className="relative z-10 h-dvh w-full max-w-[620px] mx-auto border-r border-l border-white/10 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[620px] flex-col items-center gap-y-2 px-4 py-24">
          <motion.div 
            initial={{ opacity: 0, y: -5, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}        
            className="group relative flex flex-row items-center justify-start gap-2 w-full p-2"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative hover:cursor-crosshair hover:scale-110 active:scale-95 transition-all duration-150 ease-in-out">
              <IconSealFill className=" h-[54px] w-[54px] fill-zinc-800 group-hover:fill-zinc-800 transition-all duration-150 ease-in-out group-hover:animate-spin-slow" />
              <h1 className="absolute left-[21px] top-[11px] text-2xl font-black font-rafaella text-zinc-600 group-hover:text-zinc-50 transition-all duration-150 ease-in-out">S</h1>
            </div>
            <div className="flex flex-col">
              <span className="text-lg text-white font-nuvo flex flex-row items-center justify-start gap-x-1">
                <AnimatedText text="Steven Sarmi" isAnimating={isHovering} />
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>_</motion.span>
              </span>
              <span className="sm:text-md text-sm text-zinc-50/40 font-mono flex flex-row flex-wrap items-center justify-center gap-x-1 border-b-2 border-transparent">
                Product Engineer @ the
                <Image 
                  src="/img/work-solana.png" 
                  alt="Solana Foundation" 
                  width={22} 
                  height={22} 
                  className="inline-block mx-1 rounded-md ring-1 ring-white/10" 
                />
                <a href="https://solana.foundation" target="_blank" rel="noreferrer" className="hover:text-zinc-50 border-b-2 border-transparent hover:border-[#ffb7b7] inline-flex items-baseline gap-1 translate-y-[2px]">
                  Solana Foundation
                </a>
              </span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 5, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="flex w-full flex-col items-center justify-center gap-y-24 mt-10"
          >
              <AboutMe /> 
          </motion.div>
        </div>
      </div>
    </main>
  );
}