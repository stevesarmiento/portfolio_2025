"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { AnimatedText } from "@/components/ui/animated-text";
import { IconScribble } from "symbols-react";
import { PlaygroundContent } from "@/components/playground/PlaygroundContent";

export default function Playground() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <main className="h-screen w-full bg-[#171717] overflow-hidden">
      {/* Header - Loads instantly */}
      <motion.div 
        initial={{ opacity: 0, y: -5, filter: 'blur(5px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.3 }}        
        className="group relative flex flex-row items-center justify-center gap-2 w-full p-4 z-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(46, 77, 97, 0.05) 10px,
            rgba(46, 77, 97, 0.05) 11px
          )`
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex-col text-center">
          <span className="text-lg text-white font-nuvo flex flex-row items-center gap-x-1">
            <IconScribble className="w-5 h-5 fill-white/30 mr-2" />
            <AnimatedText text="Playground" isAnimating={isHovering} />
            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>_</motion.span>
          </span>
        </div>
      </motion.div>

      {/* Grid Layout - Loads instantly, components load progressively */}
      <motion.div 
        initial={{ opacity: 0, y: 5, filter: 'blur(5px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-12 divide-x divide-y divide-[#252525] divide-dashed h-[calc(100vh-60px)] w-full overflow-y-auto"
      >
        <PlaygroundContent />
      </motion.div>
    </main>
  );
}

