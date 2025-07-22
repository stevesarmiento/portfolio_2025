'use client';

import React, { useRef, useState } from 'react';
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

const transition = {
  type: 'spring',
  bounce: 0.1,
  duration: 0.2,
};

// function Button({
//   children,
//   onClick,
//   disabled,
//   ariaLabel,
// }: {
//   children: React.ReactNode;
//   onClick?: () => void;
//   disabled?: boolean;
//   ariaLabel?: string;
// }) {
//   return (
//     <button
//       className='relative flex h-9 w-9 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'
//       type='button'
//       onClick={onClick}
//       disabled={disabled}
//       aria-label={ariaLabel}
//     >
//       {children}
//     </button>
//   );
// }

const socials = [
    {
      name: "X",
      link: "https://x.com/stevensarmi_",
      icon: IconXLogo
    },
    {
      name: "Figma",
      link: "https://www.figma.com/@sarmiento",
      icon: IconFigmaLogo
    },
    {
      name: "Calendar",
      link: "https://cal.com/lassi",
      icon: IconCalendar
    },
    {
      name: "Email",
      link: "mailto:sarmiento.steven@gmail.com",
      icon: IconEnvelopeFill
    }
  ]

export default function AbsoluteMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef as React.RefObject<HTMLElement>, () => {
    setIsOpen(false);
  });
  const router = useRouter();
  const pathname = usePathname();

  return (
    <MotionConfig transition={transition}>
      <div className="fixed bottom-6 flex items-center gap-2 bg-[#1a1c2405] border border-white/5 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden" ref={containerRef}>
        <div className='h-[55px] w-full'>
          <motion.div
            animate={{
              // @todo: here I want to remove the width
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
                    onClick={() => router.push('/')}
                >
                    <span className="sr-only">Home</span>
                    <IconHouseFill className={`h-4 w-4 fill-white/50 group-hover:fill-white ${pathname === '/' ? '' : 'fill-white'}`} />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon"
                    className={`group rounded-xl hover:bg-white/10 ${pathname === '/playground' ? 'bg-white/5' : ''}`}
                    onClick={() => router.push('/playground')}
                >
                    <span className="sr-only">Playground</span>
                    <IconFigureIndoorSoccer className={`h-4 w-4 fill-white/50 group-hover:fill-white ${pathname === '/playground' ? '' : 'fill-white'}`} />
                </Button>
                  <Button
                    variant="ghost"
                    size="icon" 
                    className="group rounded-xl hover:bg-white/10"
                    onClick={() => setIsOpen(true)}
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
                    onClick={() => setIsOpen(false)} 
                    aria-label='Back'
                  >
                    <IconArrowLeft className='h-4 w-4 fill-white/50 group-hover:fill-white' />
                  </Button>
                  <div className='relative w-full space-x-2'>
                    {socials.map((box, index) => ( 
                        <a key={index} href={box.link} target="_blank" rel="noreferrer">
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="group rounded-xl bg-white/5 hover:bg-white/10"
                            >
                            <box.icon className="h-4 w-4 fill-white/50 group-hover:fill-white" />
                            </Button>
                        </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}
