"use client"

import * as React from "react"
import * as RadioGroupFamilyPrimitive from "@radix-ui/react-radio-group"
import { cn } from "@/lib/utils"

const RadioGroupFamily = React.forwardRef<
    React.ElementRef<typeof RadioGroupFamilyPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadioGroupFamilyPrimitive.Root>
>(({ className, ...props }, ref) => {
    return (
        <RadioGroupFamilyPrimitive.Root
            className={cn("grid gap-2", className)}
            {...props}
            ref={ref}
        />
    )
})
RadioGroupFamily.displayName = RadioGroupFamilyPrimitive.Root.displayName

const RadioGroupFamilyItem = React.forwardRef<
    React.ElementRef<typeof RadioGroupFamilyPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroupFamilyPrimitive.Item> & { icon: React.ReactNode }
>(({ className, icon, ...props }, ref) => {
    return (
        <RadioGroupFamilyPrimitive.Item
            ref={ref}
            className={cn(
                "flex items-center justify-center bg-primary/5 rounded-full focus:bg-transparent disabled:cursor-not-allowed disabled:opacity-50",
                //"aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            <RadioGroupFamilyPrimitive.Indicator className="flex items-center justify-center">
                {icon}
            </RadioGroupFamilyPrimitive.Indicator>
        </RadioGroupFamilyPrimitive.Item>
    )
})
RadioGroupFamilyItem.displayName = RadioGroupFamilyPrimitive.Item.displayName

export { RadioGroupFamily, RadioGroupFamilyItem }