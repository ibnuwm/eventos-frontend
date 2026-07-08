"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { rsvpVerify, rsvpConfirm } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2, MapPin, Calendar, Users } from "lucide-react";

export default function RsvpPage() {
  const params = useParams();
  const token = params.token as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guest, setGuest] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ rsvp_status: "confirmed", guest_count: 1, menu_choice: "", notes: "" });

  useEffect(() => {
    if (!token) return;
    rsvpVerify(token).then((res) => {
      setLoading(false);
      if (res?.data) { setGuest(res.data); setForm({ ...form, guest_count: res.data.guest_count }); }
      else setError(res?.message || "Undangan tidak ditemukan");
    });
  }, [token]);

  const handleSubmit = async () => {
    setActionLoading(true);
    const res = await rsvpConfirm(token, form);
    if (res?.status === "success") setDone(true);
    setActionLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>;

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="border-red-800 bg-slate-900 max-w-md"><CardContent className="p-8 text-center"><XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" /><p className="text-red-400">{error}</p></CardContent></Card>
    </div>
  );

  if (done) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="border-emerald-800 bg-slate-900 max-w-md w-full">
        <CardContent className="p-8 text-center space-y-3">
          <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">{form.rsvp_status === "confirmed" ? "Kehadiran Dikonfirmasi!" : "Tidak Hadir"}</h2>
          <p className="text-slate-400">Terima kasih, konfirmasi Anda telah tercatat.</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader className="pb-3 border-b border-slate-800 text-center">
            <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 font-bold mx-auto">Konfirmasi Kehadiran</Badge>
            <CardTitle className="text-lg font-bold text-white mt-3">{guest?.event_title}</CardTitle>
            <p className="text-xs text-slate-400">Halo <strong className="text-white">{guest?.name}</strong>, Anda diundang ke acara berikut:</p>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-indigo-400" /><span>{guest?.event_date}</span></div>
            <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-indigo-400" /><span>{guest?.venue_name}</span></div>
            <div className="flex items-center gap-2 text-sm"><Users className="w-4 h-4 text-indigo-400" /><span>Kursi: {guest?.table_number || "Belum diatur"}</span></div>

            {guest?.rsvp_status === "confirmed" ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <span className="font-semibold text-emerald-400">Anda sudah konfirmasi hadir</span>
              </div>
            ) : guest?.rsvp_status === "declined" ? (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                <XCircle className="w-6 h-6 text-red-400 mx-auto mb-1" />
                <span className="font-semibold text-red-400">Anda sudah konfirmasi tidak hadir</span>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Jumlah Tamu</label>
                  <select value={form.guest_count} onChange={(e) => setForm({ ...form, guest_count: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white">
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} orang</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Pilihan Menu</label>
                  <input value={form.menu_choice} onChange={(e) => setForm({ ...form, menu_choice: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white" placeholder="(opsional)" />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500 font-bold h-11" disabled={actionLoading}
                    onClick={() => { setForm({ ...form, rsvp_status: "confirmed" }); handleSubmit(); }}>
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null} ✔ Saya Hadir
                  </Button>
                  <Button className="flex-1 bg-red-600 hover:bg-red-500 font-bold h-11" variant="destructive" disabled={actionLoading}
                    onClick={() => { setForm({ ...form, rsvp_status: "declined" }); handleSubmit(); }}>
                    ✖ Tidak Hadir
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
