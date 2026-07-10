"use client";

import React from "react";
import { ModuleId } from "@/types";
import { useApp } from "@/lib/context";
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
  X,
  Package,
  UserPlus,
  Globe,
  Mail,
  Workflow,
  Palette,
  CalendarCheck,
  BarChart3,
  Landmark,
  Gift,
  MailPlus,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  activeModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

type NavGroup = {
  label: string;
  items: { id: ModuleId; label: string; icon: React.ElementType; badge?: string; isNew?: boolean; proOnly?: boolean }[];
};

export function Sidebar({ activeModule, onSelectModule, isMobileOpen, onMobileClose }: SidebarProps) {
  const { subscriptionTier } = useApp();
  const isProOrAbove = subscriptionTier === "pro" || subscriptionTier === "business" || subscriptionTier === "enterprise";

  const navGroups: NavGroup[] = [
    {
      label: "Beranda",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: "Penjualan",
      items: [
        { id: "crm", label: "CRM & Pipeline", icon: Users, badge: "3" },
        { id: "quotation", label: "Quotation", icon: FileSpreadsheet },
        { id: "approval", label: "Portal Klien", icon: CheckCircle2, proOnly: true },
        { id: "scheduling", label: "Jadwal Konsultasi", icon: CalendarCheck, isNew: true },
      ],
    },
    {
      label: "Proyek",
      items: [
        { id: "project", label: "Manajemen Tugas", icon: CheckSquare },
        { id: "rundown", label: "Rundown Acara", icon: Clock },
        { id: "staff", label: "Kru & Staf", icon: UserCheck },
        { id: "designstudio", label: "Design Studio", icon: Palette, isNew: true },
      ],
    },
    {
      label: "Acara",
      items: [
        { id: "guests", label: "Tamu & RSVP", icon: UserPlus, badge: "6" },
        { id: "invitations", label: "Undangan Digital", icon: Mail, isNew: true },
        { id: "website", label: "Website Nikah", icon: Globe, isNew: true },
      ],
    },
    {
      label: "Keuangan",
      items: [
        { id: "budget", label: "Anggaran & Margin", icon: Calculator },
        { id: "accounting", label: "Akuntansi & Pajak", icon: Landmark, isNew: true },
        { id: "giftregistry", label: "Gift Registry", icon: Gift, isNew: true },
      ],
    },
    {
      label: "Analitik",
      items: [
        { id: "analytics", label: "Laporan & Analitik", icon: BarChart3, isNew: true },
      ],
    },
    {
      label: "Vendor",
      items: [
        { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
        { id: "inventory", label: "Inventaris Aset", icon: Package, badge: "!" },
      ],
    },
    {
      label: "Komunikasi",
      items: [
        { id: "chat", label: "Pesan & Chat", icon: MessageSquare },
        { id: "wanative", label: "WhatsApp", icon: Smartphone },
        { id: "email", label: "Email Marketing", icon: MailPlus, isNew: true },
        { id: "videocall", label: "Video Call", icon: Video, isNew: true },
      ],
    },
    {
      label: "Otomatisasi",
      items: [
        { id: "automation", label: "Workflow Rules", icon: Workflow, isNew: true },
      ],
    },
    {
      label: "Lainnya",
      items: [
        { id: "files", label: "Dokumen", icon: FolderOpen },
        { id: "ai", label: "AI Copilot", icon: Sparkles, isNew: true },
      ],
    },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-card border-r border-border/60 flex-col flex-shrink-0 select-none">
        {renderSidebarContent()}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border/60 z-50 flex flex-col lg:hidden"
            >
              {renderSidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );

  function renderSidebarContent() {
    return (
      <>
        {/* Brand Header */}
        <div className="p-4 border-b border-border/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center font-bold text-white shadow-md shadow-brand-500/30 flex-shrink-0">
            OS
          </div>
          <div className="min-w-0">
            <div className="font-display font-bold text-base tracking-tight text-foreground flex items-center gap-1.5">
              EventOS.id
            </div>
            <div className="text-xs text-muted-foreground truncate">Vendor Event OS</div>
          </div>
          {onMobileClose && (
            <button onClick={onMobileClose} className="ml-auto lg:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter((item) => !item.proOnly || isProOrAbove);
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label} className="mb-3">
                <div className="px-3 mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                  {group.label}
                </div>
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectModule(item.id);
                        onMobileClose?.();
                      }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                        isActive
                          ? "bg-brand-500/12 text-brand-600 dark:text-brand-400 font-semibold"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      )}
                    >
                      <Icon className={cn(
                        "w-4 h-4 flex-shrink-0",
                        isActive ? "text-brand-500 dark:text-brand-400" : "text-muted-foreground/70"
                      )} />
                      <span className="truncate flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className={cn(
                          "text-xs px-1.5 py-0.5 rounded font-bold flex-shrink-0",
                          item.isNew
                            ? "bg-brand-500/15 text-brand-600 dark:text-brand-400"
                            : item.badge === "!"
                            ? "bg-red-500/15 text-red-600 dark:text-red-400"
                            : item.badge === "OK"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Tenant Footer */}
        <div className="p-4 border-t border-border/60 bg-muted/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-foreground/80">
              Plan: <span className={cn(
                "font-bold",
                subscriptionTier === "basic" ? "text-amber-500" : subscriptionTier === "pro" ? "text-brand-500" : "text-emerald-500"
              )}>
                {(subscriptionTier || "pro")?.toUpperCase()}
              </span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground truncate">EventOS Wedding Organizer</span>
            <a href="/storefront" target="_blank" className="text-xs text-brand-500 dark:text-brand-400 hover:underline font-medium flex-shrink-0">
              Store ↗
            </a>
          </div>
        </div>
      </>
    );
  }
}
