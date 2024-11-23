import Image from 'next/image';
import { CommunityLint } from '@/types/communityLints';
import { motion } from 'framer-motion';
import { IconArrowUpRight } from 'symbols-react';

interface CommunityLinkCardProps {
  lint: CommunityLint;
  onClick?: () => void;
}

export function CommunityLinkCard({ lint, onClick }: CommunityLinkCardProps) {
  return (
      <motion.div
        onClick={onClick}
        whileHover={{ scale: 0.99 }}
        className="group relative overflow-hidden saturate-0 hover:saturate-100 transition-all duration-150 ease-in-out cursor-pointer"
      >
        <div className="relative h-full p-2 pr-4 bg-transparent hover:bg-black/5 rounded-[15px] flex flex-row justify-between items-center gap-x-4">
            <div className="flex flex-row items-center gap-x-2">
                <Image 
                    src={lint.image} 
                    alt={lint.title}
                    width={25} 
                    height={25}
                    className="rounded-[8px] shadow-lg ring-1 ring-[#2E4D61]/10 shadow-[#2E4D61]/10"
                />
                
                <div>
                    <h3 className="text-md font-nuvo font-semibold text-[#2E4D61] mb-1">
                    {lint.title}
                    </h3>
                </div>            
            </div>

            <IconArrowUpRight className="w-3 h-3 fill-[#2E4D61]/50 group-hover:fill-[#2E4D61] opacity-0 group-hover:opacity-100 transition-all duration-150 ease-in-out" />
        </div>
      </motion.div>          
  );
}