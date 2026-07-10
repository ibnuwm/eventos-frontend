"use client";

import React, { useState, useRef, useEffect } from "react";
import { ModuleId } from "@/types";
import { Button } from "@/components/ui/button";
import { useApp, UserRole } from "@/lib/context";
import { Bell, Zap, RefreshCw, PanelRight, Search, ChevronDown, Building2, Briefcase, User } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { CommandPalette } from "@/components/shared/command-palette";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TopbarProps {
  activeModule: ModuleId;
  onNavigate: (module: ModuleId) => void;
  onToggleMobileSidebar?: () => void;
}

export function Topbar({ activeModule, onNavigate, onToggleMobileSidebar }: TopbarProps) {
  const { showToast, refreshData, projects, inventory, userRole, setUserRole } = useApp();
  const [syncLoading, setSyncLoading] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);

  const roleConfig: Record<UserRole, { label: string; icon: React.ElementType; desc: string }> = {
    wo: { label: "Event Organizer", icon: Briefcase, desc: "Full akses semua modul" },
    vendor: { label: "Vendor Mitra", icon: Building2, desc: "Task, chat, & inventaris" },
    client: { label: "Klien", icon: User, desc: "Portal approval & rundown" },
  };

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const RoleIcon = roleConfig[userRole].icon;

  const titles: Record<ModuleId, { title: string; subtitle: string }> = {
    dashboard: { title: "Dashboard", subtitle: "Ringkasan operasional & indikator finansial real-time" },
    monopoly: { title: "Stage 2 Category Monopoly", subtitle: "Fintech PayLater, IoT asset tracking, show-caller console" },
    roadmap: { title: "Category King Roadmap", subtitle: "Analisis kompetitif & 6 fitur market leader" },
    improvements: { title: "8 Improvements Hub", subtitle: "Keunggulan kompetitif AI, WhatsApp, prediksi risiko" },
    wanative: { title: "WhatsApp-Native Workflow", subtitle: "Simulasi interaksi tombol WA tanpa instalasi aplikasi" },
    crm: { title: "CRM & Pipeline", subtitle: "Otomatisasi follow-up WA dan tracking closing deal" },
    project: { title: "Task Management", subtitle: "Sub-checklist divisi, T-minus timeline, bobot penyelesaian" },
    quotation: { title: "Quotation Builder", subtitle: "Paket layanan interaktif dengan kalkulasi langsung" },
    budget: { title: "Budget & Margin Engine", subtitle: "Kontrol HPP, biaya operasional, batas laba bersih" },
    rundown: { title: "Rundown Builder", subtitle: "Kronologi kegiatan menit per menit - auto time shift" },
    chat: { title: "Chat Hub", subtitle: "Ruang obrolan berbasis proyek per divisi" },
    files: { title: "File Repository", subtitle: "Kontrak, CAD layout, invoice, moodboard" },
    approval: { title: "Client Portal", subtitle: "Portal 1-klik untuk approval layout, rundown, penawaran" },
    ai: { title: "AI Assistant", subtitle: "Asisten cerdas rundown, analisa vendor, quotation" },
    marketplace: { title: "Marketplace", subtitle: "Pencarian mitra terverifikasi dengan SLA real-time" },
    inventory: { title: "Asset Conflict Engine", subtitle: "Peringatan bentrok jadwal peminjaman aset" },
    staff: { title: "Staff Rostering", subtitle: "Jadwal kru lapangan, check-in, rekap jam kerja" },
    guests: { title: "Tamu & RSVP", subtitle: "Manajemen daftar tamu, RSVP, QR check-in, & broadcast WhatsApp" },
    website: { title: "Website Pernikahan", subtitle: "Buat website undangan online dengan template premium" },
    invitations: { title: "Undangan Digital", subtitle: "Buat & kirim undangan digital via WhatsApp" },
    automation: { title: "Workflow Automation", subtitle: "Otomatisasi tugas berulang dengan trigger-action rules" },
    designstudio: { title: "Design Studio", subtitle: "Moodboard, color palette, & style guide untuk acara" },
    scheduling: { title: "Jadwal Konsultasi", subtitle: "Atur slot booking meeting dengan vendor & klien" },
    analytics: { title: "Laporan & Analitik", subtitle: "Revenue forecast, lead funnel, performa vendor" },
    accounting: { title: "Akuntansi & Pajak", subtitle: "Laba rugi, tracking biaya, PPN & PPh" },
    giftregistry: { title: "Gift Registry", subtitle: "Cash registry dengan QRIS & transfer bank" },
    email: { title: "Email Marketing", subtitle: "Template email & broadcast untuk klien" },
    videocall: { title: "Video Call", subtitle: "Jadwalkan & kelola meeting online" },
  };

  const current = titles[activeModule] || titles.dashboard;

  return (
    <header className="h-16 border-b border-border/60 bg-card/80 backdrop-blur-xl px-4 lg:px-6 flex items-center justify-between flex-shrink-0 z-20">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl hover:bg-muted text-muted-foreground"
          aria-label="Toggle sidebar"
        >
          <PanelRight className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-bold text-foreground tracking-tight font-display">{current.title}</h1>
          <p className="text-xs text-muted-foreground truncate max-w-xl hidden sm:block">{current.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Command Palette */}
        <CommandPalette onNavigate={onNavigate} />

        {/* Live Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>WA Connected</span>
        </motion.div>

        <ThemeToggle />

        {/* Sync DB */}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 hidden sm:flex"
          disabled={syncLoading}
          onClick={async () => {
            setSyncLoading(true);
            showToast("Sinkronisasi data dari database...");
            await refreshData();
            showToast("Data berhasil disinkronisasi dari server");
            setSyncLoading(false);
          }}
        >
          {syncLoading ? (
            <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          ) : (
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span>{syncLoading ? "Sync..." : "Sync"}</span>
        </Button>

        {/* Notifications */}
        <button
          onClick={() => {
            const conflictCount = inventory.filter((i) => i.hasConflict).length;
            const pendingProjects = projects.filter((p) => p.progressPercentage < 100).length;
            const notifs: string[] = [];
            if (conflictCount > 0) notifs.push(`${conflictCount} bentrok inventaris`);
            if (pendingProjects > 0) notifs.push(`${pendingProjects} proyek berjalan`);
            showToast(`${notifs.length > 0 ? notifs.join(" & ") : "Tidak ada"} pemberitahuan baru`);
          }}
          className="relative p-2 rounded-xl border border-border/60 bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ring-focus"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {inventory.some((i) => i.hasConflict) && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background" />
          )}
        </button>

        {/* User Profile with Role Switcher */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setRoleOpen(!roleOpen)}
            className="flex items-center gap-2 pl-2 border-l border-border/60 hover:bg-muted/30 pr-2 py-1 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center font-bold text-xs text-white shadow-md flex-shrink-0">
              AR
            </div>
            <div className="hidden md:block text-left leading-tight min-w-0">
              <div className="text-xs font-bold text-foreground">Anisa Rahma</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <RoleIcon className="w-3 h-3" />
                {roleConfig[userRole].label}
              </div>
            </div>
            <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform hidden md:block", roleOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {roleOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 top-full mt-2 w-56 bg-card border border-border/60 rounded-xl shadow-2xl shadow-black/20 z-50 overflow-hidden"
              >
                <div className="p-1 space-y-0.5">
                  {(Object.entries(roleConfig) as [UserRole, typeof roleConfig.wo][]).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    const isActive = userRole === key;
                    return (
                      <button
                        key={key}
                        onClick={() => { setUserRole(key); setRoleOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left",
                          isActive
                            ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        <Icon className={cn("w-4 h-4", isActive ? "text-brand-500" : "text-muted-foreground/70")} />
                        <div className="min-w-0">
                          <div className="font-medium">{cfg.label}</div>
                          <div className="text-xs text-muted-foreground/70">{cfg.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
