import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-500/25",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      outline: "border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-200",
      secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700",
      ghost: "hover:bg-slate-800 text-slate-300 hover:text-white",
      link: "text-indigo-400 underline-offset-4 hover:underline",
      success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-500/25",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-12 rounded-lg px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          variants[variant],
          sizes[size],
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
