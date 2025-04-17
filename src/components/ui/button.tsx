
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007BFF] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-[#0056b3] text-white hover:bg-[#003d7a]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-[#0056b3] bg-transparent text-[#0056b3] hover:bg-[#0056b3]/10",
        secondary:
          "bg-[#e9ecef] text-[#212529] border border-[#e9ecef] hover:bg-[#dde2e6] hover:border-[#dde2e6]",
        ghost: "text-[#0056b3] hover:bg-[#0056b3]/10 hover:text-[#003d7a]",
        link: "text-[#0056b3] underline-offset-4 hover:underline",
        success: "bg-[#28a745] text-white hover:bg-[#218838]",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-12 rounded-md px-8 text-lg",
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
