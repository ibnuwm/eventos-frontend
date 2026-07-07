"use client";

import React, { useState } from "react";
import { ModuleId } from "@/types";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/context";
import { Bell, Zap, RefreshCw } from "lucide-react";

interface TopbarProps {
  activeModule: ModuleId;
}

export function Topbar({ activeModule }: TopbarProps) {
  const { showToast, refreshData, projects, inventory } = useApp();
  const [syncLoading, setSyncLoading] = useState(false);

  const titles: Record<ModuleId, { title: string; subtitle: string }> = {
    dashboard: { title: "Dashboard Overview", subtitle: "Ringkasan operasional proyek event & indikator finansial real-time" },
    monopoly: { title: "🚀 Stage 2 Category Monopoly (Fintech PayLater, IoT & SMPTE Cues)", subtitle: "Pembiayaan modal kerja tanpa bunga pinjol, IoT QR asset tracking, dan konsol show-caller Reverb" },
    roadmap: { title: "👑 Stage 1 Category King Roadmap (Studi Kompetitif & Inovasi)", subtitle: "Analisis perbandingan terhadap kompetitor global/lokal & rekayasa 6 fitur market leader" },
    improvements: { title: "🌟 8 Improvements Hub (Keunggulan Kompetitif)", subtitle: "Verifikasi implementasi 8 inovasi kunci AI, WhatsApp-Native, & Prediksi Risiko" },
    wanative: { title: "💬 WhatsApp-Native Workflow Simulator", subtitle: "Simulasi interaksi tombol WA tanpa instalasi aplikasi untuk vendor & kru lapangan" },
    crm: { title: "Modul 1: CRM & Pipeline Prospek", subtitle: "Otomatisasi WhatsApp follow-up dan pelacakan probabilitas closing deal" },
    project: { title: "Modul 2 & 7: Event Task Management (ClickUp Style)", subtitle: "Manajemen sub-checklist divisi, T-minus timeline, dan bobot penyelesaian" },
    quotation: { title: "Modul 4: Drag & Drop Quotation Builder", subtitle: "Penyusunan paket layanan interaktif dengan kalkulasi total langsung" },
    budget: { title: "Modul 6: Realtime Budget & Margin Engine", subtitle: "Kontrol Harga Pokok Penjualan (HPP), biaya operasional, dan batas aman laba bersih" },
    rundown: { title: "Modul 8: Drag & Drop Rundown Builder", subtitle: "Pengaturan kronologi kegiatan menit per menit dengan fitur Auto-Time Shifting" },
    chat: { title: "Modul 9: Vendor Chat & Communication Hub", subtitle: "Ruang obrolan berbasis proyek per divisi menggantikan grup WhatsApp" },
    files: { title: "Modul 10: Cloud File & Asset Repository", subtitle: "Penyimpanan terstruktur untuk kontrak, CAD layout, invoice, dan moodboard" },
    approval: { title: "Modul 11: Client Digital Approval Portal", subtitle: "Portal 1-klik bagi klien untuk menyetujui layout 3D, rundown, dan penawaran" },
    ai: { title: "Modul 12: Generative AI Assistant ✨", subtitle: "Asisten cerdas pembuatan rundown, analisa vendor, dan perancangan quotation" },
    marketplace: { title: "Modul 3 & 13: Vendor Database & Marketplace", subtitle: "Pencarian mitra kerja terverifikasi lengkap dengan SLA kedatangan lapangan" },
    inventory: { title: "Modul 14: Asset Conflict Detection Engine", subtitle: "Peringatan bentrok jadwal peminjaman kursi, lampu, dan aset sebelum hari H" },
    staff: { title: "Modul 15: Staff & Crew Rostering Management", subtitle: "Jadwal penugasan kru lapangan, Stage Manager, Usher, dan rekap jam kerja" },
  };

  const current = titles[activeModule] || titles.dashboard;

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0 z-10">
      <div>
        <h1 className="text-base font-bold text-white tracking-tight">{current.title}</h1>
        <p className="text-xs text-slate-400 truncate max-w-xl">{current.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Live Webhook Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>WhatsApp API Connected</span>
        </div>

        {/* Quick Action - Sync DB */}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          disabled={syncLoading}
          onClick={async () => {
            setSyncLoading(true);
            showToast("⚡ Sinkronisasi data dari database...");
            await refreshData();
            showToast("✅ Data berhasil disinkronisasi dari server");
            setSyncLoading(false);
          }}
        >
          {syncLoading ? <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
          <span>{syncLoading ? "Sync..." : "Sync DB"}</span>
        </Button>

        {/* Notifications */}
        <button
          onClick={() => {
            const conflictCount = inventory.filter((i) => i.hasConflict).length;
            const pendingProjects = projects.filter((p) => p.progressPercentage < 100).length;
            const notifs: string[] = [];
            if (conflictCount > 0) notifs.push(`${conflictCount} bentrok inventaris`);
            if (pendingProjects > 0) notifs.push(`${pendingProjects} proyek berjalan`);
            showToast(`🔔 ${notifs.length > 0 ? notifs.join(" & ") : "Tidak ada"} pemberitahuan baru`);
          }}
          className="relative p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {inventory.some((i) => i.hasConflict) && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
            AR
          </div>
          <div className="hidden md:block text-left leading-tight">
            <div className="text-xs font-bold text-white">Anisa Rahma</div>
            <div className="text-[10px] text-slate-400">Lead WO Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
