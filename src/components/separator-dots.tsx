import React from 'react';
import { IconScribbleVariable } from 'symbols-react';

  const SeparatorDots = () => {
    return (
    <div className="relative my-12 w-full flex items-center justify-center">
        {/* <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div> */}
            <div className="group relative bg-[#E1E7F3] p-1 hover:cursor-crosshair">
            <IconScribbleVariable className=" h-[30px] w-[30px] fill-[#2E4D61]/30" />
        </div>
  </div>
  );
};

export default SeparatorDots;

