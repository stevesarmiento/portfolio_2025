import React from 'react';
import { motion } from 'framer-motion';
import { IconSealFill } from 'symbols-react';

const InitialLoader: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center text-white w-screen h-screen bg-[#E1E7F3]">
        <motion.div 
            className="flex items-center justify-center"
            initial={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            animate={{ scale: 2, opacity: 0, filter: 'blur(10px)' }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >          
          <div className="group relative hover:cursor-crosshair">
            <IconSealFill className=" h-[50px] w-[50px] fill-[#2E4D61] transition-all duration-150 ease-in-out animate-spin" />
            <h1 className="absolute left-[20px] top-[11px] text-xl font-rafaella text-white transition-all duration-150 ease-in-out">S</h1>
          </div>
        </motion.div>
    </main>
  );
};

export default InitialLoader;

