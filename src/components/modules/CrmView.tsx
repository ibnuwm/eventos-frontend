"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Lead } from "@/types";
import {
  MessageCircle, Phone, Plus, ArrowRight, Search, Filter,
  ChevronDown, MoreHorizontal, Star, AlertCircle, UserCheck, Sparkles, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";

export function CrmView() {
  const { leads, updateLeadStatus, showToast, sendWa, createLead } = useApp();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", whatsapp: "", email: "", eventDate: "", paxCount: 1, budgetEstimation: 0 });

  const handleSendWaFollowUp = async (lead: Lead) => {
    await sendWa(lead.whatsapp, `Halo ${lead.name}, kami ingin follow-up terkait acara Anda.`);
    showToast(`WhatsApp terkirim ke ${lead.name}`);
  };

  const columns = useMemo<ColumnDef<Lead>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama / Prospek",
        cell: ({ row }) => (
          <div>
            <div className="font-bold text-foreground">{row.original.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-400" />
              {row.original.whatsapp}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "paxCount",
        header: "Pax",
        cell: ({ row }) => (
          <Badge variant="outline" className="text-xs font-bold">
            {row.original.paxCount} Pax
          </Badge>
        ),
      },
      {
        accessorKey: "budgetEstimation",
        header: "Estimasi Budget",
        cell: ({ row }) => (
          <span className="font-semibold text-emerald-400">
            {formatRupiah(row.original.budgetEstimation)}
          </span>
        ),
      },
      {
        accessorKey: "eventDate",
        header: "Rencana Acara",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.eventDate ? formatDate(row.original.eventDate) : "-"}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const statusMap: Record<string, { label: string; variant: "info" | "warning" | "success" | "secondary" }> = {
            new: { label: "New Lead", variant: "info" },
            contacted: { label: "Contacted", variant: "secondary" },
            quotation_sent: { label: "Quotation Sent", variant: "warning" },
            negotiation: { label: "Negotiation", variant: "warning" },
            won: { label: "Won!", variant: "success" },
            lost: { label: "Lost", variant: "secondary" },
          };
          const s = statusMap[row.original.status] || { label: row.original.status, variant: "secondary" as const };
          return <Badge variant={s.variant} className="text-xs font-bold">{s.label}</Badge>;
        },
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                onClick={(e) => { e.stopPropagation(); handleSendWaFollowUp(lead); }}
                title="Follow-up WA"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </Button>
              {lead.status !== "won" && lead.status !== "lost" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-brand-400 hover:text-brand-300 hover:bg-brand-500/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    const nextStatus: Record<string, Lead["status"]> = {
                      new: "quotation_sent",
                      contacted: "quotation_sent",
                      quotation_sent: "negotiation",
                      negotiation: "won",
                    };
                    updateLeadStatus(lead.id, nextStatus[lead.status] || "won");
                  }}
                  title="Lanjutkan"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [updateLeadStatus, showToast]
  );

  const table = useReactTable({
    data: leads,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* AI Insight */}
      <div className="rounded-xl bg-gradient-to-r from-purple-500/10 via-transparent to-transparent border border-purple-500/20 p-3 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-foreground">Rekomendasi AI: Follow-up Wajib</div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {leads.filter((l) => l.status === "new").length > 0
              ? `${leads.filter((l) => l.status === "new").length} prospek baru belum di-follow-up. Kirim pesan WA otomatis sekarang?`
              : "Semua prospek sudah ditindaklanjuti. Pertahankan! 🎯"}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1 flex-shrink-0 border-purple-500/30 text-purple-400"
          onClick={async () => {
            const newLeads = leads.filter((l) => l.status === "new");
            for (const l of newLeads) {
              await sendWa(l.whatsapp, `Halo ${l.name}, kami ingin follow-up terkait acara Anda.`);
            }
            showToast(`Follow-up WA otomatis dikirim ke ${newLeads.length} prospek!`);
          }}
        >
          <MessageCircle className="w-3 h-3" />
          Follow-up Semua
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
            CRM & Pipeline
            <Badge variant="info" className="text-xs">WhatsApp Auto</Badge>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Kelola prospek, follow-up otomatis WhatsApp, tracking closing
          </p>
        </div>
        <Button onClick={() => setShowLeadForm(true)} className="gap-2 font-semibold">
          <Plus className="w-4 h-4" />
          Tambah Lead
        </Button>

        {showLeadForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowLeadForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-card border border-border/60 rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground font-display">Tambah Lead Baru</h3>
                  <button onClick={() => setShowLeadForm(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <Input placeholder="Nama Klien" value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} className="text-sm" />
                  <Input placeholder="No. WhatsApp" value={newLead.whatsapp} onChange={(e) => setNewLead({ ...newLead, whatsapp: e.target.value })} className="text-sm" />
                  <Input placeholder="Email" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} className="text-sm" />
                  <Input type="date" placeholder="Tanggal Acara" value={newLead.eventDate} onChange={(e) => setNewLead({ ...newLead, eventDate: e.target.value })} className="text-sm" />
                  <Input type="number" placeholder="Jumlah Pax" value={newLead.paxCount} onChange={(e) => setNewLead({ ...newLead, paxCount: parseInt(e.target.value) || 1 })} className="text-sm" />
                  <Input type="number" placeholder="Estimasi Budget" value={newLead.budgetEstimation} onChange={(e) => setNewLead({ ...newLead, budgetEstimation: parseInt(e.target.value) || 0 })} className="text-sm" />
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setShowLeadForm(false)}>Batal</Button>
                    <Button size="sm" className="flex-1" onClick={async () => {
                      if (!newLead.name.trim() || !newLead.whatsapp.trim()) {
                        showToast("Nama dan WhatsApp harus diisi");
                        return;
                      }
                      await createLead(newLead);
                      setShowLeadForm(false);
                      setNewLead({ name: "", whatsapp: "", email: "", eventDate: "", paxCount: 1, budgetEstimation: 0 });
                      showToast("Lead baru berhasil ditambahkan!");
                    }}>Simpan</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Kanban Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { id: "new" as const, title: "New Lead", color: "border-blue-500/30 bg-blue-500/5", icon: Star },
          { id: "quotation_sent" as const, title: "Quotation Sent", color: "border-amber-500/30 bg-amber-500/5", icon: FileText },
          { id: "negotiation" as const, title: "Negotiation", color: "border-purple-500/30 bg-purple-500/5", icon: AlertCircle },
          { id: "won" as const, title: "Won / Deal", color: "border-emerald-500/30 bg-emerald-500/5", icon: UserCheck },
        ].map((col) => {
          const colLeads = leads.filter((l) => l.status === col.id);
          const Icon = col.icon;
          return (
            <div key={col.id} className={`rounded-xl border ${col.color} p-3`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <Icon className="w-4 h-4" />
                  {col.title}
                </span>
                <Badge variant="secondary" className="px-2 font-bold">{colLeads.length}</Badge>
              </div>
              <div className="text-2xl font-extrabold text-foreground font-display">
                {colLeads.length > 0
                  ? formatRupiah(colLeads.reduce((acc, l) => acc + l.budgetEstimation, 0))
                  : "Rp 0"}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Total estimasi nilai</div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <Card className="glass-card border-border/60">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-bold text-foreground font-display">
              Semua Prospek
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Cari nama, status..."
                className="pl-9 bg-muted border-border/60 text-sm"
              />
            </div>
          </div>
        </CardHeader>
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
                          {header.column.getIsSorted() && (
                            <ChevronDown className={cn("w-3 h-3", header.column.getIsSorted() === "asc" && "rotate-180")} />
                          )}
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
                    className="hover:bg-muted/30 transition-colors group"
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
                      Tidak ada lead ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-border/60 text-xs text-muted-foreground">
            <span>
              {table.getFilteredRowModel().rows.length} total lead
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-7 px-2 text-xs"
              >
                Prev
              </Button>
              <span className="px-2 font-medium text-foreground">
                {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-7 px-2 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FileText(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
