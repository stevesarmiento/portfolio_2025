import React from 'react';
import { motion } from 'framer-motion';
import { IconSealFill } from 'symbols-react';

const InitialLoader: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center text-white w-screen h-screen bg-black">
        <motion.div 
            className="flex items-center justify-center"
            initial={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            animate={{ scale: 2, opacity: 0, filter: 'blur(10px)' }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >          
          <div className="group relative hover:cursor-crosshair">
            <IconSealFill className=" h-[50px] w-[50px] fill-[#ffb7b7] transition-all duration-150 ease-in-out animate-spin" />
          </div>
        </motion.div>
    </main>
  );
};

export default InitialLoader;

