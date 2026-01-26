import React from 'react';
import { IconSealFill } from 'symbols-react';

interface SeparatorProps {
    CustomIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }

  const Separator: React.FC<SeparatorProps> = ({ CustomIcon }) => {
    return (
    <div className="relative my-16 w-full flex items-center justify-center">
        <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="group relative bg-slate-950 p-1 hover:cursor-crosshair">
            <IconSealFill className=" h-[30px] w-[30px] fill-slate-900 transition-all duration-150 ease-in-out group-hover:animate-spin-slow" />
            <CustomIcon className="absolute h-[18px] w-[18px] left-[10px] top-[10px] fill-white/30 group-hover:fill-orange-400 transition-all duration-150 ease-in-out" />
        </div>
  </div>
  );
};

export default Separator;