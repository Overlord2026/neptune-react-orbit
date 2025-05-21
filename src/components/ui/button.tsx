
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 duration-200",
  {
    variants: {
      variant: {
        default: "bg-[#3b82f6] text-white hover:bg-[#2563eb] shadow-md hover:shadow-lg hover:translate-y-[-1px]",
        destructive:
          "bg-[#ef4444] text-white hover:bg-[#dc2626] shadow-md hover:shadow-lg hover:translate-y-[-1px]",
        outline:
          "border-2 border-[#3b82f6] bg-transparent text-[#3b82f6] hover:bg-[#3b82f6]/10 hover:shadow-md",
        secondary:
          "bg-[#141c2e] text-white border border-[#202a42] hover:bg-[#202a42] hover:border-[#3b82f6] shadow-md hover:shadow-lg",
        ghost: "text-white hover:bg-[#202a42] hover:text-white",
        link: "text-[#3b82f6] underline-offset-4 hover:underline",
        success: "bg-[#10b981] text-white hover:bg-[#059669] shadow-md hover:shadow-lg hover:translate-y-[-1px]",
        premium: "bg-[#8b5cf6] hover:bg-[#7c3aed] text-white shadow-md hover:shadow-lg hover:translate-y-[-1px]",
        gold: "bg-[#f59e0b] hover:bg-[#d97706] text-[#0a0f1d] font-semibold shadow-md hover:shadow-lg hover:translate-y-[-1px]",
        filter: "bg-transparent text-[#3b82f6] border border-[#3b82f6] hover:bg-[#3b82f6] hover:text-white transition-colors",
        filterActive: "bg-[#3b82f6] text-white border border-[#3b82f6] hover:bg-[#2563eb]",
        header: "bg-transparent text-white hover:bg-[#202a42] hover:text-white",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-12 rounded-md px-8 text-lg py-3",
        xl: "h-14 rounded-md px-8 text-lg py-4",
        icon: "h-11 w-11",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
