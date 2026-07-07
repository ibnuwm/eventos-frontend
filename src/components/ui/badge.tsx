import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-indigo-600 text-white hover:bg-indigo-600/80",
    secondary: "border-transparent bg-slate-800 text-slate-100 hover:bg-slate-800/80",
    destructive: "border-transparent bg-red-600/20 text-red-400 border border-red-500/30",
    outline: "text-foreground border border-slate-700",
    success: "border-transparent bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    warning: "border-transparent bg-amber-500/20 text-amber-400 border border-amber-500/30",
    info: "border-transparent bg-blue-500/20 text-blue-400 border border-blue-500/30",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
