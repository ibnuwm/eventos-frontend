"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Package, ShieldAlert, Plus } from "lucide-react";

export function InventoryView() {
  const { inventory, showToast } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Modul 14: Asset & Inventory Conflict Detection Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sistem otomatis mendeteksi bentrok jadwal peminjaman barang (double-booking) antar-proyek sebelum hari H.
          </p>
        </div>
        <Button
          onClick={() => showToast("📦 Katalog barang gudang terbuka. Setiap penambahan item dicek silang dengan kalender booking proyek.")}
          className="gap-1.5 font-semibold"
        >
          <Plus className="w-4 h-4" />
          Tambah Aset Gudang
        </Button>
      </div>

      {/* Red Alert Banner */}
      {inventory.some((i) => i.hasConflict) && (
        <div className="p-5 rounded-2xl bg-red-950/40 border-2 border-red-500/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl shadow-red-950/20 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center flex-shrink-0 text-red-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <Badge variant="destructive" className="mb-1 uppercase font-extrabold tracking-wider">
                Predictive Conflict Alert
              </Badge>
              <h3 className="text-base font-bold text-white">
                Terdeteksi Bentrok Aset pada Tanggal 14 Agustus 2026!
              </h3>
              <p className="text-xs text-red-200 mt-0.5">
                Alokasi pesanan untuk <strong className="text-white underline">Kursi Tiffany Emas Premium</strong> melampaui total stok gudang (550 dipesan vs 500 stok tersedia).
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="font-bold flex-shrink-0"
            onClick={() => showToast("🚨 Mengirim permintaan sewa sub-kontrak ke Vendor Rekanan di Marketplace untuk menutupi defisit 50 kursi.")}
          >
            Sewa Sub-Kontrak Marketplace
          </Button>
        </div>
      )}

      {/* Inventory Table */}
      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader className="pb-3 border-b border-slate-800">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-indigo-400" />
            Daftar Inventaris Aset & Kalender Alokasi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/40">
                  <th className="p-4">Nama Aset / Barang</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Total Stok Gudang</th>
                  <th className="p-4">Dipesan Untuk Tanggal</th>
                  <th className="p-4">Total Di-booking</th>
                  <th className="p-4">Status & Deteksi Bentrok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {inventory.map((item) => {
                  const remaining = item.totalStock - item.allocatedQty;
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{item.name}</div>
                        {item.conflictingProject && (
                          <div className="text-[11px] text-red-400 font-medium mt-0.5">
                            💥 {item.conflictingProject}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{item.category}</Badge>
                      </td>
                      <td className="p-4 font-bold text-slate-200">{item.totalStock} Unit</td>
                      <td className="p-4 text-slate-300 font-medium">{formatDate(item.bookedForDate)}</td>
                      <td className="p-4">
                        <span className={`font-extrabold ${item.hasConflict ? "text-red-400" : "text-emerald-400"}`}>
                          {item.allocatedQty} Unit
                        </span>
                      </td>
                      <td className="p-4">
                        {item.hasConflict ? (
                          <Badge variant="destructive" className="flex items-center gap-1 w-fit font-bold">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Kurang {Math.abs(remaining)} Unit!
                          </Badge>
                        ) : (
                          <Badge variant="success" className="flex items-center gap-1 w-fit font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Aman (Sisa {remaining} Unit)
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
