"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchVirtualExpo, registerExpoBooth } from "@/lib/api";
import { Loader2, ArrowLeft, Calendar, MapPin, Users, Eye, Store, XCircle, CheckCircle2 } from "lucide-react";

const statusConfig: Record<string, { label: string; className: string }> = {
  upcoming: { label: "Akan Datang", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  ongoing: { label: "Sedang Berlangsung", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  past: { label: "Selesai", className: "bg-slate-700/20 text-slate-400 border-slate-700/30" },
};

export default function ExpoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expo, setExpo] = useState<any>(null);
  const [registering, setRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [boothTitle, setBoothTitle] = useState("");

  useEffect(() => { fetchData(); }, [id]);

  async function fetchData() {
    if (!id) return;
    setLoading(true); setError(null);
    try {
      const res = await fetchVirtualExpo(id);
      if (res?.status === "success") setExpo(res.data);
      else setError(res?.message || "Gagal memuat detail expo");
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function handleRegister() {
    if (!boothTitle.trim()) return;
    setRegistering(true);
    try {
      const res = await registerExpoBooth({ virtual_expo_id: id, booth_title: boothTitle });
      if (res?.status === "success") setRegisterSuccess(true);
      else setError(res?.message || "Gagal mendaftarkan booth");
    } catch (e: any) { setError(e.message); }
    finally { setRegistering(false); }
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>;
  if (error && !expo) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-center"><XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" /><p className="text-slate-400">{error}</p></div></div>;
  if (!expo) return <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4"><Card className="border-slate-800 bg-slate-900"><CardContent className="p-8 text-center space-y-3"><XCircle className="w-12 h-12 text-red-400 mx-auto" /><h2 className="text-lg font-bold text-white">Expo Tidak Ditemukan</h2><Link href="/expo"><Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" /> Kembali</Button></Link></CardContent></Card></div>;

  const cfg = statusConfig[expo.status] || statusConfig.upcoming;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Link href="/expo"><Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="w-4 h-4" /> Kembali ke Expo</Button></Link>

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={cfg.className}>{cfg.label}</Badge>
            </div>
            <CardTitle className="text-xl font-bold text-white">{expo.title}</CardTitle>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 flex-wrap">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{expo.date || expo.start_date}</span>
              {expo.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{expo.location}</span>}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-300">{expo.description}</p>
          </CardContent>
        </Card>

        {/* Daftar Booth */}
        {expo.booths && expo.booths.length > 0 && (
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-indigo-400" />
                Vendor Booths ({expo.booths.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {expo.booths.map((booth: any) => (
                <div key={booth.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">{booth.booth_title}</h3>
                  </div>
                  {booth.description && <p className="text-xs text-slate-400">{booth.description}</p>}
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {booth.visitor_count || 0} kunjungan</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {booth.lead_count || 0} leads</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Register Booth */}
        {!registerSuccess && expo.status !== "past" && (
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-sm font-bold text-white">Daftar Booth</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Input
                value={boothTitle}
                onChange={(e) => setBoothTitle(e.target.value)}
                placeholder="Nama Booth Anda"
                className="bg-slate-950 border-slate-800"
              />
              <Button onClick={handleRegister} disabled={registering || !boothTitle.trim()} className="bg-indigo-600 hover:bg-indigo-500">
                {registering ? <Loader2 className="w-4 h-4 animate-spin" /> : "Daftar Booth"}
              </Button>
            </CardContent>
          </Card>
        )}

        {registerSuccess && (
          <Card className="border-emerald-800 bg-slate-900">
            <CardContent className="p-6 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <p className="text-emerald-400 font-bold">Booth berhasil didaftarkan!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
