
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4299e1] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-[#4299e1] text-white hover:bg-[#3182ce] shadow-sm",
        destructive:
          "bg-[#f56565] text-white hover:bg-[#e53e3e] shadow-sm",
        outline:
          "border-2 border-[#4299e1] bg-transparent text-[#4299e1] hover:bg-[#4299e1]/10",
        secondary:
          "bg-[#1a202c] text-white border border-[#2d3748] hover:bg-[#2d3748] hover:border-[#4299e1] shadow-sm",
        ghost: "text-white hover:bg-[#374151] hover:text-white",
        link: "text-[#4299e1] underline-offset-4 hover:underline",
        success: "bg-[#10b981] text-white hover:bg-[#059669] shadow-sm",
        premium: "bg-[#9b87f5] hover:bg-[#8a76e4] text-white shadow-sm",
        gold: "bg-[#f6ad55] hover:bg-[#ed8936] text-[#0f172a] font-semibold shadow-sm",
        filter: "bg-transparent text-[#4299e1] border border-[#4299e1] hover:bg-[#4299e1] hover:text-white transition-colors",
        filterActive: "bg-[#4299e1] text-white border border-[#4299e1] hover:bg-[#3182ce]",
        header: "bg-transparent text-white hover:bg-[#374151] hover:text-white",
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
