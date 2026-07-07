"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";
import { Calculator, AlertTriangle, CheckCircle2, TrendingUp, DollarSign } from "lucide-react";

export function BudgetView() {
  const { showToast } = useApp();
  const [clientPay, setClientPay] = useState<number>(180000000);
  const [vendorCost, setVendorCost] = useState<number>(120000000);
  const [opsCost, setOpsCost] = useState<number>(18000000);

  const netProfit = clientPay - vendorCost - opsCost;
  const marginPercentage = clientPay > 0 ? ((netProfit / clientPay) * 100).toFixed(1) : "0";
  const numMargin = parseFloat(marginPercentage);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Modul 6: Real-Time Budgeting & Profit Margin Engine
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Hitung selisih pendapatan kontrak dengan Harga Pokok Penjualan (HPP) vendor mitra secara langsung tanpa spreadsheet.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulation Inputs */}
        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader className="pb-4 border-b border-slate-800">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-400" />
              Simulasi Arus Kas & Biaya Proyek
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Total Pembayaran Klien (Contract Value):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-semibold text-sm">Rp</span>
                <Input
                  type="number"
                  value={clientPay}
                  onChange={(e) => setClientPay(Number(e.target.value))}
                  className="pl-9 text-base font-bold text-emerald-400 bg-slate-950"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Total Tagihan Vendor Mitra B2B (HPP Katering, Dekor, Foto):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-semibold text-sm">Rp</span>
                <Input
                  type="number"
                  value={vendorCost}
                  onChange={(e) => setVendorCost(Number(e.target.value))}
                  className="pl-9 text-base font-bold text-amber-400 bg-slate-950"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Tersinkronisasi otomatis dari tagihan yang disetujui di Modul 3 & 13.</p>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Biaya Operasional Internal WO (HT, Transport Kru, Konsumsi H-1):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-semibold text-sm">Rp</span>
                <Input
                  type="number"
                  value={opsCost}
                  onChange={(e) => setOpsCost(Number(e.target.value))}
                  className="pl-9 text-base font-bold text-blue-400 bg-slate-950"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Gauge Card */}
        <Card className="border-slate-800 bg-slate-900/90 flex flex-col justify-center items-center p-6 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            Laba Bersih Proyek (Net Profit)
          </div>
          
          <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 my-2 tracking-tight">
            {formatRupiah(netProfit)}
          </div>

          <div className="flex items-center gap-2 my-4">
            <span className="text-sm font-semibold text-slate-300">Margin Keuntungan Bersih:</span>
            <Badge
              variant={numMargin >= 20 ? "success" : numMargin >= 12 ? "warning" : "destructive"}
              className="text-base px-4 py-1 font-extrabold"
            >
              {marginPercentage}%
            </Badge>
          </div>

          <div className="w-full max-w-md bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2 mt-2">
            {numMargin >= 20 ? (
              <div className="flex items-start gap-2.5 text-emerald-300 text-xs leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-bold block">Status Finansial Sangat Sehat (≥ 20%)</strong>
                  Margin proyek ini melebihi standar minimum target laba bersih perusahaan Anda. Sistem mengizinkan persetujuan anggaran.
                </div>
              </div>
            ) : numMargin >= 10 ? (
              <div className="flex items-start gap-2.5 text-amber-300 text-xs leading-relaxed">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-bold block">Peringatan Margin Sedang (10% - 19%)</strong>
                  Keuntungan di bawah standar ideal 20%. Disarankan melakukan negosiasi ulang rate B2B dengan vendor dekorasi atau katering.
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 text-red-300 text-xs leading-relaxed">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-bold block">KRITIS: Profit Margin Di Bawah 10%!</strong>
                  Proyek ini berisiko rugi apabila terjadi pembengkakan biaya tak terduga (contingency cost) di lapangan saat H-1 loading.
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
