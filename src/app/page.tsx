"use client";

import { useState, useEffect, type ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  // IconLaurelLeading,
  // IconLaurelTrailing,
  IconCalendar,
  IconFigureIndoorSoccer,
  IconSealFill, 
  IconGithubLogo,
  IconScribble,
  IconXLogo,
} from "symbols-react";
import { motion } from "framer-motion";

import InitialLoader from "@/components/initial-loader";
// import InteractiveIntro from "@/components/interactive-intro";
import { BlackHoleScene } from "@/components/black-hole-scene";

// import Work from "@/components/work";
import { AnimatedText } from "@/components/ui/animated-text";
import AboutMe from "@/components/about-me";
import { Button } from "@/components/ui/button";
//import CommunityLinks from "@/components/community-links";

interface FooterLinkItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  isExternal?: boolean;
}

const footerLinks: FooterLinkItem[] = [
  { label: "Playground", href: "/playground", icon: IconFigureIndoorSoccer },
  { label: "Musings", href: "/writings", icon: IconScribble },
  { label: "GitHub", href: "https://github.com/stevesarmiento", icon: IconGithubLogo, isExternal: true },
  { label: "Calendar", href: "https://cal.com/lassi", icon: IconCalendar, isExternal: true },
  { label: "@stevensarmi", href: "https://x.com/stevensarmi", icon: IconXLogo, isExternal: true },
];


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
        <div className="mx-auto flex w-full max-w-[620px] flex-col items-center gap-y-2 px-4 pt-24 pb-36">
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
                Product Engineering @ the
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

      <footer className="fixed bottom-0 left-1/2 z-20 w-full max-w-[620px] -translate-x-1/2 border-t border-white/10 bg-transparent">
        <div className="pb-[env(safe-area-inset-bottom)]">
          <nav aria-label="Site links" className="w-full">
            <ul className="grid grid-cols-5 divide-x divide-white/10">
              {footerLinks.map((item) => {
                const Icon = item.icon;

                const content = (
                  <>
                    <Icon className="mix-blend-difference size-3 fill-white/50 group-hover:fill-white" />
                    <span className="mix-blend-difference min-w-0 truncate font-mono text-[11px] text-white/80 group-hover:text-white">
                      {item.label}
                    </span>
                  </>
                );

                if (item.isExternal) {
                  return (
                    <li key={item.label} className="flex">
                      <Button
                        asChild
                        variant="ghost"
                        className="group h-12 w-full flex-row gap-2 rounded-none text-zinc-50/70 hover:bg-white/5 hover:text-zinc-50"
                      >
                        <a href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                          {content}
                        </a>
                      </Button>
                    </li>
                  );
                }

                return (
                  <li key={item.label} className="flex">
                    <Button
                      asChild
                      variant="ghost"
                      className="group h-12 w-full flex-row gap-2 rounded-none text-zinc-50/70 hover:bg-white/5 hover:text-zinc-50"
                    >
                      <Link href={item.href} aria-label={item.label}>
                        {content}
                      </Link>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </footer>
    </main>
  );
}