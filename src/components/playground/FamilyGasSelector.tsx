"use client";

import React, { useRef, useState, useCallback, useMemo } from 'react';
import WordRotate, { WordRotateHandle } from '@/components/ui/word-rotate';
import { RadioGroupFamily, RadioGroupFamilyItem } from '@/components/ui/radio-group-family';
import { IconFlameFill, IconClockFill, IconBoltFill, IconInfoCircle, IconCheckmarkCircleFill } from 'symbols-react';
import NumberTicker, { NumberTickerHandle } from '@/components/ui/word-ticker';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

const lightThemeStyles = "bg-gray-50 border-gray-200/60 text-gray-800 font-urbane-rounded";
const darkThemeStyles = "bg-gray-800 border-gray-600 text-gray-50 font-urbane-rounded";

const getClassNames = (selectedValue: string, value: string) => {
    if (value === selectedValue) return "h-1 w-1 bg-transparent";
    if (selectedValue === 'Urgent') return value === 'Fast' ? "h-1.5 w-1.5 bg-yellow-500 mt-[3px]" : "h-1 w-1 bg-blue-500 mt-[-3px]";
    if (selectedValue === 'Fast') return value === 'Urgent' ? "h-1.5 w-1.5 bg-red-500 translate-y-[-1px]" : "h-1.5 w-1.5 bg-blue-500 translate-y-[-1px]";
    if (selectedValue === 'Normal') return value === 'Fast' ? "h-1.5 w-1.5 bg-yellow-500 mt-[3px]" : "h-1 w-1 bg-red-500 mb-[-5px]";
    return "h-2 w-2";
};

export const FamilyGasSelector: React.FC<{ isDark: boolean }> = ({ isDark }) => {
    const wordRotateRef = useRef<WordRotateHandle>(null);
    const secondsWordRotateRef = useRef<WordRotateHandle>(null);
    const numberTickerRef = useRef<NumberTickerHandle>(null);
    const feeTickerRef = useRef<NumberTickerHandle>(null);

    const [selectedValue, setSelectedValue] = useState('Normal');
    const [feeEstimate, setFeeEstimate] = useState(3.14);

    const handleRadioChange = useCallback((value: string) => {
        setSelectedValue(value);
        wordRotateRef.current?.trigger();
        secondsWordRotateRef.current?.trigger();

        const newTime = value === 'Urgent' ? 10 : value === 'Fast' ? 15 : 25;
        numberTickerRef.current?.trigger(newTime);

        const newFee = value === 'Urgent' ? 3.74 : value === 'Fast' ? 3.34 : 3.14;
        feeTickerRef.current?.trigger(newFee);
        setFeeEstimate(newFee);
    }, []);

    const getItemClassNames = useCallback((value: string) => {
        return getClassNames(selectedValue, value);
    }, [selectedValue]);

    const themeStyles = useMemo(() => isDark ? darkThemeStyles : lightThemeStyles, [isDark]);

    return (
        <div className={`${themeStyles} border px-4 py-3 rounded-3xl w-[390px] transition-all duration-100 ease-in-out`}>
            <div className="flex flex-col gap-y-4">
                <div className="flex flex-col justify-start items-start gap-y-2">
                    <div className="relative">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src="" alt="Burger.eth" />
                            <AvatarFallback className="text-4xl bg-green-400 rounded-full">🌮</AvatarFallback>
                        </Avatar>
                        <div className={`bg-white h-[24px] w-[24px] absolute rounded-full bottom-[0px] right-[0px] ring-4 ${isDark ? 'ring-gray-800' : 'ring-gray-100'} overflow-hidden`}>
                            <IconCheckmarkCircleFill className="h-[26px] w-[26px] fill-gray-800 rounded-full p-0 translate-x-[-1px] translate-y-[-1px]" />
                        </div>
                    </div>
                    <span className="text-2xl text-wrap font-bold">Confirm transaction to<br /> Taco</span>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <span className="text-lg text-gray-500 font-medium">
                        Total Value
                    </span>
                    <div className="flex flex-row justify-center items-center gap-x-2">
                        <span className="text-lg font-bold">$28.80</span>
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <span className="text-lg text-gray-500 font-medium">
                        Send USDC
                    </span>
                    <div className="flex flex-row justify-center items-center gap-x-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src="/img/token-usdc.png" alt="usdc" />
                            <AvatarFallback>$</AvatarFallback>
                        </Avatar>
                        <span className="text-lg font-bold">28.8147</span>
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <span className="text-lg text-gray-500 font-medium">
                        From
                    </span>
                    <div className="flex flex-row justify-center items-center gap-x-2">
                        <Avatar className="h-6 w-6 rounded-full">
                            <AvatarImage src="/img/bitmap-avvy.png" alt="Burger.eth" />
                            <AvatarFallback>BE</AvatarFallback>
                        </Avatar>
                        <span className="text-lg font-bold">Burger.eth</span>
                    </div>
                </div>

            </div>
            <Separator className={`mt-6 mb-3 scale-100 ${isDark ? 'bg-gray-700' : 'bg-gray-200/80'}`} />
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col">
                    <span className={`text-lg font-bold text-${isDark ? 'gray-50' : 'gray-800'}`}>
                        $<NumberTicker ref={feeTickerRef} value={feeEstimate} decimalPlaces={2} />
                    </span>
                    <div className="flex flex-row justify-center items-center gap-x-1">
                        <span className="text-sm text-gray-500 font-medium">Fee Estimate</span>
                        <IconInfoCircle className="w-4 h-4 fill-gray-500" />
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center gap-x-2">
                    <div className="flex flex-col justify-end items-end">
                        <WordRotate className="text-lg font-bold" ref={wordRotateRef} words={['Normal', 'Fast', 'Urgent']} currentWord={selectedValue} />
                        <WordRotate className="text-sm text-gray-500 font-medium" ref={secondsWordRotateRef}>
                            <span>~<NumberTicker ref={numberTickerRef} value={25} decimalPlaces={0} className="text-sm text-gray-500 font-medium" />Secs</span>
                        </WordRotate>
                    </div>
                    <motion.div
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 10, mass: 0.2 }}
                        className={`flex flex-col items-center gap-y-2 p-2 rounded-full w-[25px] ${isDark ? 'bg-gray-700' : 'bg-gray-200/80'}`}>
                        <RadioGroupFamily defaultValue="Normal" className="flex flex-col items-center" onValueChange={handleRadioChange}>
                            <RadioGroupFamilyItem className={getItemClassNames('Urgent')} value="Urgent" id="Urgent" icon={<IconFlameFill className="h-[24px] w-[24px] fill-red-500 scale-in-check p-1 mt-1" />} />
                            <RadioGroupFamilyItem className={getItemClassNames('Fast')} value="Fast" id="Fast" icon={<IconBoltFill className="h-[24px] w-[24px] fill-yellow-500 scale-in-check p-1" />} />
                            <RadioGroupFamilyItem className={getItemClassNames('Normal')} value="Normal" id="Normal" icon={<IconClockFill className="h-[22px] w-[22px] fill-blue-500 scale-in-check p-1" />} />
                        </RadioGroupFamily>
                    </motion.div>

                </div>
            </div>

        </div>
    );
};