'use client';

import React, { useRef, useState, useCallback, useMemo } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import useClickOutside from '@/hooks/useClickOutside';
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { 
    IconEllipsis,
    IconFigureIndoorSoccer, 
    IconHouseFill, 
    IconXLogo, 
    IconFigmaLogo, 
    IconCalendar, 
    IconArrowLeft,
    IconEnvelopeFill
} from "symbols-react";
import GlassSurface from './ui/glass-surface';

const transition = {
  type: "spring",
  stiffness: 800,
  damping: 80,
  mass: 4,
};

const dragTransition = {
  type: "spring",
  stiffness: 800,
  damping: 80,
  mass: 4,
};

const socials = [
    {
      name: "Calendar",
      link: "https://cal.com/lassi",
      icon: IconCalendar
    },
    {
      name: "Email",
      link: "mailto:sarmiento.steven@gmail.com",
      icon: IconEnvelopeFill
    },
    {
      name: "X",
      link: "https://x.com/stevensarmi_",
      icon: IconXLogo
    },
    {
      name: "Figma",
      link: "https://www.figma.com/@sarmiento",
      icon: IconFigmaLogo
    }
] as const;

export default function AbsoluteMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({
    top: -400,
    left: -400,
    right: 400,
    bottom: 400,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const pathname = usePathname();

  // Memoize navigation handlers to prevent re-creation on every render
  const handleHomeClick = useCallback(() => {
    if (!isDragging && pathname !== '/') {
      router.push('/');
    }
  }, [isDragging, pathname, router]);

  const handlePlaygroundClick = useCallback(() => {
    if (!isDragging && pathname !== '/playground') {
      router.push('/playground');
    }
  }, [isDragging, pathname, router]);

  const handleMoreClick = useCallback(() => {
    if (!isDragging) {
      setIsOpen(true);
    }
  }, [isDragging]);

  const handleBackClick = useCallback(() => {
    if (!isDragging) {
      setIsOpen(false);
    }
  }, [isDragging]);

  // Memoize click outside handler
  const handleClickOutside = useCallback(() => {
    if (!isDragging) {
      setIsOpen(false);
    }
  }, [isDragging]);
  
  useClickOutside(containerRef as React.RefObject<HTMLElement>, handleClickOutside);

  // Set up drag constraints based on viewport size
  React.useEffect(() => {
    const updateConstraints = () => {
      if (typeof window !== 'undefined') {
        setDragConstraints({
          top: -window.innerHeight + 200,
          left: -window.innerWidth + 200,
          right: window.innerWidth - 200,
          bottom: window.innerHeight - 200,
        });
      }
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, []);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Memoize social links to prevent re-renders
  const socialLinks = useMemo(() => 
    socials.map((social) => (
      <a key={social.name} href={social.link} target="_blank" rel="noreferrer">
        <Button 
          variant="ghost" 
          size="icon"
          className="group rounded-xl bg-white/5 hover:bg-white/10"
          disabled={isDragging}
        >
          <social.icon className="h-4 w-4 fill-white/50 group-hover:fill-white" />
        </Button>
      </a>
    ))
  , [isDragging]);

  return (
    <MotionConfig transition={transition}>
      <motion.div
        ref={containerRef}
        drag
        dragMomentum={false}
        dragElastic={0.1}
        dragSnapToOrigin={true}
        dragConstraints={dragConstraints}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        transition={dragTransition}
        whileDrag={{
          scale: 1.05,
          rotate: isDragging ? 2 : 0,
        }}
        className="cursor-grab active:cursor-grabbing"
      >
        <motion.div
          animate={{
            width: isOpen ? 260 : 166,
          }}
          transition={transition}
          initial={false}
        >
          <GlassSurface
            displace={1.5}
            distortionScale={-100}
            redOffset={5}
            greenOffset={15}
            blueOffset={25}
            brightness={60}
            opacity={0.8}
            height={66}
            width="100%"
            mixBlendMode="screen"
          >
          <div className='h-[55px] w-full'>
            <motion.div
              animate={{
                width: isOpen ? '245px' : '150px',
              }}
              initial={false}
            >
              <div className='overflow-hidden p-2'>
                {!isOpen ? (
                  <div className='flex space-x-2'>
                    <Button 
                        variant="ghost" 
                        size="icon"
                        className={`group rounded-xl hover:bg-white/10 ${pathname === '/' ? 'bg-white/5' : ''}`}
                        onClick={handleHomeClick}
                        disabled={isDragging}
                    >
                        <span className="sr-only">Home</span>
                        <IconHouseFill className={`h-4 w-4 fill-white/50 group-hover:fill-white ${pathname === '/' ? '' : 'fill-white'}`} />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon"
                        className={`group rounded-xl hover:bg-white/10 ${pathname === '/playground' ? 'bg-white/5' : ''}`}
                        onClick={handlePlaygroundClick}
                        disabled={isDragging}
                    >
                        <span className="sr-only">Playground</span>
                        <IconFigureIndoorSoccer className={`h-4 w-4 fill-white/50 group-hover:fill-white ${pathname === '/playground' ? '' : 'fill-white'}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon" 
                      className="group rounded-xl hover:bg-white/10"
                      onClick={handleMoreClick}
                      disabled={isDragging}
                      aria-label='more'
                    >
                      <IconEllipsis className="h-4 w-4 fill-white/50 group-hover:fill-white" />
                    </Button>
                  </div>
                ) : (
                  <div className='flex space-x-2'>
                    <Button 
                      variant="ghost"
                      size="icon"
                      className="group rounded-xl hover:bg-white/10"
                      onClick={handleBackClick} 
                      disabled={isDragging}
                      aria-label='Back'
                    >
                      <IconArrowLeft className='h-4 w-4 fill-white/50 group-hover:fill-white' />
                    </Button>
                    <div className='relative w-full space-x-2'>
                      {socialLinks}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </GlassSurface>
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
}
