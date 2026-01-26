"use client";

import { motion } from "framer-motion";
import { Suspense } from "react";

// Loading skeleton component
function ComponentSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-pulse bg-[#2E4D61]/10 rounded-lg w-3/4 h-3/4" />
    </div>
  );
}

interface PlaygroundGridItemProps {
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  delay?: number;
  backgroundStyle?: React.CSSProperties;
}

export function PlaygroundGridItem({ 
  children, 
  title, 
  description, 
  className = "",
  delay = 0,
  backgroundStyle
}: PlaygroundGridItemProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`p-6 flex flex-col items-center justify-center ${className}`}
    >
      <div 
        className="flex h-full w-full items-center justify-center rounded-[23px] ring-slate-700/10 ring-[1px] mb-3"
        style={backgroundStyle}
      >
        <Suspense fallback={<ComponentSkeleton />}>
          {children}
        </Suspense>
      </div>
      <div className="text-left w-full">
        <h2 className="text-base font-nuvo text-[#ffffff]/40 mb-1">{title}</h2>
        <span className="text-xs text-[#ffffff]/80">{description}</span>
      </div>
    </motion.div>
  );
} 