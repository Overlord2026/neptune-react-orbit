
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007BFF] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-[#0056b3] text-white hover:bg-[#003d7a] shadow-sm",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        outline:
          "border-2 border-[#3b82f6] bg-transparent text-[#3b82f6] hover:bg-[#3b82f6]/10",
        secondary:
          "bg-[#1f2937] text-white border border-[#374151] hover:bg-[#374151] hover:border-[#4b5563] shadow-sm",
        ghost: "text-[#3b82f6] hover:bg-[#3b82f6]/10 hover:text-[#60a5fa]",
        link: "text-[#3b82f6] underline-offset-4 hover:underline",
        success: "bg-[#10b981] text-white hover:bg-[#059669] shadow-sm",
        premium: "bg-[#8a76e4] hover:bg-[#7c5fec] text-white shadow-sm",
        filter: "bg-transparent text-[#3b82f6] border border-[#3b82f6] hover:bg-[#3b82f6] hover:text-white transition-colors",
        filterActive: "bg-[#3b82f6] text-white border border-[#3b82f6] hover:bg-[#2563eb]",
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
