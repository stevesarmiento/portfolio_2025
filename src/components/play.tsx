import React from 'react';
import Image from 'next/image';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
// import { IconCircleFill } from 'symbols-react';

const boxes = [
  { id: 1, content: 'Component Kit', image: '/img/work-componentkit.png', link: 'https://example.com/componentkit' },
  { id: 2, content: 'Symbols', image: '/img/work-symbols.png', link: 'https://example.com/symbols' },
  { id: 3, content: 'Toshi', image: '/img/work-toshi.png', link: 'https://example.com/toshi' },
  { id: 4, content: 'Aufn', image: '/img/work-aufn.png', link: 'https://example.com/aufn' },
  { id: 5, content: 'Nightlight', image: '/img/work-nightlight.png', link: 'https://example.com/nightlight' },
];

export default function Play() {
  return (
    <div className="">
      {/* <div className="flex flex-row items-center font-nuvo gap-x-3">
        <IconCircleFill className="w-[6px] h-[6px] fill-[#ffb7b7]" />
        <h1 className="text-xl font-bold text-slate-700 cursor-crosshair">Play</h1>
      </div> */}
      <TooltipProvider>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-6 py-4 w-full">
          {boxes.map(box => (
            <Tooltip key={box.id} delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="group col-span-1 rounded-3xl flex items-center justify-center overflow-hidden ring-[1px] hover:ring-[4px] transition-all duration-150 ease-in-out ring-slate-700/10 hover:cursor-crosshair shadow-sm shadow-slate-400 hover:scale-105 saturate-[90%] hover:saturate-[120%]">
                  <Image src={box.image} alt={box.content} className="flex items-center justify-center" width={300} height={300} />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className=" text-white/80 font-bold text-md font-nuvo bg-slate-700 border-t border-slate-500 border-b-0 border-r-0 border-l-0 rounded-xl ring-1 ring-black shadow-lg shadow-black/70">
                {/* <a href={box.link} target="_blank" rel="noopener noreferrer" className="group flex flex-row items-center justify-center gap-x-2 text-white/80 no-underline transition-all duration-150 ease-in-out hover:text-white"> */}
                  {box.content}
                {/* <IconLink className="w-4 h-4 fill-white/40 group-hover:fill-blue-300 transition-all duration-150 ease-in-out group-hover:animate-wiggle" />  
                </a>          */}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>     
    </div>

  );
};

