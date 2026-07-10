"use client";

import React from "react";
import { ModuleId } from "@/types";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, CheckSquare, MessageSquare, Sparkles, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/context";

const mobileNavItems: { id: ModuleId; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Beranda", icon: LayoutDashboard },
  { id: "crm", label: "CRM", icon: Users },
  { id: "project", label: "Tugas", icon: CheckSquare },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "ai", label: "AI", icon: Sparkles },
];

interface BottomNavProps {
  activeModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  onOpenSidebar: () => void;
}

export function BottomNav({ activeModule, onSelectModule, onOpenSidebar }: BottomNavProps) {
  const { showToast } = useApp();

  return (
    <>
      {/* Mobile spacer */}
      <div className="h-20 lg:hidden" />

      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-border/60 bg-card/90 backdrop-blur-xl safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2 pt-1">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-all relative min-w-[56px] h-full",
                  isActive
                    ? "text-brand-400"
                    : "text-muted-foreground/60 hover:text-foreground"
                )}
                aria-label={item.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-brand-400"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon className={cn(
                  "w-5 h-5",
                  isActive && "drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]"
                )} />
                <span className={cn(
                  "text-[11px] font-semibold leading-tight",
                  isActive ? "opacity-100" : "opacity-60"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Menu button */}
          <button
            onClick={onOpenSidebar}
            className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl text-muted-foreground/60 hover:text-foreground min-w-[56px] h-full"
            aria-label="Menu lengkap"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="flex flex-col gap-1">
                <span className="block w-1 h-1 rounded-full bg-current" />
                <span className="block w-1 h-1 rounded-full bg-current" />
                <span className="block w-1 h-1 rounded-full bg-current" />
              </div>
            </div>
            <span className="text-[11px] font-semibold leading-tight opacity-60">Menu</span>
          </button>
        </div>
      </nav>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => showToast("Aksi cepat: Buat proyek baru, quotation, atau undang vendor")}
        className="fixed right-4 bottom-20 lg:hidden z-50 w-12 h-12 rounded-full gradient-brand shadow-lg shadow-brand-500/40 flex items-center justify-center text-white"
        aria-label="Aksi cepat"
      >
        <Plus className="w-5 h-5" />
      </motion.button>
    </>
  );
}
