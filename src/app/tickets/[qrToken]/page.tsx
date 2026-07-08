"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { verifyTicket } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, Calendar, MapPin, Ticket } from "lucide-react";

export default function TicketPage() {
  const params = useParams();
  const qrToken = params.qrToken as string;
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!qrToken) return;
    verifyTicket(qrToken).then((res) => {
      setLoading(false);
      if (res?.data) setTicket(res.data);
      else setError(res?.message || "Tiket tidak ditemukan");
    });
  }, [qrToken]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>;

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="border-red-800 bg-slate-900"><CardContent className="p-8 text-center"><XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" /><p className="text-red-400">{error}</p></CardContent></Card>
    </div>
  );

  const statusColor = ticket?.status === "paid" ? "emerald" : ticket?.status === "used" ? "amber" : "slate";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-md mx-auto px-4 py-8">
        <Card className={`border-${statusColor}-800 bg-slate-900`}>
          <CardHeader className={`pb-4 border-b border-${statusColor}-800 text-center`}>
            <Ticket className={`w-8 h-8 text-${statusColor}-400 mx-auto mb-2`} />
            <CardTitle className="text-lg font-bold text-white">E-Tiket</CardTitle>
            <Badge variant={ticket?.status === "paid" ? "success" : ticket?.status === "used" ? "warning" : "secondary"} className="mt-1">
              {ticket?.status === "paid" ? "AKTIF" : ticket?.status === "used" ? "SUDAH DIGUNAKAN" : "PENDING"}
            </Badge>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="text-center">
              <div className="w-36 h-36 mx-auto bg-white rounded-xl flex items-center justify-center mb-2">
                <span className="text-slate-800 text-[10px] font-mono break-all px-3 text-center">{qrToken}</span>
              </div>
              <p className="text-[10px] text-slate-500">QR Token — Tunjukkan saat check-in</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Pemesan</span><span className="font-semibold text-white">{ticket?.buyer_name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Tiket</span><span className="font-semibold text-white">{ticket?.tier_name} x {ticket?.quantity}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Total</span><span className="font-extrabold text-emerald-400">{formatRupiah(ticket?.total)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Event</span><span className="font-semibold text-white text-right max-w-[200px]">{ticket?.event_title}</span></div>
              <div className="flex items-center gap-2 text-xs text-slate-400 pt-1"><Calendar className="w-3.5 h-3.5" />{ticket?.event_date}</div>
              <div className="flex items-center gap-2 text-xs text-slate-400"><MapPin className="w-3.5 h-3.5" />{ticket?.venue}</div>
            </div>
            {ticket?.status === "paid" && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Tiket valid — siap digunakan
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
