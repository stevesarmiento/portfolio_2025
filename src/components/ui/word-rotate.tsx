"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, useImperativeHandle, useState, useEffect, ReactNode } from "react";

interface WordRotateProps {
    words?: string[];
    currentWord?: string;
    framerProps?: HTMLMotionProps<"div">;
    className?: string;
    children?: ReactNode;
}

export interface WordRotateHandle {
    trigger: () => void;
}

const WordRotate = forwardRef<WordRotateHandle, WordRotateProps>(({
    words = [],
    currentWord,
    framerProps = {
        initial: { opacity: 0, y: -12, filter: "blur(3px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: 12, filter: "blur(3px)" },
        transition: { type: "spring", stiffness: 500, damping: 10, mass: 0.2 },
    },
    className,
    children,
}, ref) => {
    const [index, setIndex] = useState(currentWord ? words.indexOf(currentWord) : 0);

    useEffect(() => {
        if (currentWord) {
            setIndex(words.indexOf(currentWord));
        }
    }, [currentWord, words]);

    useImperativeHandle(ref, () => ({
        trigger: () => {
            setIndex((prevIndex) => (prevIndex + 1) % words.length);
        }
    }));

    return (
        <div className="overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={words[index]}
                    className={cn(className)}
                    {...framerProps}
                >
                    {children ? children : words[index]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
});

WordRotate.displayName = "WordRotate";

export default WordRotate;