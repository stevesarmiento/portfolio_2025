'use client'

import Image from 'next/image';
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
    image: string;
}

interface IosAppFolderProps {
    className?: string;
}

const icons: AppIcon[] = [
    { name: 'Aufn', image: '/img/work-aufn.png' },
    { name: 'Component Kit', image: '/img/work-componentkit.png' },
    { name: 'RES', image: '/img/work-res.png' },
    { name: 'Toshi', image: '/img/work-toshi.png' },
    { name: 'Symbols', image: '/img/work-symbols.png' },
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
                                {icons.map((icon) => (
                                    <div key={icon.name} className="relative w-[35px] h-[35px] rounded-lg overflow-hidden">
                                        <Image
                                            src={icon.image}
                                            alt={`${icon.name} app icon`}
                                            fill
                                            sizes="35px"
                                            className="object-cover"
                                        />
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
                                {icons.map((icon) => (
                                    <div className="flex flex-col items-center" key={icon.name}>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className="relative w-[100px] h-[100px] rounded-3xl overflow-hidden cursor-pointer active:scale-95 transition-all duration-150 ease-in-out">
                                                    <Image
                                                        src={icon.image}
                                                        alt={`${icon.name} app icon`}
                                                        fill
                                                        sizes="100px"
                                                        className="object-cover"
                                                    />
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

