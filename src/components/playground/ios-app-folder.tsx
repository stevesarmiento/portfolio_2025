'use client'

import Image from 'next/image';
import React from 'react';
import { 
    Dialog,
    DialogTrigger,
    DialogContent,
} from '@/components/ui/dialog-ios';
import { 
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover-ios';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import {
    IconAppsIphone,
    IconSquareAndArrowUp,
    IconMinusCircle,
} from 'symbols-react';


interface AppIcon {
    name: string;
    icon: React.ReactNode;
}

interface IosAppFolderProps {
    className?: string;
}

const icons: AppIcon[] = [
    { name: 'Aufn', icon: <Image src="/img/work-aufn.png" alt="Icon 1" layout="fill" objectFit="cover" /> },
    { name: 'Component Kit', icon: <Image src="/img/work-componentkit.png" alt="Icon 2" layout="fill" objectFit="cover" /> },
    { name: 'RES', icon: <Image src="/img/work-res.png" alt="Icon 3" layout="fill" objectFit="cover" /> },
    { name: 'Toshi', icon: <Image src="/img/work-toshi.png" alt="Icon 4" layout="fill" objectFit="cover" /> },
    { name: 'Symbols', icon: <Image src="/img/work-symbols.png" alt="Icon 5" layout="fill" objectFit="cover" /> },
];


export function IosAppFolder({ className = "" }: IosAppFolderProps) {
  
    return (
    <div className={`flex flex-col items-center ${className}`}>
        <AnimatePresence>
            <Dialog>
                <DialogTrigger asChild>
                    <motion.div 
                        layoutId="ios-app-folder" 
                        className="bg-black/30 backdrop-blur-lg h-[160px] w-[160px] rounded-[30px] p-4 cursor-pointer"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}    
                        whileHover={{ scale: 1.05 }}
                        >
                            <div className="grid grid-cols-3 gap-3">
                                {icons.map((icon, index) => (
                                    <div key={index} className="relative w-[35px] h-[35px] rounded-lg overflow-hidden">
                                        {icon.icon}
                                    </div>
                                ))}
                            </div>
                    </motion.div>
                </DialogTrigger>
                    <DialogContent hideTitle>
                        <motion.div 
                            layoutId="ios-app-folder" 
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}                             
                            className="bg-black/50 backdrop-blur-lg h-[460px] w-[460px] rounded-[60px] p-12 cursor-pointer"
                        >
                            <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                                {icons.map((icon, index) => (
                                    <div className="flex flex-col items-center" key={index}>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className="relative w-[100px] h-[100px] rounded-3xl overflow-hidden cursor-pointer active:scale-95 transition-all duration-150 ease-in-out">
                                                    {icon.icon}
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent align="start">
                                                <div className="flex flex-col justify-center items-center">
                                                    <div className="flex flex-row items-center justify-between w-full px-2 active:scale-95 transition-all duration-150 ease-in-out cursor-pointer">
                                                        <span className="text-white">Edit Home Screen</span>
                                                        <IconAppsIphone className="fill-white" />
                                                    </div>
                                                    <Separator className="opacity-20 my-4" />
                                                    <div className="flex flex-row items-center justify-between w-full px-2 active:scale-95 transition-all duration-150 ease-in-out cursor-pointer">
                                                        <span className="text-white">Share App</span>
                                                        <IconSquareAndArrowUp className="fill-white" />
                                                    </div>
                                                    <Separator className="opacity-20 my-4" />
                                                    <div className="flex flex-row items-center justify-between w-full px-2 active:scale-95 transition-all duration-150 ease-in-out cursor-pointer">
                                                        <span className="text-red-500">Remove App</span>
                                                        <IconMinusCircle className="fill-red-500" />
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        <span className="text-white font-medium mt-2 text-xs">{icon.name}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </DialogContent>
            </Dialog>
        </AnimatePresence>
        <h1 className="text-[30px] font-bold mt-3">👀</h1>
    </div>
    );
};


