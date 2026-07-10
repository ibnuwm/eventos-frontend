"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/context";
import {
  Rocket, DollarSign, QrCode, Radio, ShieldCheck,
  CheckCircle2, Zap, Play, Camera, AlertTriangle, Sparkles
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { motion } from "framer-motion";

export function Stage2MonopolyView() {
  const { showToast } = useApp();
  const [payLaterDisbursed, setPayLaterDisbursed] = useState(false);
  const [cueExecuting, setCueExecuting] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [auditing, setAuditing] = useState(false);

  const innovations = [
    {
      id: 1,
      badge: "Embedded Fintech #1",
      badgeColor: "success",
      title: "Working Capital Financing",
      desc: "Dana modal kerja cair 15 menit dengan jaminan pemotongan otomatis dari Escrow klien. Tidak perlu pinjol berbunga tinggi.",
      icon: DollarSign,
      iconColor: "text-emerald-400",
      gradient: "from-emerald-500/10",
      borderColor: "border-emerald-500/20",
      content: (
        <div className="p-4 rounded-xl bg-muted/50 border border-border/60 space-y-2">
          <div className="flex justify-between font-semibold text-sm">
            <span className="text-muted-foreground">Nilai Kontrak Escrow:</span>
            <span className="text-foreground">{formatRupiah(40000000)}</span>
          </div>
          <div className="flex justify-between font-semibold text-sm">
            <span className="text-muted-foreground">Pencairan Modal Kerja:</span>
            <span className="text-emerald-400">{formatRupiah(25000000)}</span>
          </div>
          <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground">
            Status: {payLaterDisbursed ? "Rp 25 Jt Telah Dicairkan!" : "Menunggu Pengajuan"}
          </div>
        </div>
      ),
      action: payLaterDisbursed
        ? { label: "Reset Simulasi", variant: "outline" as const, onClick: () => setPayLaterDisbursed(false) }
        : { label: "Simulasikan Tarik Modal Kerja", variant: "default" as const, icon: Zap, onClick: () => { setPayLaterDisbursed(true); showToast("PayLater Rp 25 Jt berhasil dicairkan!"); } },
    },
    {
      id: 2,
      badge: "Hardware IoT #2",
      badgeColor: "info",
      title: "IoT QR Asset Tracking & Auto Insurance",
      desc: "Scan barcode dari gudang hingga venue. AI Vision deteksi kerusakan & klaim deposit otomatis.",
      icon: QrCode,
      iconColor: "text-indigo-400",
      gradient: "from-indigo-500/10",
      borderColor: "border-indigo-500/20",
      content: (
        <div className="p-4 rounded-xl bg-muted/50 border border-border/60 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Aset: <strong className="text-foreground">Lampu Par LED 54W</strong></span>
            <Badge variant={qrScanned ? "success" : "secondary"} className="text-xs">
              {qrScanned ? "Scanned" : "Dalam Gudang"}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            {qrScanned ? "Kondisi Baik 100%. Tidak ada klaim." : "Siap dipindai kru via HP PWA."}
          </div>
        </div>
      ),
      action: null,
      extraActions: (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => { setQrScanned(true); showToast("Barcode QR berhasil di-scan!"); }}>
            Scan Barcode
          </Button>
          <Button size="sm" variant="destructive" className="flex-1 text-xs font-bold" disabled={claiming} onClick={() => {
            setClaiming(true);
            setTimeout(() => {
              showToast("AI deteksi lensa retak 85%! Deposit Rp 2.5 Jt dipotong.");
              setClaiming(false);
            }, 2000);
          }}>
            {claiming ? "Memproses..." : "Simulasi Klaim"}
          </Button>
        </div>
      ),
    },
    {
      id: 3,
      badge: "Broadcast SMPTE #3",
      badgeColor: "warning",
      title: "StageCommand Show-Caller",
      desc: "Show Director tekan GO CUE. Seluruh HP kru bergetar haptik serentak dengan hitung mundur kedip 5 detik via Reverb WebSocket.",
      icon: Radio,
      iconColor: "text-amber-400",
      gradient: "from-amber-500/10",
      borderColor: "border-amber-500/20",
      content: (
        <div className={`p-4 rounded-xl border text-center font-extrabold transition-all ${
          cueExecuting ? "bg-red-500/10 text-red-300 border-red-500/30 animate-pulse" : "bg-muted/50 border-border/60 text-muted-foreground"
        }`}>
          {cueExecuting ? "CUE #14: GRAND ENTRANCE... 3... 2... 1... GO!" : "Siap menerima instruksi CUE"}
        </div>
      ),
      action: {
        label: cueExecuting ? "CUE BERJALAN..." : "[ GO CUE #14: GRAND ENTRANCE ]",
        variant: "default" as const,
        icon: Play,
        onClick: () => { setCueExecuting(true); showToast("Seluruh HP kru bergetar! CUE #14 dikirim!"); setTimeout(() => setCueExecuting(false), 5000); },
      },
    },
    {
      id: 4,
      badge: "Security AI #4",
      badgeColor: "secondary",
      title: "AI Anti-Scam Portfolio Shield",
      desc: "Cegah vendor fiktif pencuri foto. AI reverse-image search global + verifikasi NPWP/KTP untuk lencana Blue Checkmark.",
      icon: ShieldCheck,
      iconColor: "text-purple-400",
      gradient: "from-purple-500/10",
      borderColor: "border-purple-500/20",
      content: (
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Grand Rose Decor: 100% Foto Asli & NPWP Valid.</span>
        </div>
      ),
      action: {
        label: auditing ? "Auditing..." : "Jalankan Audit Portofolio AI",
        variant: "outline" as const,
        onClick: () => {
          setAuditing(true);
          setTimeout(() => {
            showToast("Audit AI selesai: Portofolio aman dari scam/plagiarisme.");
            setAuditing(false);
          }, 2000);
        },
      },
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/10 via-brand-500/10 to-background border border-purple-500/20 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(270,80%,60%/0.1),transparent_50%)]" />
        <div className="relative z-10">
          <Badge className="mb-2 bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold uppercase">
            <Sparkles className="w-3 h-3 mr-1" /> Stage 2 Category Monopoly
          </Badge>
          <h2 className="text-2xl font-bold text-foreground font-display tracking-tight">
            5 Inovasi Monopoli Pasar
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
            Fintech PayLater, IoT QR asset tracking, SMPTE show-caller, AI anti-scam — melampaui standar SaaS internasional.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {innovations.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className={`glass-card border-border/60 h-full flex flex-col relative overflow-hidden group`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10 flex flex-col h-full">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <Badge variant={item.badgeColor as any} className="text-xs">{item.badge}</Badge>
                    <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <CardTitle className={`text-base font-bold text-foreground mt-2 font-display flex items-center gap-2`}>
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4 text-sm text-muted-foreground flex-1 flex flex-col">
                  <p className="leading-relaxed flex-1">{item.desc}</p>
                  {item.content}
                  {item.action && (
                    <Button
                      size="sm"
                      variant={item.action.variant}
                      className={item.action.variant === "default" ? "w-full font-bold" : "w-full text-xs font-bold"}
                      onClick={item.action.onClick}
                    >
                      {item.action.icon && <item.action.icon className="w-4 h-4 mr-1.5" />}
                      {item.action.label}
                    </Button>
                  )}
                  {item.extraActions}
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
