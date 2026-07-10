"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import {
  AlertTriangle, Search, Package, CheckCircle2, XCircle,
  AlertOctagon, Calendar, QrCode, Camera, Shield
} from "lucide-react";
import { motion } from "framer-motion";
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel,
  flexRender, SortingState, ColumnDef
} from "@tanstack/react-table";
import { InventoryItem } from "@/types";

export function InventoryView() {
  const { inventory, showToast, resolveConflict } = useApp();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [scanning, setScanning] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const columns = useMemo<ColumnDef<InventoryItem>[]>(
    () => [
      { accessorKey: "name", header: "Nama Aset", cell: ({ row }) => <span className="font-bold text-foreground">{row.original.name}</span> },
      { accessorKey: "category", header: "Kategori", cell: ({ row }) => <Badge variant="info" className="text-xs">{row.original.category}</Badge> },
      { accessorKey: "totalStock", header: "Total Stok", cell: ({ row }) => <span className="font-semibold">{row.original.totalStock}</span> },
      { accessorKey: "allocatedQty", header: "Dialokasikan", cell: ({ row }) => (
        <span className={row.original.allocatedQty > row.original.totalStock ? "text-red-400 font-bold" : "font-semibold"}>
          {row.original.allocatedQty}
        </span>
      )},
      { accessorKey: "bookedForDate", header: "Tanggal", cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.bookedForDate)}</span> },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => row.original.hasConflict
          ? <Badge variant="destructive" className="text-xs gap-1"><AlertOctagon className="w-3 h-3" /> Conflict</Badge>
          : <Badge variant="success" className="text-xs gap-1"><CheckCircle2 className="w-3 h-3" /> Aman</Badge>,
      },
    ],
    []
  );

  const table = useReactTable({
    data: inventory,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const conflictCount = inventory.filter((i) => i.hasConflict).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-400" />
            Asset Conflict Detection
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Peringatan bentrok jadwal peminjaman aset sebelum hari H.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Cari aset..." className="pl-9 bg-muted border-border/60" />
        </div>
      </div>

      {/* Alert Banner */}
      {conflictCount > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3">
          <AlertOctagon className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <div className="font-bold text-red-400 text-sm">{conflictCount} Bentrok Inventaris Terdeteksi!</div>
            <div className="text-xs text-red-300/80 mt-0.5">Segera lakukan realokasi aset untuk menghindari kekurangan saat H-1 loading.</div>
          </div>
          <Button variant="outline" size="sm" className="ml-auto text-red-400 border-red-500/30 hover:bg-red-500/10 flex-shrink-0" onClick={() => {
            const conflicted = inventory.find((i) => i.hasConflict);
            if (conflicted) resolveConflict(conflicted.id);
          }}>
            Resolve
          </Button>
        </motion.div>
      )}

      {/* Conflict Detail Cards */}
      {inventory.filter((i) => i.hasConflict).map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl border border-red-500/30 bg-red-500/5 p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                {item.name}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Stok: <strong className="text-foreground">{item.totalStock}</strong> unit |
                Dialokasikan: <strong className="text-red-400">{item.allocatedQty}</strong> unit |
                Tanggal: <strong>{formatDate(item.bookedForDate)}</strong>
              </div>
              {item.conflictingProject && (
                <div className="text-xs text-red-300 mt-1">
                  Konflik: {item.conflictingProject}
                </div>
              )}
            </div>
            <Badge variant="destructive" className="flex-shrink-0">KEKURANGAN {item.allocatedQty - item.totalStock} UNIT</Badge>
          </div>
        </motion.div>
      ))}

      {/* Table */}
      <Card className="glass-card border-border/60">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-border/60 text-xs font-semibold uppercase text-muted-foreground bg-muted/30">
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="p-4 first:pl-6 last:pr-6 cursor-pointer hover:text-foreground" onClick={header.column.getToggleSortingHandler()}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-border/40 text-sm">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4 first:pl-6 last:pr-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* IoT QR Asset Tracking */}
      <Card className="glass-card border-border/60 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
          <CardHeader className="pb-4 border-b border-border/60">
            <CardTitle className="text-base font-bold text-foreground font-display flex items-center gap-2">
              <QrCode className="w-4 h-4 text-indigo-400" />
              IoT QR Asset Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Scan barcode aset dari gudang hingga venue. AI Vision deteksi kerusakan & klaim deposit otomatis. Cukup scan via HP, semua data tercatat real-time.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 flex-1"
                    disabled={scanning}
                    onClick={() => {
                      setScanning(true);
                      setTimeout(() => {
                        showToast("QR Code berhasil di-scan! Aset: Lampu Par LED 54W — Kondisi: Baik 100%.");
                        setScanning(false);
                      }, 2000);
                    }}
                  >
                    <Camera className="w-4 h-4 text-indigo-400" />
                    {scanning ? "Scanning..." : "Scan Barcode"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1.5 flex-1"
                    disabled={claiming}
                    onClick={() => {
                      setClaiming(true);
                      setTimeout(() => {
                        showToast("AI mendeteksi lensa retak 85%! Deposit Rp 2.5 Juta dipotong otomatis.");
                        setClaiming(false);
                      }, 2000);
                    }}
                  >
                    <Shield className="w-4 h-4" />
                    {claiming ? "Memproses..." : "Simulasi Klaim"}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-2">
                  <QrCode className="w-8 h-8 text-indigo-400" />
                </div>
                <div className="text-sm font-bold text-foreground">Pantau Aset Real-Time</div>
                <div className="text-xs text-muted-foreground">Scan dari gudang → venue → kembali</div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
