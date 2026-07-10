"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, ArrowRight, PanelRightClose, Zap, MessageSquare, FileSpreadsheet, Users, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModuleId } from "@/types";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  shortcut?: string;
  category: string;
}

interface CommandPaletteProps {
  onNavigate: (module: ModuleId) => void;
  onSendWa?: () => void;
  onNewProject?: () => void;
  onNewQuotation?: () => void;
}

export function CommandPalette({ onNavigate, onNewProject, onNewQuotation }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items: CommandItem[] = [
    { id: "go-dashboard", label: "Go to Dashboard", description: "View main dashboard", icon: LayoutDashboard, action: () => onNavigate("dashboard"), shortcut: "G D", category: "Navigate" },
    { id: "go-crm", label: "Go to CRM Pipeline", description: "Manage leads & prospects", icon: Users, action: () => onNavigate("crm"), shortcut: "G C", category: "Navigate" },
    { id: "go-project", label: "Go to Projects", description: "View project management", icon: LayoutDashboard, action: () => onNavigate("project"), shortcut: "G P", category: "Navigate" },
    { id: "go-quotation", label: "Go to Quotation Builder", description: "Create and manage quotes", icon: FileSpreadsheet, action: () => onNavigate("quotation"), shortcut: "G Q", category: "Navigate" },
    { id: "go-rundown", label: "Go to Rundown Builder", description: "Event timeline", icon: LayoutDashboard, action: () => onNavigate("rundown"), shortcut: "G R", category: "Navigate" },
    { id: "go-chat", label: "Go to Chat Hub", description: "Vendor communication", icon: MessageSquare, action: () => onNavigate("chat"), shortcut: "G H", category: "Navigate" },
    { id: "go-budget", label: "Go to Budget Engine", description: "Profit & margin analysis", icon: LayoutDashboard, action: () => onNavigate("budget"), shortcut: "G B", category: "Navigate" },
    { id: "go-marketplace", label: "Go to Marketplace", description: "Browse B2B vendors", icon: LayoutDashboard, action: () => onNavigate("marketplace"), shortcut: "G M", category: "Navigate" },
    { id: "go-inventory", label: "Go to Asset Inventory", description: "Track equipment conflicts", icon: LayoutDashboard, action: () => onNavigate("inventory"), shortcut: "G I", category: "Navigate" },
    { id: "go-staff", label: "Go to Staff Management", description: "Crew rostering", icon: LayoutDashboard, action: () => onNavigate("staff"), shortcut: "G S", category: "Navigate" },
    { id: "go-ai", label: "Open AI Copilot", description: "AI-powered assistance", icon: Zap, action: () => onNavigate("ai"), shortcut: "G A", category: "Navigate" },
    { id: "action-new-quote", label: "New Quotation", description: "Create a new quotation", icon: FileSpreadsheet, action: () => { onNewQuotation?.(); setIsOpen(false); }, shortcut: "N Q", category: "Actions" },
    { id: "action-new-project", label: "New Project", description: "Start a new event project", icon: LayoutDashboard, action: () => { onNewProject?.(); setIsOpen(false); }, shortcut: "N P", category: "Actions" },
  ];

  const filtered = query.trim()
    ? items.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].action();
        setIsOpen(false);
      }
    },
    [filtered, selectedIndex]
  );

  useEffect(() => {
    const selectedEl = listRef.current?.children[selectedIndex] as HTMLElement;
    selectedEl?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/60 bg-card/50 text-muted-foreground hover:text-foreground hover:border-border text-xs transition-colors ring-focus"
        aria-label="Open command palette"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Quick navigation...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-[10px] font-semibold text-muted-foreground">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50 mx-4"
            >
              <div className="bg-card border border-border/60 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
                  <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search modules, actions..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
                  />
                  <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold">ESC</kbd>
                </div>

                <div ref={listRef} className="max-h-[300px] overflow-y-auto p-2 space-y-0.5 scrollbar-thin">
                  {filtered.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No results for <span className="font-semibold text-foreground">&ldquo;{query}&rdquo;</span>
                    </div>
                  )}

                  {filtered.map((item, idx) => {
                    const Icon = item.icon;
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          item.action();
                          setIsOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                          isSelected
                            ? "bg-brand-500/15 text-brand-400"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <Icon className={cn("w-4 h-4 flex-shrink-0", isSelected ? "text-brand-400" : "")} />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-foreground">{item.label}</div>
                          {item.description && (
                            <div className="text-[11px] text-muted-foreground">{item.description}</div>
                          )}
                        </div>
                        {item.shortcut && (
                          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                            {item.shortcut}
                          </kbd>
                        )}
                        {isSelected && <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
