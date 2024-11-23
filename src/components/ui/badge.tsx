import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-crosshair",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        success:
          "border-green-500 bg-green-500 text-white hover:bg-green-500/80",
        error:
          "border-red-500 bg-red-500 text-white hover:bg-red-500/80",
        warning:
          "border-yellow-500 bg-yellow-500 text-white hover:bg-yellow-500/80",
        outline: "border border-primary/30 bg-primary/5 text-primary/40 hover:bg-primary/10",
        outlineSuccess: "border border-green-500 bg-green-500/5 text-green-500 hover:bg-green-500/10",
        outlineError: "border border-red-500 bg-red-500/5 text-red-500 hover:bg-red-500/10",
        outlineWarning: "border border-yellow-500 bg-yellow-500/5 text-yellow-500 hover:bg-yellow-500/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
