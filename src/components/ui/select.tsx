"use client";
import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  placeholder?: string;
}

const SelectContext = createContext<SelectContextType>({
  value: "",
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
  placeholder: "",
});

export function Select({ value, onValueChange, placeholder, children }: { value: string; onValueChange: (value: string) => void; placeholder?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, placeholder }}>
      <div ref={ref} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  const { value, placeholder, open, setOpen } = useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors",
        className
      )}
    >
      <span className={cn(!value && "text-muted-foreground/60")}>
        {value || placeholder || "Pilih..."}
      </span>
      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
    </button>
  );
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  const { open } = useContext(SelectContext);
  if (!open) return null;
  return (
    <div className="absolute top-full mt-1 left-0 right-0 z-50 rounded-lg border border-border bg-card shadow-lg overflow-hidden">
      {children}
    </div>
  );
}

export function SelectItem({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const { onValueChange, setOpen } = useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => { onValueChange(value); setOpen(false); }}
      className={cn("w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors", className)}
    >
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return null;
}
