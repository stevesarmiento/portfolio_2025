"use client"

import * as React from "react"
import * as SheetFloatingPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { IconXmarkCircleFill } from "symbols-react"
import { cn } from "@/lib/utils"

const SheetFloating = SheetFloatingPrimitive.Root

const SheetFloatingTrigger = SheetFloatingPrimitive.Trigger

const SheetFloatingClose = SheetFloatingPrimitive.Close

const SheetFloatingPortal = SheetFloatingPrimitive.Portal

const SheetFloatingOverlay = React.forwardRef<
    React.ElementRef<typeof SheetFloatingPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof SheetFloatingPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <SheetFloatingPrimitive.Overlay
        className={cn(
            "fixed inset-0 z-50 bg-black/10 backdrop-blur-sm  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
        ref={ref}
    />
))
SheetFloatingOverlay.displayName = SheetFloatingPrimitive.Overlay.displayName

const sheetFloatingVariants = cva(
    "fixed z-50 gap-4 bg-white p-4 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-200 m-4 rounded-2xl",
    {
        variants: {
            side: {
                top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
                bottom:
                    "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
                left: "inset-y-0 left-0 w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
                right:
                    "inset-y-0 right-0 w-3/4  border-l border-white/10 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-md",
            },
        },
        defaultVariants: {
            side: "right",
        },
    }
)

interface SheetFloatingContentProps
    extends React.ComponentPropsWithoutRef<typeof SheetFloatingPrimitive.Content>,
    VariantProps<typeof sheetFloatingVariants> { }

const SheetFloatingContent = React.forwardRef<
    React.ElementRef<typeof SheetFloatingPrimitive.Content>,
    SheetFloatingContentProps
>(({ side = "right", className, children, ...props }, ref) => (
    <SheetFloatingPortal>
        <SheetFloatingOverlay />
        <SheetFloatingPrimitive.Content
            ref={ref}
            className={cn(sheetFloatingVariants({ side }), className)}
            {...props}
        >
            {children}
            <SheetFloatingPrimitive.Close className="absolute right-4 top-4 active:scale-95 rounded-full">
                <IconXmarkCircleFill className="h-6 w-6 fill-black/30 hover:fill-black/40 disabled:pointer-events-none data-[state=open]:bg-secondary" />
                <span className="sr-only">Close</span>
            </SheetFloatingPrimitive.Close>
        </SheetFloatingPrimitive.Content>
    </SheetFloatingPortal>
))
SheetFloatingContent.displayName = SheetFloatingPrimitive.Content.displayName

const SheetFloatingHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-2 text-center sm:text-left",
            className
        )}
        {...props}
    />
)
SheetFloatingHeader.displayName = "SheetFloatingHeader"

const SheetFloatingFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
            className
        )}
        {...props}
    />
)
SheetFloatingFooter.displayName = "SheetFloatingFooter"

const SheetFloatingTitle = React.forwardRef<
    React.ElementRef<typeof SheetFloatingPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof SheetFloatingPrimitive.Title>
>(({ className, ...props }, ref) => (
    <SheetFloatingPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold text-foreground", className)}
        {...props}
    />
))
SheetFloatingTitle.displayName = SheetFloatingPrimitive.Title.displayName

const SheetFloatingDescription = React.forwardRef<
    React.ElementRef<typeof SheetFloatingPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof SheetFloatingPrimitive.Description>
>(({ className, ...props }, ref) => (
    <SheetFloatingPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
SheetFloatingDescription.displayName = SheetFloatingPrimitive.Description.displayName

export {
    SheetFloating,
    SheetFloatingPortal,
    SheetFloatingOverlay,
    SheetFloatingTrigger,
    SheetFloatingClose,
    SheetFloatingContent,
    SheetFloatingHeader,
    SheetFloatingFooter,
    SheetFloatingTitle,
    SheetFloatingDescription,
}
