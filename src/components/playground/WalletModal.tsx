"use client";

import { FC, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { WalletInfoContent } from './components/WalletInfoContent'

interface WalletModalProps {
  className?: string
}
export const WalletModal: FC<WalletModalProps> = () => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);


    const handleClose = () => {
        setOpen(false);
    }

    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="inline-flex items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#2b2b2b] text-white hover:bg-[#383838] h-10 px-4 py-2">
                What is a Wallet?
            </DialogTrigger>
            <DialogContent className="max-w-[350px] max-h-[520px] bg-[#2b2b2b] !rounded-[30px]">
                        <div ref={contentRef} style={{ width: '100%' }}>
                            <AnimatePresence mode="popLayout">
                                    <motion.div
                                        key="info"
                                        initial={{ opacity: 0, scale: 0.9, width: '100%' }}
                                        animate={{ opacity: 1, scale: 1, width: '100%' }}
                                        exit={{ opacity: 0, scale: 0.9, width: '100%' }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 260,
                                            damping: 20,
                                            mass: 1,
                                        }}
                                    >
                                        <WalletInfoContent onClose={handleClose} />
                                    </motion.div>
                            </AnimatePresence>
                        </div>
            </DialogContent>
        </Dialog>
    );
};