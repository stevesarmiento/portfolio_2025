"use client";

import { motion } from "framer-motion";
import { Suspense } from "react";

// Loading skeleton component
function ComponentSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="h-3/4 w-3/4 animate-pulse rounded-lg bg-zinc-950/5 motion-reduce:animate-none" />
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
      className={`flex flex-col items-center justify-center p-6 ${className}`}
    >
      <div 
        className="mb-3 flex h-full w-full items-center justify-center rounded-[23px] bg-white/35 shadow-sm ring-1 ring-black/10"
        style={backgroundStyle}
      >
        <Suspense fallback={<ComponentSkeleton />}>
          {children}
        </Suspense>
      </div>
      <div className="w-full text-left">
        <h2 className="font-nuvo mb-1 text-base text-zinc-900">{title}</h2>
        <span className="text-xs text-zinc-600">{description}</span>
      </div>
    </motion.div>
  );
}
