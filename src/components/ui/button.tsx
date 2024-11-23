import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap ring-1 ring-transparent text-sm font-bold transition-colors disabled:pointer-events-none disabled:opacity-50 transition-all duration-150 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90 active:scale-[0.98]",
        destructive:
          "bg-red-500 text-white hover:bg-red-400 active:scale-[0.98]",
        outline:
          "ring-1 ring-primary/20 bg-primary/0 hover:bg-primary/5 text-primary active:scale-[0.98]",
        secondary:
          "bg-gray-200 text-gray-800 hover:bg-gray-200/60 active:scale-[0.98]",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
        defaultSkeu: "bg-primary text-white hover:bg-primary/90 active:scale-[0.98] border-t-[1px] border-white/15 ring-1 ring-gray-800",
        destructiveSkeu:
          "bg-red-500 text-white hover:bg-red-400 active:scale-[0.98] border-t-[1px] border-white/20 ring-1 ring-red-500",
        secondarySkeu:
          "bg-gray-200 text-gray-800 hover:bg-gray-200/80 active:scale-[0.98] border-t-[1px] border-white/60 ring-1 ring-primary/10",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, startIcon, endIcon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {startIcon && <span className="mr-2">{startIcon}</span>}
        {children}
        {endIcon && <span className="ml-2">{endIcon}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }