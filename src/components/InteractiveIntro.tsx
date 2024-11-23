import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function InteractiveIntro() {
  const [isHovered, setIsHovered] = useState(false);

  const gradientTextStyle = {
    background: "linear-gradient(to right, #2E4D61, #FF757D)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    backgroundSize: "200% auto",
    animation: "gradient 3s linear infinite"
  };

  const resetGradientStyle = {
    background: "none",
    WebkitBackgroundClip: "border-box",
    WebkitTextFillColor: "initial",
    backgroundClip: "border-box",
    animation: "none",
    color: "currentColor" 
  };

  return (
    <div className="flex flex-col items-left">
      <div className="flex flex-col items-left gap-y-6 mt-6 px-4 ">
          <div 
            className="group text-[16px] leading-[21px] sm:text-[42px] sm:leading-[47px] font-ivypresto font-semibold text-[#2E4D61] cursor-crosshair"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={gradientTextStyle}
          >
            Hey             
            <motion.span 
              className="not-italic inline-block ml-1"
              style={resetGradientStyle}
              animate={!isHovered ? {} : { 
                rotate: [0, 14, -8, 14, -4, 10, 0],
                transition: {
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity
                }
              }}
            >
              👋
            </motion.span> ! My name is
            <Image 
              src="/img/profile.png" 
              alt="Steven" 
              width={58} 
              height={58} 
              className="inline-block align-middle mx-2 mt-[-4px] saturate-0 group-hover:saturate-100 transition-all duration-300 ease-in-out hover:cursor-crosshair group-hover:scale-110 group-hover:rotate-[-2deg] group-hover:translate-y-[-2px] group-hover:shadow-lg rounded-xl ring-[#6A707A]/30 ring-1" 
            />
            Steven. &nbsp; I&apos;m a 
            <span 
              style={resetGradientStyle}
              className="not-italic inline-block mx-2 group-hover:saturate-100 transition-all duration-300 ease-in-out hover:cursor-crosshair group-hover:scale-110 group-hover:rotate-[-2deg] group-hover:translate-y-[-2px]"
            >
              🎨
            </span>
            designer who enjoys thinking in 
            <div className="relative inline-block align-middle mx-2 mt-[-2px] group-hover:saturate-100 transition-all duration-300 ease-in-out hover:cursor-crosshair group-hover:scale-110 group-hover:rotate-[2deg] group-hover:translate-y-[-2px]">
              <Image 
                src="/img/code-bg.png" 
                alt="code" 
                width={58} 
                height={58} 
                style={resetGradientStyle}
                className="saturate-0 group-hover:shadow-lg rounded-xl ring-[#6A707A]/30 ring-1" 
              />
              <span 
                className="absolute top-1 left-2 !text-green-500 font-nuvo text-xs"
                style={resetGradientStyle}
              >
                $
              </span>
              <motion.span
                style={resetGradientStyle}
                animate={{ opacity: [1, 0, 1] }} 
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="absolute top-1 left-4 !text-green-500 font-nuvo text-xs"
              >
                _
              </motion.span>
            </div>
            code.            
          </div>
      </div>
    </div>
  );
};

