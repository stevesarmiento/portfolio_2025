"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const hexagonMask = {
  clipPath: "url(#hexagon-clip)",
  WebkitClipPath: "url(#hexagon-clip)"
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarWithIcon = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & { icon?: React.ReactNode }
>(({ className, icon, children, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0",
      className
    )}
    {...props}
  >
    {children}
    {icon && (
      <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-white">
        {icon}
      </div>
    )}
  </AvatarPrimitive.Root>
))
AvatarWithIcon.displayName = AvatarPrimitive.Root.displayName


const HexagonAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden",
      className
    )}
    {...props}
  >
    <svg width="0" height="0">
      <defs>
        <clipPath id="hexagon-clip" clipPathUnits="objectBoundingBox">
          <path d="M0.37909 0.0305825L0.0482719 0.23054C0.0183094 0.24865 0 0.281111 0 0.316121V0.670243C0 0.704339 0.0173726 0.736086 0.0460899 0.754467L0.376957 0.966248C0.409211 0.986893 0.450422 0.987305 0.483083 0.967309L0.831122 0.754222C0.860807 0.736047 0.878906 0.703744 0.878906 0.668937V0.317411C0.878906 0.281706 0.859869 0.24871 0.828958 0.230839L0.480871 0.0295915C0.449301 0.0113395 0.410299 0.0117192 0.37909 0.0305825ZM0.328493 0.061165L0.0965437 0.201362C0.0366188 0.237583 0 0.302505 0 0.372526V0.61552C0 0.683712 0.0347452 0.747205 0.0921797 0.783968L0.324226 0.932496C0.388734 0.973786 0.471157 0.97461 0.536478 0.934618L0.783338 0.783478C0.842708 0.747128 0.878906 0.682522 0.878906 0.612908V0.375106C0.878906 0.303696 0.840832 0.237704 0.77901 0.201961L0.532054 0.0591831C0.468914 0.022679 0.39091 0.0234384 0.328493 0.061165Z" />
        </clipPath>
      </defs>
    </svg>
    <div className="absolute inset-0 flex h-full w-full items-center justify-center" style={hexagonMask}>
      {children}
    </div>
  </AvatarPrimitive.Root>
))
HexagonAvatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback, HexagonAvatar, AvatarWithIcon }
