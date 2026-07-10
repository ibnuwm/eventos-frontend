"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserCheck, Search, MapPin, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel,
  flexRender, SortingState, ColumnDef
} from "@tanstack/react-table";
import { StaffCrew } from "@/types";
import { cn } from "@/lib/utils";

export function StaffView() {
  const { staff } = useApp();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<StaffCrew>[]>(
    () => [
      { accessorKey: "name", header: "Nama Kru", cell: ({ row }) => <span className="font-bold text-foreground">{row.original.name}</span> },
      { accessorKey: "role", header: "Role", cell: ({ row }) => <Badge variant="info" className="text-xs">{row.original.role}</Badge> },
      { accessorKey: "assignedEventTitle", header: "Event", cell: ({ row }) => <span className="text-muted-foreground text-xs">{row.original.assignedEventTitle}</span> },
      { accessorKey: "location", header: "Lokasi", cell: ({ row }) => (
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />{row.original.location}
        </span>
      )},
      { accessorKey: "checkInTime", header: "Check-in", cell: ({ row }) => (
        <span className="text-xs font-medium text-emerald-400">{row.original.checkInTime || "-"}</span>
      )},
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const statusMap: Record<string, { label: string; variant: "success" | "warning" | "secondary" }> = {
            checked_in: { label: "Checked In", variant: "success" },
            on_way: { label: "On The Way", variant: "warning" },
            standby: { label: "Standby", variant: "secondary" },
          };
          const s = statusMap[row.original.status] || { label: row.original.status, variant: "secondary" as const };
          return (
            <div className="flex items-center gap-1.5">
              <span className={cn("w-2 h-2 rounded-full", {
                "bg-emerald-500": s.variant === "success",
                "bg-amber-500": s.variant === "warning",
                "bg-slate-500": s.variant === "secondary",
              })} />
              <Badge variant={s.variant} className="text-xs font-bold">{s.label}</Badge>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: staff,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const checkedIn = staff.filter((s) => s.status === "checked_in").length;
  const onWay = staff.filter((s) => s.status === "on_way").length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-brand-400" />
            Staff & Crew Rostering
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Jadwal kru lapangan dan rekap jam kerja</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Cari kru..." className="pl-9 bg-muted border-border/60" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground font-display">{checkedIn}</div>
            <div className="text-xs text-muted-foreground">Checked In</div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground font-display">{onWay}</div>
            <div className="text-xs text-muted-foreground">On The Way</div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground font-display">{staff.length}</div>
            <div className="text-xs text-muted-foreground">Total Kru</div>
          </div>
        </div>
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
                      <th key={header.id} className="p-4 first:pl-6 last:pr-6 cursor-pointer" onClick={header.column.getToggleSortingHandler()}>
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
    </motion.div>
  );
}
