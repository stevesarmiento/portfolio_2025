"use client";

import React, { useState } from 'react';
import { WalletIllustration } from './WalletIllustration';
import { motion, AnimatePresence } from 'framer-motion';
import { IconChevronBackward, IconXmark } from 'symbols-react';

interface WalletInfoContentProps {
    onClose: () => void;
}

const steps = [
    {
        title: 'What is a Wallet?',
        content:
            'Wallets let you store, receive, send, and interact with digital assets like NFTs and tokens within web apps.',
    },
    {
        title: 'Security & Ease of Use.',
        content:
            'With blockchain apps, your wallet is used as a secure and easy way to login and interact with web applications.',
    },
    {
        title: 'Decentralized & Permissionless.',
        content:
            'An essential utility for permissionless blockchain usage. Wallets let you explore and participate in the new web.',
    },
];

export const WalletInfoContent: React.FC<WalletInfoContentProps> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const goToStep = (step: number) => {
        setCurrentStep(step);
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="relative flex items-center justify-between w-full m-0 pb-8">
                <button 
                    onClick={onClose}
                    className="group p-2 bg-white/5 hover:bg-white/10 rounded-full"
                >
                    <IconChevronBackward className="w-3.5 h-3.5 fill-white/40  group-hover:fill-white/60" />
                </button>
                
                <h1 className="font-medium text-md leading-9 text-center text-white">
                    About Wallets
                </h1>

                <button
                    onClick={onClose}
                    className="group p-2 bg-white/5 hover:bg-white/10 rounded-full"
                >
                    <IconXmark className="w-3 h-3 fill-white/40  group-hover:fill-white/60" />
                </button>
            </div>
            <WalletIllustration
                className="wallet-info-illustration"
                circleColors={['#123456', '#789ABC', '#DEF012', '#345678']}
                currentStep={currentStep}
            />
            <div className="relative w-[90%] h-[120px]">
                <AnimatePresence mode="popLayout">
                    <motion.div 
                        key={currentStep}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center"
                    >
                        <h3 className="text-md font-bold text-white">
                            {steps[currentStep].title}
                        </h3>
                        <p className="text-sm font-normal leading-[21px] text-[#808080]">
                            {steps[currentStep].content}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className="items-center justify-center flex relative w-full h-[30px]">
            <div className="w-full h-[1px] absolute bg-gradient-to-r from-[rgba(59,59,59,0)] via-[rgb(87,87,87)] to-[rgba(59,59,59,0)]" />
            <div className="justify-center bg-[#2b2b2b] items-center h-[10px] flex absolute p-[10px]">
                    {steps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToStep(index)}
                            className={`cursor-pointer bg-[#444444] border-none rounded-[20%] w-[6px] h-[6px] mx-[5px] my-0 transition-all duration-200 ease-in-out
                                hover:bg-[#575757] hover:h-[10px]
                                ${index === currentStep ? 
                                'bg-[#4e44ce] w-[30px] hover:bg-[#685EEB] hover:w-[30px] hover:h-[10px]' 
                                : ''
                                }`}
                            />
                    ))}
                </div>
            </div>

            <button className="text-white cursor-pointer bg-[#444444] hover:bg-[#3d35a5] border-none rounded-[15px] py-[15px] px-[20px] mb-[17px] text-base w-full transition-transform duration-200 ease-in-out hover:scale-98">
                Learn More
            </button>
        </div>
    );
};