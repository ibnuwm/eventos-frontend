"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  compact?: boolean;
  mood?: "neutral" | "celebrate" | "suggest";
}

const moods = {
  neutral: { bg: "bg-brand-500/10 text-brand-400", border: "border-brand-500/20" },
  celebrate: { bg: "bg-emerald-500/10 text-emerald-400", border: "border-emerald-500/20" },
  suggest: { bg: "bg-purple-500/10 text-purple-400", border: "border-purple-500/20" },
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  compact,
  mood = "neutral",
}: EmptyStateProps) {
  const moodStyle = moods[mood];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-8 px-4" : "py-16 px-6",
        className
      )}
    >
      {icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className={cn(
            "mb-4 flex items-center justify-center",
            compact ? "w-12 h-12" : "w-16 h-16",
            "rounded-2xl",
            moodStyle.bg
          )}
        >
          {icon}
        </motion.div>
      )}

      <h3 className={cn("font-display font-bold text-foreground", compact ? "text-base" : "text-xl")}>
        {title}
      </h3>

      {description && (
        <p className={cn("mt-1.5 text-muted-foreground max-w-sm leading-relaxed", compact ? "text-xs" : "text-sm")}>
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-6">
          {action && (
            <Button onClick={action.onClick} size={compact ? "sm" : "default"} className="font-semibold gap-2">
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              size={compact ? "sm" : "default"}
              className="font-semibold"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}

export const ILLUSTRATIONS = {
  project: (
    <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
      <rect x="8" y="8" width="48" height="48" rx="8" stroke="currentColor" strokeWidth="2" />
      <rect x="16" y="18" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.6" />
      <rect x="34" y="18" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.3" />
      <rect x="16" y="26" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.6" />
      <rect x="34" y="26" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.3" />
      <rect x="16" y="34" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="48" cy="44" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M46 44l1.5 1.5L50 42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  lead: (
    <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="20" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M18 52c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M44 12l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  vendor: (
    <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
      <rect x="10" y="18" width="44" height="34" rx="4" stroke="currentColor" strokeWidth="2" />
      <rect x="16" y="26" width="32" height="6" rx="2" fill="currentColor" opacity="0.2" />
      <circle cx="24" cy="40" r="3" fill="currentColor" opacity="0.4" />
      <circle cx="40" cy="40" r="3" fill="currentColor" opacity="0.4" />
      <path d="M32 8v6M28 11h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  chat: (
    <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
      <path d="M8 8h48v36H20l-12 8V8z" stroke="currentColor" strokeWidth="2" rx="4" />
      <rect x="18" y="18" width="12" height="3" rx="1.5" fill="currentColor" opacity="0.4" />
      <rect x="34" y="18" width="12" height="3" rx="1.5" fill="currentColor" opacity="0.2" />
      <rect x="18" y="26" width="20" height="3" rx="1.5" fill="currentColor" opacity="0.4" />
      <rect x="18" y="34" width="8" height="3" rx="1.5" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  invoice: (
    <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
      <rect x="12" y="6" width="40" height="52" rx="4" stroke="currentColor" strokeWidth="2" />
      <rect x="20" y="16" width="24" height="3" rx="1.5" fill="currentColor" opacity="0.4" />
      <rect x="20" y="24" width="24" height="3" rx="1.5" fill="currentColor" opacity="0.2" />
      <rect x="20" y="32" width="16" height="3" rx="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="46" cy="46" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M44 46l1.5 1.5L48 44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  inventory: (
    <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
      <rect x="8" y="12" width="48" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <rect x="8" y="36" width="48" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <rect x="16" y="18" width="32" height="4" rx="2" fill="currentColor" opacity="0.3" />
      <rect x="16" y="42" width="32" height="4" rx="2" fill="currentColor" opacity="0.3" />
      <path d="M32 28v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};
