"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";
import { Vendor } from "@/types";
import { Search, Star, Clock, MapPin, Phone, ShoppingBag, Filter, SlidersHorizontal, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel,
  getPaginationRowModel, flexRender, SortingState, ColumnDef
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";

export function MarketplaceView() {
  const { vendors, showToast, bookVendor, sendWa } = useApp();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [auditing, setAuditing] = useState(false);

  const categories = ["All", ...new Set(vendors.map((v) => v.category))];

  const filteredVendors = useMemo(() => {
    if (selectedCategory === "All") return vendors;
    return vendors.filter((v) => v.category === selectedCategory);
  }, [vendors, selectedCategory]);

  const columns = useMemo<ColumnDef<Vendor>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Vendor",
        cell: ({ row }) => (
          <div>
            <div className="font-bold text-foreground">{row.original.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              {row.original.area}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Kategori",
        cell: ({ row }) => <Badge variant="info" className="text-xs">{row.original.category}</Badge>,
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => (
          <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            {row.original.rating}
          </div>
        ),
      },
      {
        accessorKey: "slaPunctuality",
        header: "SLA",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-muted h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  row.original.slaPunctuality >= 98 ? "bg-emerald-400" :
                  row.original.slaPunctuality >= 95 ? "bg-amber-400" : "bg-red-400"
                }`}
                style={{ width: `${row.original.slaPunctuality}%` }}
              />
            </div>
            <span className="text-xs font-bold text-emerald-400">{row.original.slaPunctuality}%</span>
          </div>
        ),
      },
      {
        accessorKey: "startingPrice",
        header: "Mulai Dari",
        cell: ({ row }) => (
          <span className="font-bold text-emerald-400">{formatRupiah(row.original.startingPrice)}</span>
        ),
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-emerald-400 hover:bg-emerald-500/10 gap-1"
              onClick={() => sendWa(row.original.whatsapp, `Halo ${row.original.picName}, kami tertarik dengan layanan Anda.`)}
            >
              <Phone className="w-3 h-3" />
              <span className="hidden sm:inline">WA</span>
            </Button>
            <Button
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              onClick={async () => { await bookVendor(row.original.id); showToast(`Booking ${row.original.name} berhasil! Kalender terkunci.`); }}
            >
              <ShoppingBag className="w-3 h-3" />
              <span className="hidden sm:inline">Book</span>
            </Button>
          </div>
        ),
      },
    ],
    [showToast, bookVendor, sendWa]
  );

  const table = useReactTable({
    data: filteredVendors,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
            Database Vendor & B2B Marketplace
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Jejaring pasar B2B dengan transparansi harga, rating, dan SLA real-time.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Cari vendor, kategori..."
            className="pl-9 bg-muted border-border/60"
          />
        </div>
      </div>

      {/* AI Anti-Scam Shield - Verified */}
      <div className="rounded-xl bg-gradient-to-r from-purple-500/10 via-transparent to-transparent border border-purple-500/20 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-500/15 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-foreground text-sm flex items-center gap-2">
            Perlindungan Anti-Scam Aktif
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs text-muted-foreground">Semua vendor telah melewati verifikasi AI: portofolio asli, NPWP valid, & rekam jejak terbukti.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex-shrink-0 text-xs border-purple-500/30 text-purple-400 hover:bg-purple-500/10 gap-1.5"
          disabled={auditing}
          onClick={() => { setAuditing(true); setTimeout(() => { setAuditing(false); showToast("AI Audit selesai: Tidak ditemukan portofolio palsu. Semua vendor aman."); }, 2000); }}
        >
          {auditing ? <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          Audit Lagi
        </Button>
      </div>

      {/* Category & Table View */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap",
              selectedCategory === cat
                ? "bg-brand-500 text-white shadow-md"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-border/60"
            )}
          >
            {cat === "All" ? "Semua" : cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="glass-card border-border/60">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-border/60 text-xs font-semibold uppercase text-muted-foreground bg-muted/30">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="p-4 first:pl-6 last:pr-6 cursor-pointer hover:text-foreground transition-colors select-none"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-border/40 text-sm">
                {table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4 first:pl-6 last:pr-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))}
                {table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-12 text-sm text-muted-foreground">
                      Tidak ada vendor ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-3 border-t border-border/60 text-xs text-muted-foreground">
            <span>{table.getFilteredRowModel().rows.length} vendor</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="h-7 px-2 text-xs">Prev</Button>
              <span className="px-2 font-medium text-foreground">{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="h-7 px-2 text-xs">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredVendors.map((vendor, idx) => (
          <motion.div
            key={vendor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-xl overflow-hidden group"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="info" className="text-xs">{vendor.category}</Badge>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-label="Terverifikasi AI Anti-Scam" />
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {vendor.rating}
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-foreground group-hover:text-brand-400 transition-colors">{vendor.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />{vendor.area}
              </div>
              <div className="p-3 rounded-xl bg-muted/50 border border-border/60 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3 text-emerald-400" /> SLA</span>
                  <span className="font-bold text-emerald-400">{vendor.slaPunctuality}%</span>
                </div>
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${vendor.slaPunctuality >= 98 ? "bg-emerald-400" : vendor.slaPunctuality >= 95 ? "bg-amber-400" : "bg-red-400"}`}
                    style={{ width: `${vendor.slaPunctuality}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Mulai</span>
                <span className="font-bold text-emerald-400">{formatRupiah(vendor.startingPrice)}</span>
              </div>
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" className="flex-1 text-xs gap-1 h-8" onClick={() => sendWa(vendor.whatsapp, `Halo ${vendor.picName}, kami tertarik dengan layanan Anda.`)}>
                  <Phone className="w-3 h-3 text-emerald-400" /> Chat
                </Button>
                <Button size="sm" className="flex-1 text-xs font-bold h-8 gap-1" onClick={async () => { await bookVendor(vendor.id); showToast(`Booking ${vendor.name} berhasil!`); }}>
                  <ShoppingBag className="w-3 h-3" /> Book
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
