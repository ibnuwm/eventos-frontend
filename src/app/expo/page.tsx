"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchVirtualExpos } from "@/lib/api";
import { Loader2, Calendar, MapPin, ExternalLink, XCircle } from "lucide-react";

const statusConfig: Record<string, { label: string; className: string }> = {
  upcoming: { label: "Akan Datang", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  ongoing: { label: "Sedang Berlangsung", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  past: { label: "Selesai", className: "bg-slate-700/20 text-slate-400 border-slate-700/30" },
};

export default function ExpoPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expos, setExpos] = useState<any[]>([]);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true); setError(null);
    try {
      const res = await fetchVirtualExpos();
      if (res?.status === "success") setExpos(res.data);
      else setError(res?.message || "Gagal memuat virtual expo");
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>;
  if (error) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-center"><XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" /><p className="text-slate-400">{error}</p></div></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-3">
          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">Virtual Expo</Badge>
          <h1 className="text-3xl font-bold text-white">Virtual Expo EventOS</h1>
          <p className="text-slate-400">Jelajahi pameran virtual, temukan vendor, dan daftarkan booth Anda.</p>
        </div>

        {expos.length === 0 && (
          <div className="text-center py-12"><p className="text-slate-500">Belum ada expo tersedia.</p></div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {expos.map((expo: any) => {
            const cfg = statusConfig[expo.status] || statusConfig.upcoming;
            return (
              <Link key={expo.id} href={`/expo/${expo.id}`} className="group">
                <Card className="border-slate-800 bg-slate-900/60 hover:border-indigo-500/40 transition-all h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`text-[10px] ${cfg.className}`}>{cfg.label}</Badge>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3" />{expo.date || expo.start_date}</span>
                    </div>
                    <CardTitle className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">{expo.title}</CardTitle>
                    {expo.location && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3 h-3" /> {expo.location}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="text-sm text-slate-400">
                    <p className="line-clamp-2">{expo.description}</p>
                    <div className="flex items-center gap-1 text-indigo-400 font-semibold mt-3 text-xs">
                      Lihat Detail <ExternalLink className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
