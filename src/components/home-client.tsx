"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconSealFill } from "symbols-react";

import AboutMe, { type HomepageWriting } from "@/components/about-me";
import { BlackHoleScene } from "@/components/black-hole-scene";
import InitialLoader from "@/components/initial-loader";
import { SolanaLogo } from "@/components/solana-logo";
import { AnimatedText } from "@/components/ui/animated-text";

export function HomeClient({ writings }: { writings: HomepageWriting[] }) {
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
        <div className="mx-auto flex w-full max-w-[620px] flex-col items-center gap-y-2 px-4 pb-6 pt-6">
          <motion.div
            initial={{ opacity: 0, y: -5, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="group relative flex w-full flex-row items-center justify-start gap-2 p-2"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative cursor-crosshair transition-transform duration-150 ease-out hover:scale-110 active:scale-[0.97] motion-reduce:transform-none">
              <IconSealFill className="size-[50px] fill-rose-400 transition-[fill] duration-150 ease-out group-hover:animate-spin-slow group-hover:fill-rose-400 motion-reduce:animate-none" />
              <h1 className="absolute left-[21px] top-[11px] font-rafaella text-xl font-black text-white transition-colors duration-150 ease-out group-hover:text-white">
                S
              </h1>
            </div>
            <div className="flex flex-col">
              <span className="flex flex-row items-center justify-start gap-x-1 font-nuvo text-lg text-zinc-950">
                <AnimatedText text="Steven Sarmi" isAnimating={isHovering} />
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  _
                </motion.span>
              </span>
              <span className="sm:text-md flex flex-row flex-wrap items-center justify-center gap-x-1 border-b-2 border-transparent font-mono text-sm text-zinc-600">
                Product Engineer at
                <a
                  href="https://solana.foundation"
                  target="_blank"
                  rel="noreferrer"
                  className="expanding-link ml-1 inline-flex items-center gap-1 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#df8f93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f1ea]"
                >
                  <SolanaLogo className="size-[18px] shrink-0" />
                  <span>Solana Foundation</span>
                </a>
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 5, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="mt-2 flex w-full flex-col items-center justify-center gap-y-6"
          >
            <AboutMe writings={writings} />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
