"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/context";
import { MessageSquare, Smartphone, CheckCircle2, RefreshCw, Zap, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export function WaNativeView() {
  const { showToast } = useApp();
  const [vendorStatus, setVendorStatus] = useState<"pending" | "confirmed" | "loading" | "done">("pending");

  const simulateWaAction = (action: "confirm" | "loading" | "done") => {
    if (action === "confirm") {
      setVendorStatus("confirmed");
      showToast("⚡ Webhook WhatsApp: Vendor Grand Rose Decor menekan tombol [Siap & Hadir] di WA! Status dasbor berubah menjadi CONFIRMED.");
    } else if (action === "loading") {
      setVendorStatus("loading");
      showToast("⚡ Webhook WhatsApp: Vendor tiba di lokasi & klik [Mulai Loading]. GPS tersinkron ke sistem!");
    } else {
      setVendorStatus("done");
      showToast("⚡ Webhook WhatsApp: Vendor mengirim foto bukti selesai instalasi via WA. Checklist otomatis Selesai!");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mb-2">
          Keunggulan Kompetitif #2: Zero App Friction
        </Badge>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          WhatsApp-Native Workflow Simulator
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Vendor eksternal, sopir barang, dan kru lapangan tidak perlu install aplikasi baru. Semua konfirmasi kehadiran dan update progres dilakukan langsung lewat tombol interaktif WhatsApp resmi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Vendor Mobile Phone View (WhatsApp UI) */}
        <div className="max-w-sm mx-auto w-full rounded-[36px] border-[6px] border-slate-800 bg-[#0b141a] p-4 shadow-2xl relative">
          {/* Phone Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800 text-white">
            <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">
              OS
            </div>
            <div>
              <div className="font-bold text-sm flex items-center gap-1">
                EventOS Bot Verified <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
              </div>
              <div className="text-[10px] text-emerald-400">Akun Bisnis Resmi • Online</div>
            </div>
          </div>

          {/* WhatsApp Chat Bubble Stream */}
          <div className="py-4 space-y-3 min-h-[380px] text-xs">
            {/* Outgoing Bot Message */}
            <div className="bg-[#1f2c34] text-slate-100 p-3 rounded-2xl rounded-tl-none border border-slate-800/80 space-y-2">
              <div className="font-bold text-emerald-400 flex items-center justify-between">
                <span>🤖 Penugasan Loading Acara</span>
                <span className="text-[9px] text-slate-400">03.30 WIB</span>
              </div>
              <p className="leading-relaxed">
                Halo <strong>Mba Siska (Grand Rose Decor)</strong>,<br />
                Anda ditugaskan untuk loading dekorasi pelaminan pada:
              </p>
              <div className="bg-[#111b21] p-2 rounded-lg text-[11px] space-y-1 text-slate-300">
                <div>📅 <strong>Sabtu, 14 Agustus 2026</strong></div>
                <div>⏰ <strong>Jam: 04.00 WIB</strong></div>
                <div>📍 <strong>Grand Hotel Ballroom Jakarta</strong></div>
              </div>
              <p className="text-[11px] text-slate-300">
                Mohon konfirmasi kesiapan Anda dengan menekan tombol interaktif di bawah:
              </p>
            </div>

            {/* Interactive WhatsApp Buttons */}
            <div className="space-y-1.5 pt-1">
              <button
                disabled={vendorStatus !== "pending"}
                onClick={() => simulateWaAction("confirm")}
                className={`w-full py-2 px-3 rounded-xl font-bold text-center border transition-all flex items-center justify-center gap-1.5 ${
                  vendorStatus === "pending"
                    ? "bg-[#00a884] text-white hover:bg-[#008f6f] border-[#00a884]"
                    : "bg-slate-800/50 text-slate-500 border-slate-800 cursor-not-allowed"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                [1] Siap & Hadir Tepat Waktu
              </button>

              <button
                disabled={vendorStatus !== "confirmed"}
                onClick={() => simulateWaAction("loading")}
                className={`w-full py-2 px-3 rounded-xl font-bold text-center border transition-all flex items-center justify-center gap-1.5 ${
                  vendorStatus === "confirmed"
                    ? "bg-[#00a884] text-white hover:bg-[#008f6f] border-[#00a884]"
                    : "bg-slate-800/50 text-slate-500 border-slate-800 cursor-not-allowed"
                }`}
              >
                <Zap className="w-4 h-4" />
                [2] Sudah Tiba & Mulai Loading
              </button>

              <button
                disabled={vendorStatus !== "loading"}
                onClick={() => simulateWaAction("done")}
                className={`w-full py-2 px-3 rounded-xl font-bold text-center border transition-all flex items-center justify-center gap-1.5 ${
                  vendorStatus === "loading"
                    ? "bg-[#00a884] text-white hover:bg-[#008f6f] border-[#00a884]"
                    : "bg-slate-800/50 text-slate-500 border-slate-800 cursor-not-allowed"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                [3] Selesai & Kirim Foto Bukti
              </button>
            </div>

            {/* User confirmation reply bubble */}
            {vendorStatus !== "pending" && (
              <div className="bg-[#005c4b] text-white p-2.5 rounded-2xl rounded-tr-none ml-auto max-w-[80%] text-right space-y-1">
                <div>
                  {vendorStatus === "confirmed" && "Siap & Hadir Tepat Waktu ✔✔"}
                  {vendorStatus === "loading" && "Sudah Tiba & Mulai Loading ✔✔"}
                  {vendorStatus === "done" && "Selesai & Kirim Foto Bukti ✔✔"}
                </div>
                <div className="text-[9px] text-emerald-200">Terkirim otomatis via WA Webhook</div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Dashboard Real-time Response Panel */}
        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-900/90">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-base font-bold text-white flex items-center justify-between">
                <span>Sinkronisasi Realtime Dasbor WO</span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Reverb WebSocket Active
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Status Live Tugas Divisi Dekorasi:
                </div>
                
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">Loading Pelaminan Ballroom 15m</div>
                    <div className="text-xs text-slate-400 mt-0.5">Vendor: Grand Rose Decor (Mba Siska)</div>
                  </div>

                  <div>
                    {vendorStatus === "pending" && (
                      <Badge variant="warning" className="px-3 py-1 font-bold animate-pulse">⏳ Menunggu Konfirmasi WA</Badge>
                    )}
                    {vendorStatus === "confirmed" && (
                      <Badge variant="info" className="px-3 py-1 font-bold">✔ Vendor Konfirmasi Hadir</Badge>
                    )}
                    {vendorStatus === "loading" && (
                      <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 font-bold animate-bounce">
                        🚀 Sedang Pengerjaan di Lokasi
                      </Badge>
                    )}
                    {vendorStatus === "done" && (
                      <Badge variant="success" className="px-3 py-1 font-bold">🎉 Instalasi Selesai 100%</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-2 text-xs text-indigo-200">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Mengapa Ini Menjadi Keunggulan Kompetitif?
                </div>
                <p className="leading-relaxed">
                  Sebagian besar SaaS kompetitor gagal di Indonesia karena memaksa vendor tradisional mengunduh aplikasi baru yang memperberat memori ponsel. Dengan pendekatan <strong>WhatsApp-Native Workflow</strong> ini, tingkat kepatuhan absensi vendor meningkat dari rata-rata 45% menjadi <strong>98.5%</strong>.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setVendorStatus("pending")}
                className="w-full gap-1.5 text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Simulasi Webhook
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
