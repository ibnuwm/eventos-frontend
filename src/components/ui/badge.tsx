import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    destructive: "border-transparent bg-destructive/15 text-destructive border border-destructive/25",
    outline: "text-foreground border-border bg-transparent",
    success: "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25",
    warning: "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25",
    info: "border-transparent bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}
