"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface NumberTickerProps {
    value: number;
    direction?: "up" | "down";
    delay?: number;
    className?: string;
    duration?: number;
    decimalPlaces?: number;
}

export interface NumberTickerHandle {
    trigger: (newValue: number) => void;
}

const NumberTicker = forwardRef<NumberTickerHandle, NumberTickerProps>(({
    value,
    direction = "up",
    delay = 0,
    className,
    duration = 1,
    decimalPlaces = 0,
}, ref) => {
    const spanRef = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(direction === "down" ? value : 0);
    const springValue = useSpring(motionValue, {
        damping: 20,
        stiffness: 400,
        mass: duration,
    });
    const isInView = useInView(spanRef, { once: true, margin: "0px" });

    useEffect(() => {
        isInView &&
            setTimeout(() => {
                motionValue.set(direction === "down" ? 0 : value);
            }, delay * 1000);
    }, [motionValue, isInView, delay, value, direction]);

    useEffect(
        () =>
            springValue.on("change", (latest) => {
                if (spanRef.current) {
                    spanRef.current.textContent = Intl.NumberFormat("en-US", {
                        minimumFractionDigits: decimalPlaces,
                        maximumFractionDigits: decimalPlaces,
                    }).format(latest);
                }
            }),
        [springValue, decimalPlaces],
    );

    useImperativeHandle(ref, () => ({
        trigger: (newValue: number) => {
            motionValue.set(direction === "down" ? newValue : 0);
            setTimeout(() => {
                motionValue.set(direction === "down" ? 0 : newValue);
            }, delay * 1000);
        }
    }));

    return (
        <span
            className={cn(
                "inline-block tabular-nums",
                className,
            )}
            ref={spanRef}
        />
    );
});

NumberTicker.displayName = "NumberTicker";

export default NumberTicker;