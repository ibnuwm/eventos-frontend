"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/context";
import {
  Rocket,
  DollarSign,
  QrCode,
  Radio,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Play,
  Camera,
  AlertTriangle,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export function Stage2MonopolyView() {
  const { showToast } = useApp();
  const [payLaterDisbursed, setPayLaterDisbursed] = useState(false);
  const [cueExecuting, setCueExecuting] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-purple-900/50 via-indigo-900/50 to-slate-900 border border-purple-500/30 p-6">
        <Badge className="mb-2 bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold uppercase tracking-wider">
          Stage 2 Category Monopoly
        </Badge>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          5 Rekayasa Inovasi Monopoli Pasar (Fintech, IoT, & SMPTE Cue Sync)
        </h2>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl">
          Melampaui standar batas SaaS internasional dengan menyatukan pembiayaan modal kerja vendor tanpa bunga pinjol, pelacakan aset perangkat keras IoT QR, dan konsol show-caller broadcast live.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakthrough #1: Embedded Working Capital PayLater */}
        <Card className="border-slate-800 bg-slate-900/90 flex flex-col justify-between shadow-lg">
          <div>
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <Badge variant="success" className="text-[10px]">Embedded Fintech #1</Badge>
                <span className="text-xs font-bold text-emerald-400">EventOS PayLater Engine</span>
              </div>
              <CardTitle className="text-base font-bold text-white mt-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Working Capital Financing (0-Risk Escrow Backed)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs text-slate-300">
              <p className="leading-relaxed">
                Vendor tidak perlu lagi meminjam ke pinjol berbunga tinggi untuk modal beli bahan sebelum hari H. Dana modal kerja cair 15 menit dengan jaminan pemotongan otomatis dari Escrow klien.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Nilai Kontrak HPP Terkunci di Escrow:</span>
                  <span className="text-white">{formatRupiah(40000000)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Pencairan Modal Kerja Awal (PayLater):</span>
                  <span className="text-emerald-400">{formatRupiah(25000000)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  Status: {payLaterDisbursed ? "💸 Rp 25 Jt Telah Dicairkan ke Rekening Vendor!" : "🔒 Menunggu Pengajuan Modal Kerja"}
                </div>
              </div>
            </CardContent>
          </div>
          <div className="p-5 pt-0">
            {payLaterDisbursed ? (
              <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => setPayLaterDisbursed(false)}>
                Reset Simulasi PayLater
              </Button>
            ) : (
              <Button
                size="sm"
                className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold gap-1.5"
                onClick={() => {
                  setPayLaterDisbursed(true);
                  showToast("💸 Pencairan EventOS PayLater Rp 25.000.000 berhasil masuk ke rekening vendor Grand Rose Decor!");
                }}
              >
                <Zap className="w-4 h-4" />
                Simulasikan Tarik Modal Kerja Instan (Rp 25 Jt)
              </Button>
            )}
          </div>
        </Card>

        {/* Breakthrough #2: IoT QR Hardware Tracking */}
        <Card className="border-slate-800 bg-slate-900/90 flex flex-col justify-between shadow-lg">
          <div>
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <Badge variant="info" className="text-[10px]">Hardware IoT #2</Badge>
                <span className="text-xs font-bold text-indigo-400">Barcode & RFID Scanner</span>
              </div>
              <CardTitle className="text-base font-bold text-white mt-2 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-400" />
                IoT QR Asset Tracking & Auto Damage Insurance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs text-slate-300">
              <p className="leading-relaxed">
                Scan barcode saat barang naik truk gudang & saat tiba di hotel. Jika alat rusak usai dismantling jam 3 subuh, AI Computer Vision menilai foto kerusakan & memotong deposit otomatis.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span>Aset: <strong className="text-white">Lampu Par LED 54W (#A4)</strong></span>
                  <Badge variant={qrScanned ? "success" : "secondary"}>
                    {qrScanned ? "✔ Scanned di Loading Dock" : "Dalam Gudang"}
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-400">
                  {qrScanned ? "📷 Deteksi AI: Kondisi Baik 100%. Tidak ada klaim asuransi." : "Siap dipindai kru menggunakan kamera HP PWA."}
                </div>
              </div>
            </CardContent>
          </div>
          <div className="p-5 pt-0 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => {
                setQrScanned(true);
                showToast("📦 Barcode QR-LED-8899 berhasil di-scan di Loading Dock Hotel A!");
              }}
            >
              Scan Barcode Aset
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1 text-xs font-bold"
              onClick={() => showToast("🛡️ AI Computer Vision mendeteksi lensa retak 85%! Dana Rp 2.5 Jt otomatis dipotong dari Security Deposit.")}
            >
              Simulasikan Klaim Kerusakan AI
            </Button>
          </div>
        </Card>

        {/* Breakthrough #3: StageCommand Live Show Controller */}
        <Card className="border-slate-800 bg-slate-900/90 flex flex-col justify-between shadow-lg">
          <div>
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <Badge variant="warning" className="text-[10px]">Broadcast SMPTE #3</Badge>
                <span className="text-xs font-bold text-amber-400">Show-Caller Sync Console</span>
              </div>
              <CardTitle className="text-base font-bold text-white mt-2 flex items-center gap-2">
                <Radio className="w-5 h-5 text-amber-400" />
                StageCommand Live Show-Caller Console
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs text-slate-300">
              <p className="leading-relaxed">
                Show Director menekan tombol GO CUE di tablet utama. Melalui Reverb WebSocket, seluruh HP kru sound, lampu, dan MC bergetar serentak & memunculkan hitung mundur kedip 5 detik.
              </p>
              <div className={`p-3 rounded-xl border text-center font-extrabold ${cueExecuting ? "bg-red-500/20 text-red-300 border-red-500 animate-pulse text-sm" : "bg-slate-950 border-slate-800 text-slate-400"}`}>
                {cueExecuting ? "🔥 STANDBY CUE #14: GRAND ENTRANCE... EXECUTE IN 3... 2... 1... GO!" : "Siap menerima instruksi CUE dari Show Director"}
              </div>
            </CardContent>
          </div>
          <div className="p-5 pt-0">
            <Button
              size="sm"
              className="w-full bg-amber-600 hover:bg-amber-500 font-bold gap-1.5"
              onClick={() => {
                setCueExecuting(true);
                showToast("⚡ REVERB BROADCAST: Seluruh HP kru bergetar haptik serentak menerima instruksi CUE #14!");
                setTimeout(() => setCueExecuting(false), 5000);
              }}
            >
              <Play className="w-4 h-4 fill-white" />
              Tekan Tombol [▶ GO CUE #14: GRAND ENTRANCE]
            </Button>
          </div>
        </Card>

        {/* Breakthrough #4: AI Anti-Scam Portfolio Audit */}
        <Card className="border-slate-800 bg-slate-900/90 flex flex-col justify-between shadow-lg">
          <div>
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-[10px]">Security AI #4</Badge>
                <span className="text-xs font-bold text-purple-400">Reverse Image Audit</span>
              </div>
              <CardTitle className="text-base font-bold text-white mt-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                AI Computer Vision Anti-Scam Shield
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs text-slate-300">
              <p className="leading-relaxed">
                Mencegah vendor fiktif pencuri foto Pinterest. AI mengecek reverse-image search global & memverifikasi keaslian NPWP/KTP sebelum memberi lencana Blue Checkmark.
              </p>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Vendor <strong>Grand Rose Decor</strong>: 100% Foto Asli & NPWP Valid terverifikasi AI.</span>
              </div>
            </CardContent>
          </div>
          <div className="p-5 pt-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-bold border-purple-500/40 text-purple-300 hover:bg-purple-500/10"
              onClick={() => showToast("🛡️ Audit AI selesai: Portofolio vendor aman dari indikasi scam/plagiarisme web.")}
            >
              Jalankan Audit Portofolio AI
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
