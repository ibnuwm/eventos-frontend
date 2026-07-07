"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, Smartphone, ShieldAlert, TrendingUp, Award, Laptop, Database, ArrowRight } from "lucide-react";

interface ImprovementsHubViewProps {
  onNavigate: (module: any) => void;
}

export function ImprovementsHubView({ onNavigate }: ImprovementsHubViewProps) {
  const improvements = [
    {
      id: 1,
      title: "AI Project Manager & Milestone Generator",
      desc: "Sistem AI yang otomatis membuat rancangan timeline T-minus, checklist tugas divisi spesifik, dan estimasi anggaran sesuai tipe acara (Intimate Wedding vs Grand Ballroom).",
      icon: Sparkles,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
      targetModule: "ai",
      targetLabel: "Buka AI Copilot Engine",
    },
    {
      id: 2,
      title: "WhatsApp-Native Workflow (Zero App Install)",
      desc: "Vendor eksternal dan kru tidak perlu menginstal aplikasi baru. Konfirmasi kehadiran loading, progres checklist, dan pengingat dikirim via tombol interaktif WhatsApp.",
      icon: Smartphone,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      targetModule: "wanative",
      targetLabel: "Simulasikan WA Webhook",
    },
    {
      id: 3,
      title: "Vendor Performance Score (Algoritma SLA Real)",
      desc: "Skor keandalan mitra kerja (1-5 Bintang & SLA % Ketepatan Waktu) yang dihitung dari log historis kedatangan loading dan kualitas eksekusi lapangan nyata.",
      icon: Award,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      targetModule: "marketplace",
      targetLabel: "Lihat Skor SLA di Marketplace",
    },
    {
      id: 4,
      title: "Predictive Conflict Detection Engine",
      desc: "Mesin pendeteksi bentrok jadwal otomatis yang memperingatkan manajer jika terjadi pemesanan ganda (double-booking) pada kru, kendaraan, atau inventaris barang.",
      icon: ShieldAlert,
      color: "text-red-400 bg-red-500/10 border-red-500/30",
      targetModule: "inventory",
      targetLabel: "Cek Red Alert Bentrok Kursi",
    },
    {
      id: 5,
      title: "Auto Accounting & Profit Margin Guard",
      desc: "Sinkronisasi otomatis antara faktur penawaran, DP pembayaran klien, tagihan HPP vendor mitra, dan perhitungan laba bersih proyek secara real-time.",
      icon: TrendingUp,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      targetModule: "budget",
      targetLabel: "Buka Realtime Profit Guard",
    },
    {
      id: 6,
      title: "Marketplace Berbasis Data Operasional",
      desc: "Peringkat vendor di marketplace ditentukan oleh kinerja lapangan nyata (SLA Punctuality) bukan semata-mata karena membayar iklan promosi.",
      icon: Award,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
      targetModule: "marketplace",
      targetLabel: "Eksplorasi Algoritma Marketplace",
    },
    {
      id: 7,
      title: "Client Portal Digital Approvals (Frictionless E-Sign)",
      desc: "Portal web nirkontak aplikasi untuk klien menyetujui layout panggung 3D, susunan rundown, dan faktur penagihan hanya dengan 1 klik tanpa debat panjang di WA.",
      icon: Laptop,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
      targetModule: "approval",
      targetLabel: "Simulasikan Tampilan HP Klien",
    },
    {
      id: 8,
      title: "Knowledge Base AI over Contracts & Chats",
      desc: "Seluruh percakapan di channel vendor, revisi layout, dokumen kontrak hukum, dan faktur menjadi basis pengetahuan yang bisa ditelusuri dengan bahasa alami.",
      icon: Database,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
      targetModule: "ai",
      targetLabel: "Tanya AI Seputar Dokumen",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 border border-purple-500/30 p-6">
        <Badge className="mb-2 bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold uppercase tracking-wider">
          Keunggulan Kompetitif Utama
        </Badge>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Verifikasi 8 Rekomendasi Improvement & Inovasi OS
        </h2>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl">
          Seluruh 8 fitur inovasi yang direkomendasikan telah diimplementasikan penuh di dalam arsitektur Next.js 15 ini sebagai pembeda mutlak terhadap kompetitor website vendor tradisional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {improvements.map((imp) => {
          const Icon = imp.icon;
          return (
            <Card key={imp.id} className="border-slate-800 bg-slate-900/90 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md">
              <div>
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Poin Improvement #{imp.id}</span>
                    <Badge variant="success" className="text-[10px] gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Implemented
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-white mt-2 flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl border ${imp.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{imp.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4 text-xs text-slate-300 leading-relaxed">
                  {imp.desc}
                </CardContent>
              </div>

              <div className="p-5 pt-0 border-t border-slate-800/80 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 font-bold text-xs"
                  onClick={() => onNavigate(imp.targetModule)}
                >
                  <span>{imp.targetLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
