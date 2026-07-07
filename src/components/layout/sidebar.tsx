"use client";

import React from "react";
import { ModuleId } from "@/types";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  FileSpreadsheet,
  Calculator,
  Clock,
  MessageSquare,
  FolderOpen,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  AlertTriangle,
  UserCheck,
  Smartphone,
  Award,
  Crown,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
}

export function Sidebar({ activeModule, onSelectModule }: SidebarProps) {
  const navItems: { id: ModuleId; label: string; icon: React.ElementType; badge?: string; isSpecial?: boolean }[] = [
    { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "monopoly", label: "🚀 Stage 2 Monopoly King", icon: Rocket, isSpecial: true, badge: "NEW v4.0" },
    { id: "roadmap", label: "👑 Stage 1 Category King", icon: Crown, isSpecial: true, badge: "v3.0" },
    { id: "improvements", label: "🌟 8 Improvements Hub", icon: Award, isSpecial: true, badge: "VERIFIED" },
    { id: "wanative", label: "💬 WhatsApp-Native Flow", icon: Smartphone, isSpecial: true },
    { id: "crm", label: "Modul 1: CRM & Pipeline", icon: Users, badge: "3 New" },
    { id: "project", label: "Modul 2 & 7: ClickUp Task", icon: CheckSquare },
    { id: "quotation", label: "Modul 4: Quotation Builder", icon: FileSpreadsheet },
    { id: "budget", label: "Modul 6: Realtime Budget", icon: Calculator },
    { id: "rundown", label: "Modul 8: Rundown Builder", icon: Clock },
    { id: "ai", label: "Modul 12: AI Assistant ✨", icon: Sparkles, isSpecial: true },
    { id: "chat", label: "Modul 9: Vendor Chat Hub", icon: MessageSquare },
    { id: "marketplace", label: "Modul 3 & 13: Marketplace", icon: ShoppingBag },
    { id: "inventory", label: "Modul 14: Asset Conflict", icon: AlertTriangle, badge: "⚠️ 1" },
    { id: "approval", label: "Modul 11: Client Portal", icon: CheckCircle2 },
    { id: "files", label: "Modul 10: File Storage", icon: FolderOpen },
    { id: "staff", label: "Modul 15: Staff Crew", icon: UserCheck },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
          OS
        </div>
        <div>
          <div className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
            EventOS.id
            <span className="text-[10px] bg-purple-500/20 text-purple-300 font-semibold px-1.5 py-0.5 rounded border border-purple-500/30">
              King v4.0
            </span>
          </div>
          <div className="text-xs text-slate-400">Vendor Event Operating System</div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Monopoly & Core OS Hub
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold"
                  : item.isSpecial
                  ? "text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              )}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={cn(
                    "w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110",
                    isActive ? "text-white" : item.isSpecial ? "text-purple-400" : "text-slate-400"
                  )}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-bold",
                    isActive
                      ? "bg-white/20 text-white"
                      : item.badge.includes("⚠️")
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : item.badge.includes("NEW")
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : item.badge === "VERIFIED"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tenant Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold text-slate-300">Plan: Category Monopoly v4.0</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <div className="text-[11px] text-slate-500 truncate">Tenant: Anisa Wedding Planner</div>
      </div>
    </aside>
  );
}
