"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { AnimatedText } from "@/components/ui/animated-text";
import { IconArrowLeft, IconScribble } from "symbols-react";
import { PlaygroundContent } from "@/components/playground/playground-content";
import { Button } from "@/components/ui/button";

export default function Playground() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#f4f1ea] text-zinc-950">
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="absolute left-4 top-3 z-20 rounded-xl bg-white/45 text-zinc-700 shadow-sm ring-1 ring-black/10 transition-[background-color,transform,color] duration-150 ease-out hover:bg-white/80 hover:text-zinc-950 active:scale-[0.97]"
      >
        <Link href="/" aria-label="Back home">
          <IconArrowLeft className="h-4 w-4 fill-current" />
        </Link>
      </Button>

      {/* Header - Loads instantly */}
      <motion.div 
        initial={{ opacity: 0, transform: "translateY(-5px)", filter: "blur(5px)" }}
        animate={{ opacity: 1, transform: "translateY(0)", filter: "blur(0px)" }}
        transition={{ duration: 0.3 }}        
        className="group relative z-10 flex w-full flex-row items-center justify-center gap-2 border-b border-dashed border-black/10 p-4"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(24, 24, 27, 0.04) 10px,
            rgba(24, 24, 27, 0.04) 11px
          )`
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex-col text-center">
          <span className="font-nuvo flex flex-row items-center gap-x-1 text-lg text-zinc-950">
            <IconScribble className="mr-2 h-5 w-5 fill-zinc-950/30" />
            <AnimatedText text="Playground" isAnimating={isHovering} />
            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>_</motion.span>
          </span>
        </div>
      </motion.div>

      {/* Grid Layout - Loads instantly, components load progressively */}
      <motion.div 
        initial={{ opacity: 0, transform: "translateY(5px)", filter: "blur(5px)" }}
        animate={{ opacity: 1, transform: "translateY(0)", filter: "blur(0px)" }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid h-[calc(100dvh-60px)] w-full grid-cols-12 divide-x divide-y divide-dashed divide-black/10 overflow-y-auto overscroll-contain"
      >
        <PlaygroundContent />
      </motion.div>
    </main>
  );
}
