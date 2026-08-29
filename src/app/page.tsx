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
    <main className="relative h-dvh w-full overflow-hidden bg-[#f4f1ea] text-zinc-950">
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-[70dvh] w-full max-w-[620px] -translate-x-1/2 overflow-hidden opacity-80 [mask-image:linear-gradient(to_bottom,transparent_0%,black_22%,black_100%)]">
        <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2">
          <BlackHoleScene isAsciiEnabled tone="light" />
        </div>
      </div>

      <div className="long-dashed-rails relative z-10 mx-auto h-dvh w-full max-w-[620px] overflow-y-auto overscroll-contain">
        <div className="mx-auto flex w-full max-w-[620px] flex-col items-center gap-y-2 px-4 pt-6 pb-6">
          <motion.div 
            initial={{ opacity: 0, y: -5, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}        
            className="group relative flex flex-row items-center justify-start gap-2 w-full p-2"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative cursor-crosshair transition-transform duration-150 ease-out hover:scale-110 active:scale-[0.97] motion-reduce:transform-none">
              <IconSealFill className="size-[50px] fill-zinc-950/15 transition-[fill] duration-150 ease-out group-hover:fill-zinc-950/25 group-hover:animate-spin-slow motion-reduce:animate-none" />
              <h1 className="absolute left-[21px] top-[11px] font-rafaella text-xl font-black text-zinc-700 transition-colors duration-150 ease-out group-hover:text-zinc-950">S</h1>
            </div>
            <div className="flex flex-col">
              <span className="font-nuvo flex flex-row items-center justify-start gap-x-1 text-lg text-zinc-950">
                <AnimatedText text="Steven Sarmi" isAnimating={isHovering} />
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>_</motion.span>
              </span>
              <span className="sm:text-md flex flex-row flex-wrap items-center justify-center gap-x-1 border-b-2 border-transparent font-mono text-sm text-zinc-600">
                Product Engineering @ the
                <Image 
                  src="/img/work-solana.png" 
                  alt="Solana Foundation" 
                  width={22} 
                  height={22} 
                  className="mx-1 inline-block rounded-md ring-1 ring-black/10"
                />
                <a href="https://solana.foundation" target="_blank" rel="noreferrer" className="inline-flex translate-y-[2px] items-baseline gap-1 border-b-2 border-transparent transition-colors duration-150 ease-out hover:border-[#df8f93] hover:text-zinc-950">
                  Solana Foundation
                </a>
              </span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 5, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="flex w-full flex-col items-center justify-center gap-y-6 mt-2"
          >
              <AboutMe /> 
          </motion.div>
        </div>
      </div>

    </main>
  );
}
