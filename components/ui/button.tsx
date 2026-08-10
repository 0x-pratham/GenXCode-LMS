import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/cn"

const buttonVariants = cva(
  // Base UX Improvements: added active:scale-[0.98] for click feedback, tracking-wide for premium typography, and smooth ease-out transitions
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold tracking-wide ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // High-end solid button with a subtle white inner-top shadow for a 3D "machined" look
        default: "bg-primary text-primary-foreground shadow-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:bg-primary/90 hover:shadow-md",
        
        // Brand premium button (use for main CTAs). High contrast, crisp border, subtle gradient shift
        premium: "bg-brand-gradient text-white border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:brightness-110 shadow-lg hover:shadow-xl",
        
        // Clean, glass-like outline that looks expensive on dark backgrounds
        outline: "border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 backdrop-blur-md text-foreground shadow-sm",
        
        // Subtle secondary surface button
        secondary: "bg-surface border border-white/5 text-surface-foreground hover:bg-white/10 hover:border-white/10",
        
        // Ghost button that barely hints at its background until hovered
        ghost: "hover:bg-white/5 hover:text-foreground",
        
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2", // Increased height slightly for better modern touch targets
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base", // Premium large pill/rounded-xl size
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