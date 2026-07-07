"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatDate } from "@/lib/utils";
import { TrendingUp, Users, CalendarCheck, AlertOctagon, ArrowUpRight, PlusCircle } from "lucide-react";

interface DashboardViewProps {
  onNavigate: (module: any) => void;
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  const { projects, leads, inventory, showToast } = useApp();

  const activeProjectsCount = projects.length;
  const totalContractValue = projects.reduce((acc, p) => acc + p.contractValue, 0);
  const totalProfitEstimate = projects.reduce((acc, p) => acc + (p.contractValue - p.vendorCost - p.operationalCost), 0);
  const avgMargin = totalContractValue > 0 ? ((totalProfitEstimate / totalContractValue) * 100).toFixed(1) : "0";
  const conflictingCount = inventory.filter((i) => i.hasConflict).length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Badge className="mb-2 bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
            Sistem Operasi Event & Wedding
          </Badge>
          <h2 className="text-2xl font-bold text-white tracking-tight">Selamat Datang di Dasbor Utama, Anisa! 👋</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Semua alur kerja dari prospek CRM WhatsApp, checklist tugas ClickUp, pengesahan klien, hingga kalkulasi margin HPP tersinkronisasi secara langsung.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => onNavigate("quotation")}
            className="gap-2 bg-indigo-600 hover:bg-indigo-500 font-semibold"
          >
            <PlusCircle className="w-4 h-4" />
            Buat Penawaran Baru
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate("ai")}
            className="gap-2 border-purple-500/40 text-purple-300 hover:bg-purple-500/10"
          >
            ✨ AI Copilot
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Proyek Berjalan</span>
              <CalendarCheck className="w-4 h-4 text-indigo-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">{activeProjectsCount} Proyek</div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> +2 dari bulan sebelumnya
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Prospek CRM Aktif</span>
              <Users className="w-4 h-4 text-blue-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">{leads.length} Leads</div>
            <p className="text-xs text-amber-400 mt-1 font-medium">
              ⚡ 2 Prospek menunggu follow-up WA
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Nilai Kontrak (GMV)</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-white">{formatRupiah(totalContractValue)}</div>
            <p className="text-xs text-emerald-400 mt-1 font-medium">
              Rata-rata Margin Laba: {avgMargin}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Alert Inventaris Aset</span>
              <AlertOctagon className="w-4 h-4 text-red-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-red-400">{conflictingCount} Bentrok</div>
            <p className="text-xs text-slate-400 mt-1">
              ⚠️ Cek Kursi Tiffany pada tanggal 14 Agustus
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Projects Table & Shortcut Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-800 bg-slate-900/80">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <CardTitle className="text-base font-bold text-white">Status Proyek Acara Berjalan</CardTitle>
                <p className="text-xs text-slate-400">Pantau progres penyelesaian checklist & jadwal hari H</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => onNavigate("project")}>
                Lihat Semua
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/40">
                      <th className="p-4">Proyek & Klien</th>
                      <th className="p-4">Tanggal Acara</th>
                      <th className="p-4">Nilai Kontrak</th>
                      <th className="p-4">Progres Checklist</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {projects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-white">{proj.title}</div>
                          <div className="text-xs text-slate-400">{proj.clientName}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-slate-200">{formatDate(proj.eventDate)}</div>
                          <Badge variant={proj.daysRemaining <= 40 ? "warning" : "info"} className="mt-1">
                            T-{proj.daysRemaining} Hari
                          </Badge>
                        </td>
                        <td className="p-4 font-semibold text-emerald-400">
                          {formatRupiah(proj.contractValue)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-between text-xs font-semibold mb-1">
                            <span className="text-slate-300">{proj.progressPercentage}% Selesai</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-300"
                              style={{ width: `${proj.progressPercentage}%` }}
                            />
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-indigo-400 hover:text-indigo-300"
                            onClick={() => onNavigate("project")}
                          >
                            Detail <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Shortcut Hub */}
        <div className="space-y-4">
          <Card className="border-slate-800 bg-slate-900/80">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-base font-bold text-white">Akses Cepat Modul Utama</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div
                onClick={() => onNavigate("crm")}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">Modul 1: CRM & WhatsApp Pipeline</div>
                  <div className="text-xs text-slate-400 mt-0.5">Automasi reminder & tracking prospek lead</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
              </div>

              <div
                onClick={() => onNavigate("budget")}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">Modul 6: Realtime Profit Engine</div>
                  <div className="text-xs text-slate-400 mt-0.5">Kalkulasi margin bersih & alarm HPP vendor</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
              </div>

              <div
                onClick={() => onNavigate("rundown")}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">Modul 8: Rundown Builder</div>
                  <div className="text-xs text-slate-400 mt-0.5">Susun jadwal menit per menit & auto-shift</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
              </div>

              <div
                onClick={() => onNavigate("approval")}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">Modul 11: Client Approval Portal</div>
                  <div className="text-xs text-slate-400 mt-0.5">Portal e-sign layout & tagihan tanpa debat WA</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
