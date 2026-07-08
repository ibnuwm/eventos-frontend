"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { vendorDashboard } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Star, Clock, Briefcase, CheckCircle2, XCircle } from "lucide-react";

export default function VendorDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendor_id") || (typeof window !== "undefined" ? sessionStorage.getItem("vendor_id") : null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vendorId) { setLoading(false); setError("ID Vendor tidak ditemukan"); return; }
    vendorDashboard(vendorId).then((res) => {
      setLoading(false);
      if (res?.data) setData(res.data);
      else setError(res?.message || "Gagal memuat dashboard");
    });
  }, [vendorId]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>;

  if (error || !data) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="border-red-800 bg-slate-900"><CardContent className="p-8"><p className="text-red-400">{error}</p><a href="/vendor/login"><Button variant="outline" size="sm" className="mt-3 gap-2"><ArrowLeft className="w-4 h-4" /> Login</Button></a></CardContent></Card>
    </div>
  );

  const vendor = data.vendor;
  const stats = data.stats;
  const tasks = data.upcoming_tasks || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <a href="/"><Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="w-4 h-4" /> Beranda</Button></a>
          <Badge variant="info" className="text-[10px]">{vendor.category}</Badge>
        </div>

        {/* Vendor Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">{vendor.name.charAt(0)}</div>
          <div>
            <h1 className="text-xl font-bold text-white">{vendor.name}</h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> {vendor.rating}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-400" /> SLA {vendor.sla_punctuality}%</span>
              <span>{vendor.area}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-4 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-indigo-400" />
              <div><div className="text-xs text-slate-400">Total Proyek</div><div className="text-2xl font-extrabold text-white">{stats.total_projects}</div></div>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <div><div className="text-xs text-slate-400">Selesai</div><div className="text-2xl font-extrabold text-emerald-400">{stats.completed_tasks}</div></div>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-400" />
              <div><div className="text-xs text-slate-400">Pending</div><div className="text-2xl font-extrabold text-amber-400">{stats.pending_tasks}</div></div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-sm font-bold text-white">Tugas Mendatang</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {tasks.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Belum ada tugas saat ini</p>}
            {tasks.map((task: any) => (
              <div key={task.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">{task.title}</div>
                  <div className="text-xs text-slate-400">{task.division} • Due: {task.due_date}</div>
                </div>
                <Badge variant={task.is_completed ? "success" : "secondary"}>{task.is_completed ? "Selesai" : "Pending"}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
