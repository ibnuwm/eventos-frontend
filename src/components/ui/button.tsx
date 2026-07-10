import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants: Record<string, string> = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/25",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-border bg-transparent hover:bg-accent text-foreground hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent text-muted-foreground hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-500/25",
    };

    const sizes: Record<string, string> = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-12 rounded-lg px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          variants[variant] || variants.default,
          sizes[size] || sizes.default,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
