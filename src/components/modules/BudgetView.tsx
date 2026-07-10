"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";
import {
  Calculator, AlertTriangle, CheckCircle2, TrendingUp, DollarSign,
  PieChart, Gauge, ArrowUpRight, ArrowDownRight, Zap, Banknote, Smartphone, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell,
  RadialBarChart, RadialBar, Text
} from "recharts";

export function BudgetView() {
  const { showToast } = useApp();
  const [clientPay, setClientPay] = useState<number>(180000000);
  const [vendorCost, setVendorCost] = useState<number>(120000000);
  const [opsCost, setOpsCost] = useState<number>(18000000);
  const [payLaterActive, setPayLaterActive] = useState(false);

  const netProfit = clientPay - vendorCost - opsCost;
  const marginPercentage = clientPay > 0 ? ((netProfit / clientPay) * 100).toFixed(1) : "0";
  const numMargin = parseFloat(marginPercentage);

  const costBreakdown = [
    { name: "Vendor Cost", value: vendorCost, color: "#6366f1" },
    { name: "Operational", value: opsCost, color: "#f59e0b" },
    { name: "Net Profit", value: Math.max(netProfit, 0), color: "#10b981" },
  ];

  const gaugeData = [
    { name: "Margin", value: Math.min(numMargin, 40), fill: numMargin >= 20 ? "#10b981" : numMargin >= 10 ? "#f59e0b" : "#ef4444" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
          <Calculator className="w-5 h-5 text-brand-400" />
          Real-Time Budget & Profit Engine
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Hitung selisih pendapatan kontrak dengan HPP vendor mitra secara real-time.
        </p>
      </div>

      {/* AI Insight */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent border border-emerald-500/20 p-3 flex items-center gap-2.5">
        <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span className="text-xs text-muted-foreground flex-1">
          <strong className="text-foreground">AI Insight:</strong> Dengan margin {marginPercentage}%, disarankan negosiasi ulang biaya dekorasi (30% dari HPP) untuk mencapai margin ideal 25%.
        </span>
        <div className="flex items-center gap-2 text-xs text-emerald-400 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Terima Pembayaran: QRIS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulation Inputs */}
        <Card className="glass-card border-border/60">
          <CardHeader className="pb-4 border-b border-border/60">
            <CardTitle className="text-base font-bold text-foreground font-display flex items-center gap-2">
              <Calculator className="w-4 h-4 text-brand-400" />
              Simulasi Arus Kas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1.5">
                Pembayaran Klien (Contract Value)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold text-sm">Rp</span>
                <Input
                  type="number"
                  value={clientPay}
                  onChange={(e) => setClientPay(Number(e.target.value))}
                  className="pl-9 text-base font-bold text-emerald-400 bg-muted border-border/60"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1.5">
                Tagihan Vendor (HPP)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold text-sm">Rp</span>
                <Input
                  type="number"
                  value={vendorCost}
                  onChange={(e) => setVendorCost(Number(e.target.value))}
                  className="pl-9 text-base font-bold text-amber-400 bg-muted border-border/60"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1.5">
                Biaya Operasional
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold text-sm">Rp</span>
                <Input
                  type="number"
                  value={opsCost}
                  onChange={(e) => setOpsCost(Number(e.target.value))}
                  className="pl-9 text-base font-bold text-blue-400 bg-muted border-border/60"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Results */}
        <div className="space-y-6">
          <Card className="glass-card border-border/60">
            <CardContent className="p-6 text-center">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Laba Bersih Proyek
              </div>
              <motion.div
                key={netProfit}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-4xl sm:text-5xl font-extrabold text-emerald-400 my-2 tracking-tight font-display"
              >
                {formatRupiah(netProfit)}
              </motion.div>

              <div className="flex items-center justify-center gap-2 my-4">
                <span className="text-sm font-semibold text-muted-foreground">Margin:</span>
                <Badge
                  variant={numMargin >= 20 ? "success" : numMargin >= 12 ? "warning" : "destructive"}
                  className="text-base px-4 py-1 font-extrabold"
                >
                  {marginPercentage}%
                </Badge>
              </div>

              {/* Mini Gauge */}
              <div className="h-[100px] mx-auto max-w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" barSize={12} data={gaugeData} startAngle={180} endAngle={0}>
                    <RadialBar
                      background={{ fill: "hsl(var(--muted))" }}
                      dataKey="value"
                      cornerRadius={6}
                      animationDuration={800}
                    />
                    <Text />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card className="glass-card border-border/60">
            <CardContent className="p-4">
              {numMargin >= 20 ? (
                <div className="flex items-start gap-2.5 text-emerald-300 text-xs leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground font-bold block">Finansial Sangat Sehat (≥ 20%)</strong>
                    Margin proyek melebihi standar minimum. Sistem mengizinkan persetujuan.
                  </div>
                </div>
              ) : numMargin >= 10 ? (
                <div className="flex items-start gap-2.5 text-amber-300 text-xs leading-relaxed">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground font-bold block">Margin Sedang (10-19%)</strong>
                    Disarankan negosiasi ulang rate B2B vendor.
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5 text-red-300 text-xs leading-relaxed">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground font-bold block">KRITIS: Margin di Bawah 10%!</strong>
                    Proyek berisiko rugi apabila ada pembengkakan biaya.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Kerja PayLater */}
      <Card className="glass-card border-border/60 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
          <CardHeader className="pb-4 border-b border-border/60">
            <CardTitle className="text-base font-bold text-foreground font-display flex items-center gap-2">
              <Banknote className="w-4 h-4 text-emerald-400" />
              Modal Kerja Instan — PayLater
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Butuh dana talangan untuk bayar DP vendor? Ajukan <strong className="text-foreground">Working Capital Financing</strong> dengan jaminan escrow klien. Cair 15 menit, bunga 0% untuk 30 hari pertama.
                </p>
                <div className="p-4 rounded-xl bg-muted/50 border border-border/60 space-y-2">
                  <div className="flex justify-between font-semibold text-sm">
                    <span className="text-muted-foreground">Nilai Kontrak Escrow:</span>
                    <span className="text-foreground">{formatRupiah(clientPay)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-sm">
                    <span className="text-muted-foreground">Pencairan Maksimal:</span>
                    <span className="text-emerald-400">{formatRupiah(Math.round(clientPay * 0.6))}</span>
                  </div>
                  <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground">
                    Status: {payLaterActive ? (
                      <span className="text-emerald-400 font-bold">Rp 25 Juta Telah Dicairikan ke Rekening!</span>
                    ) : "Menunggu Pengajuan"}
                  </div>
                </div>
                <Button
                  onClick={() => { setPayLaterActive(true); showToast("PayLater Rp 25 Juta berhasil dicairkan ke rekening!"); }}
                  disabled={payLaterActive}
                  className="gap-2 font-semibold w-full"
                >
                  <Zap className="w-4 h-4" />
                  {payLaterActive ? "Sudah Dicairkan" : "Ajukan Modal Kerja Sekarang"}
                </Button>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                  <Banknote className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="text-lg font-extrabold text-emerald-400 font-display">
                  {payLaterActive ? "Rp 25.000.000" : "Cair 15 Menit"}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {payLaterActive ? "Sudah di rekening Anda" : "Tanpa agunan, bunga 0% 30 hari"}
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Cost Breakdown Chart */}
      <Card className="glass-card border-border/60">
        <CardHeader className="pb-4 border-b border-border/60">
          <CardTitle className="text-base font-bold text-foreground font-display">
            <PieChart className="w-4 h-4 inline mr-2 text-brand-400" />
            Rincian Biaya
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={800}
                  >
                    {costBreakdown.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {costBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                  </div>
                  <span className="font-bold text-sm">{formatRupiah(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
