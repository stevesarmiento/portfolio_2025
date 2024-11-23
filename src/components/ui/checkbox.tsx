"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { IconCheckmarkSquareFill, IconSquare } from "symbols-react"

import { cn } from "@/lib/utils"

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  baseIcon?: React.ReactNode;
  checkmarkIcon?: React.ReactNode;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, baseIcon = <IconSquare className="h-[15px] w-[15px] text-primary ring-offset-background" />, checkmarkIcon = <IconCheckmarkSquareFill className="h-[15px] w-[15px] fill-primary animate-scale-in-check" />, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "relative peer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    {baseIcon}
    <CheckboxPrimitive.Indicator
      className={cn("absolute inset-0 flex items-center justify-center text-current")}
    >
      {checkmarkIcon}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }