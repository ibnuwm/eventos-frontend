"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/context";
import {
  Crown,
  ShieldCheck,
  Layout,
  WifiOff,
  TrendingUp,
  PackageCheck,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export function MarketLeaderRoadmapView() {
  const { showToast } = useApp();
  const [escrowSimState, setEscrowSimState] = useState<"holding" | "released">("holding");
  const [offlineMode, setOfflineMode] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-amber-900/40 via-purple-900/40 to-slate-900 border border-amber-500/30 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Badge className="mb-2 bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Category King Architecture
          </Badge>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            6 Improvement Strategis Menuju Market Leader Monopoli
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl">
            Lompatan inovasi yang mengubah EventOS.id dari sekadar aplikasi manajemen SaaS menjadi tulang punggung finansial & supply chain industri event se-Indonesia.
          </p>
        </div>
        <Button
          onClick={() => showToast("📈 Laporan studi komparasi kompetitor & rancangan Category King tersedia di dokumen Analisis_Kompetitif_dan_Strategic_Roadmap_Market_Leader.md")}
          className="bg-amber-600 hover:bg-amber-500 text-white font-bold gap-1.5 flex-shrink-0"
        >
          <span>Studi Kompetitor Lengkap</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Improvement #1: Smart Escrow Split Payment */}
        <Card className="border-slate-800 bg-slate-900/90 flex flex-col justify-between shadow-lg">
          <div>
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <Badge variant="warning" className="text-[10px]">Inovasi Finansial #1</Badge>
                <span className="text-xs font-bold text-emerald-400">Midtrans / Xendit Split Engine</span>
              </div>
              <CardTitle className="text-base font-bold text-white mt-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Smart Escrow & Automated Split Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs text-slate-300">
              <p className="leading-relaxed">
                Mengatasi ketakutan vendor eksternal yang sering tertunda pembayarannya oleh WO. Dana HPP dikunci di rekening Escrow platform dan langsung cair saat tugas verifikasi lapangan selesai.
              </p>

              {/* Simulation Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between font-semibold text-white">
                  <span>Pembayaran Termin 2 Klien:</span>
                  <span className="text-emerald-400">{formatRupiah(90000000)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-slate-400">Escrow HPP Vendor (65%):</div>
                    <div className="font-bold text-amber-400 text-sm mt-0.5">{formatRupiah(58500000)}</div>
                    <div className="text-[9px] text-slate-500 mt-1">
                      Status: {escrowSimState === "holding" ? "🔒 Terkunci di Escrow" : "💸 Cair ke Rekening Vendor"}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-slate-400">Dompet Margin WO (35%):</div>
                    <div className="font-bold text-emerald-400 text-sm mt-0.5">{formatRupiah(31500000)}</div>
                    <div className="text-[9px] text-emerald-500 mt-1">✔ Cair ke Dompet Anisa WO</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>

          <div className="p-5 pt-0">
            {escrowSimState === "holding" ? (
              <Button
                size="sm"
                className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold gap-1.5"
                onClick={() => {
                  setEscrowSimState("released");
                  showToast("💸 Vendor Grand Rose Decor klik selesai loading! Dana HPP Rp 58.5 Jt otomatis dicairkan ke rekening BCA vendor.");
                }}
              >
                <Zap className="w-4 h-4" />
                Simulasikan Selesai Loading & Cairkan Escrow
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => setEscrowSimState("holding")}
              >
                Reset Simulasi Escrow
              </Button>
            )}
          </div>
        </Card>

        {/* Improvement #2: Offline-First PWA */}
        <Card className="border-slate-800 bg-slate-900/90 flex flex-col justify-between shadow-lg">
          <div>
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <Badge variant="info" className="text-[10px]">Inovasi Lapangan #2</Badge>
                <span className="text-xs font-bold text-indigo-400">Service Worker + IndexedDB</span>
              </div>
              <CardTitle className="text-base font-bold text-white mt-2 flex items-center gap-2">
                <WifiOff className="w-5 h-5 text-indigo-400" />
                Offline-First Field PWA untuk Kru D-Day
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs text-slate-300">
              <p className="leading-relaxed">
                Saat bertugas di basement ballroom hotel bintang 5 atau resor terpencil yang blank spot sinyal seluler, aplikasi kru lapangan tetap beroperasi 100% tanpa crash.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Status Koneksi Perangkat Kru:</span>
                  <Badge variant={offlineMode ? "destructive" : "success"} className="font-bold">
                    {offlineMode ? "📵 Blank Spot / Offline Mode" : "📶 4G LTE / Wi-Fi Connected"}
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  {offlineMode
                    ? "⚠️ Sinyal terputus di Lobi Basement. Tugas checklist yang dicentang disimpan sementara di memori lokal IndexedDB browser HP."
                    : "✔ Sinyal terhubung! Antrean 4 data checklist lapangan telah berhasil disinkronisasikan ke server Laravel Reverb."}
                </div>
              </div>
            </CardContent>
          </div>

          <div className="p-5 pt-0">
            <Button
              variant={offlineMode ? "success" : "destructive"}
              size="sm"
              className="w-full font-bold gap-1.5"
              onClick={() => {
                setOfflineMode(!offlineMode);
                showToast(offlineMode ? "📶 Sinyal pulih! Background Sync Worker mengirim data ke server." : "📵 Simulasi Blank Spot aktif. Aplikasi masuk ke mode Offline IndexedDB.");
              }}
            >
              <WifiOff className="w-4 h-4" />
              {offlineMode ? "Aktifkan Kembali Sinyal Wi-Fi/4G" : "Simulasikan Blank Spot Sinyal Basement"}
            </Button>
          </div>
        </Card>

        {/* Improvement #3: Interactive Floorplan Studio */}
        <Card className="border-slate-800 bg-slate-900/90 flex flex-col justify-between shadow-lg">
          <div>
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-[10px]">Inovasi Studio #3</Badge>
                <span className="text-xs font-bold text-purple-400">Interactive Web Canvas</span>
              </div>
              <CardTitle className="text-base font-bold text-white mt-2 flex items-center gap-2">
                <Layout className="w-5 h-5 text-purple-400" />
                2D/3D Floorplan & Seating Arrangement Studio
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs text-slate-300">
              <p className="leading-relaxed">
                Menggantikan software desktop berat (AutoCAD). WO dapat menarik meja tamu, panggung VIP, dan jalur evakuasi langsung di browser. Klien menyetujui atau menggeser kursi tamu dari HP.
              </p>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-[11px]">
                💡 Terintegrasi dengan rilis RSVP WhatsApp tamu. Meja yang penuh otomatis berubah warna merah di denah visual ballroom.
              </div>
            </CardContent>
          </div>
          <div className="p-5 pt-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-bold border-purple-500/40 text-purple-300 hover:bg-purple-500/10"
              onClick={() => showToast("📐 Membuka Kanvas Studio Floorplan Ballroom Grand Hotel 15x30 meter...")}
            >
              Buka Interactive Floorplan Studio
            </Button>
          </div>
        </Card>

        {/* Improvement #4: AI Dynamic Surge Pricing */}
        <Card className="border-slate-800 bg-slate-900/90 flex flex-col justify-between shadow-lg">
          <div>
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <Badge variant="warning" className="text-[10px]">Inovasi AI #4</Badge>
                <span className="text-xs font-bold text-amber-400">Revenue Management Engine</span>
              </div>
              <CardTitle className="text-base font-bold text-white mt-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                AI Dynamic Surge Pricing & Weather Guard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs text-slate-300">
              <p className="leading-relaxed">
                AI menganalisis kalender tanggal cantik (misal 08-08-2026) dan merekomendasikan kenaikan harga (*Surge Pricing* 15%) kepada vendor.
              </p>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[11px]">
                🌧️ <strong>Weather Guard AI:</strong> Prediksi hujan lebat BMKG pada event Outdoor Garden otomatis menyarankan add-on Tenda Sarnafil ke penawaran WO.
              </div>
            </CardContent>
          </div>
          <div className="p-5 pt-0">
            <Button
              size="sm"
              className="w-full bg-amber-600 hover:bg-amber-500 font-bold text-xs"
              onClick={() => showToast("📈 AI Surge Pricing aktif! Rekomendasi rate card tanggal 14 Agustus naik 15% karena tingginya volume pemesanan nasional.")}
            >
              Simulasikan AI Revenue Management
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
