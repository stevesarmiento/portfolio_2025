"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  // IconLaurelLeading,
  // IconLaurelTrailing,
  IconSealFill, 
  IconGithubLogo,
} from "symbols-react";
import { motion } from "framer-motion";

import InitialLoader from "@/components/InitialLoader";
// import InteractiveIntro from "@/components/InteractiveIntro";
import AsciiBgV2 from "@/components/ui/ascii-bg-v2";

// import Work from "@/components/Work";
import GithubSection from "@/components/GithubSection";
import { AnimatedText } from "@/components/ui/animated-text";
import AboutMe from "@/components/AboutMe";
//import CommunityLinks from "@/components/CommunityLinks";


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
      className="h-screen w-full overflow-hidden grid grid-cols-4 bg-[#171717]"
      style={{
        backgroundImage: `repeating-linear-gradient(
          90deg,
          transparent,
          transparent 13px,
          rgba(255, 255, 255, 0.05) 15px,
          rgba(255, 255, 255, 0.05) 15px
        )`
      }}
      >
      {/* Content Column */}
      <div 
        className="w-full col-span-2 py-24 flex flex-col items-center text-[#2E4D61] overflow-y-auto">
        <div className="flex w-[620px] flex-col gap-y-2 items-left justify-between">
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
            <div className="flex-col text-right">
                <span className="text-lg text-white font-nuvo flex flex-row items-center gap-x-1">
                  <AnimatedText text="Steven Sarmi" isAnimating={isHovering} />
                  <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>_</motion.span>
                </span>
                <span className="text-md text-zinc-50/40 font-mono flex flex-row items-center gap-x-1 border-b-2 border-transparent">
                  Product Engineering @ the
                  <Image 
                    src="/img/work-solana.png" 
                    alt="Solana Foundation" 
                    width={22} 
                    height={22} 
                    className="inline-block mx-1 rounded-md ring-1 ring-white/10" 
                  />
                  <a href="https://solana.foundation" target="_blank" rel="noreferrer" className="hover:text-zinc-50 border-b-2 border-transparent hover:border-[#ffb7b7] inline-flex items-baseline space-x-1 gap-1 translate-y-[2px]">
                    Solana Foundation
                  </a>
                </span>
              </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 5, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="flex flex-col items-center justify-center gap-y-24 mt-[40px]"
          >
              <AboutMe /> 
              <div className="w-full relative mt-6 hidden">
                <div className="relative flex flex-row items-center font-nuvo gap-x-3 mb-2 px-4 py-2">
                        <a 
                          href="https://github.com/stevesarmiento" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group inline-flex items-center text-lg font-bold text-zinc-50/50 cursor-pointer hover:text-zinc-50 transition-colors duration-150"
                        >
                          <AnimatedText text="Github" isAnimating={isHovering} />
                          <IconGithubLogo className="ml-2 w-[20px] h-[20px] transition-all duration-150 ease-in-out fill-zinc-50/50 group-hover:fill-zinc-50 translate-y-[1px] group-hover:translate-y-[-1px]" />
                        </a>
                </div>
                <div className="w-full relative">
                  <div className="w-full sm:flex hidden items-center p-4">
                    <GithubSection />
                  </div>
                </div>
                {/* <div className="relative w-full pt-4 pb-6 px-6">
                  <Work />
                </div> */}
              </div>
          </motion.div>

            {/* <div className="flex flex-col items-left justify-center gap-y-2 w-full my-12">
              <div className="relative flex items-center justify-center w-full">
                <div className="absolute h-[1px] w-full"></div>
                <div className="group absolute bg-[#E1E7F3] flex flex-row items-center justify-center border-[#2E4D61]/30 ring-[8px] ring-[#E1E7F3]">
                  <IconLaurelLeading className="h-[50px] w-[20px] fill-slate-400 group-hover:fill-[#2E4D61] transition-all duration-150 ease-in-out" />
                  <div className="bg-[#E1E7F3] p-1 relative hover:cursor-crosshair hover:scale-110 active:scale-95 transition-all duration-150 ease-in-out">
                    <IconSealFill className=" h-[50px] w-[50px] fill-[#2E4D61]/70 group-hover:fill-[#2E4D61] transition-all duration-150 ease-in-out group-hover:animate-spin-slow" />
                    <span className="absolute left-[11px] top-[15px] text-lg font-rafaella text-white transition-all duration-150 ease-in-out">1989</span>
                  </div> 
                  <IconLaurelTrailing className="h-[50px] w-[20px] fill-slate-400 group-hover:fill-[#2E4D61] transition-all duration-150 ease-in-out" />
                </div>
                <Icon className="absolute h-6 w-6 -bottom-[13px] -left-[13px]  text-[#2E4D61] p-1 bg-[#E1E7F3]" />
                <Icon className="absolute h-6 w-6 -bottom-[13px] -right-[11px] text-[#2E4D61] p-1 bg-[#E1E7F3]" />
              </div>
            </div> */}
        </div>
      </div>

      {/* ASCII Video Background Column */}
      <motion.div 
        initial={{ opacity: 0, filter: 'blur(5px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.3, delay: 1.3 }}
        className="col-span-2 relative overflow-hidden"
        >
        <div 
          className="h-full w-full overflow-hidden"
          >
          <div className="h-full w-full translate-x-[5%] scale-110">
            <AsciiBgV2 />
          </div>          
        </div>

      </motion.div>
    </main>
  );
}