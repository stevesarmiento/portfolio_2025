"use client";

import React, { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { communityLints } from '@/data/communityLinkts';
import { CommunityLinkCard } from './ui/community-link-card';

export default function CommunityLinks() {
  const [selectedLintIndex, setSelectedLintIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const handleNavigate = (newDirection: 'prev' | 'next') => {
    if (selectedLintIndex === null) return;
    
    setDirection(newDirection === 'next' ? 'right' : 'left');
    const newIndex = newDirection === 'next' 
      ? (selectedLintIndex + 1) % communityLints.length
      : (selectedLintIndex - 1 + communityLints.length) % communityLints.length;
    
    setSelectedLintIndex(newIndex);
  };

  const selectedLint = selectedLintIndex !== null ? communityLints[selectedLintIndex] : null;

  const slideVariants = {
    enter: (direction: string) => ({
      x: direction === 'right' ? 1000 : -1000,
      filter: 'blur(30px)',
      opacity: 0
    }),
    center: {
      x: 0,
      filter: 'blur(0px)',
      opacity: 1
    },
    exit: (direction: string) => ({
      x: direction === 'right' ? -1000 : 1000,
      filter: 'blur(30px)',
      opacity: 0
    })
  };

  return (
    <div className="w-[300px] mx-auto sm:w-full px-4 mt-10">
      <h2 className="text-lg font-nuvo text-[#2E4D61]/30 mb-4">Community Resources;</h2>

      <TooltipProvider>
          <div className="flex flex-col space-y-1">
            {communityLints.map((lint, index) => (
              <CommunityLinkCard 
                key={lint.id} 
                lint={lint}
                onClick={() => {
                  window.open(lint.link, '_blank');
                }}
              />
            ))}
          </div>
      </TooltipProvider>      
    </div>
  );
}