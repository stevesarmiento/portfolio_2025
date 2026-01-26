"use client";

import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { communityLinks } from '@/data/community-links';
import { CommunityLinkCard } from './ui/community-link-card';

export default function CommunityLinks() {

  return (
    <div className="w-[300px] mx-auto sm:w-full px-4 mt-10">
      <h2 className="text-lg font-nuvo text-[#2E4D61]/30 mb-4">Community Resources;</h2>

      <TooltipProvider>
          <div className="flex flex-col space-y-1">
            {communityLinks.map((link) => (
              <CommunityLinkCard 
                key={link.id} 
                link={link}
                onClick={() => {
                  window.open(link.link, '_blank');
                }}
              />
            ))}
          </div>
      </TooltipProvider>      
    </div>
  );
}