import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "border border-border bg-transparent text-foreground hover:bg-muted",
        ghost: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        link: "text-accent underline-offset-4 hover:underline",
        // KoreaMongol brand variants
        navy: "bg-navy text-white hover:bg-navy-light shadow-md",
        terracotta: "bg-terracotta text-white hover:bg-terracotta-dark shadow-md",
        gold: "bg-gold text-white hover:bg-gold-dark shadow-md",
        "outline-navy":
          "border-2 border-navy bg-transparent text-navy hover:bg-navy/5 shadow-sm",
        "outline-terracotta":
          "border-2 border-terracotta bg-transparent text-terracotta hover:bg-terracotta/5 shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
