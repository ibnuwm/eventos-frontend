"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchEvent, createTicketOrder } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Loader2, CheckCircle2, Users, ArrowLeft, Ticket } from "lucide-react";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [event, setEvent] = useState<any>(null);
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [buyerForm, setBuyerForm] = useState({ name: "", whatsapp: "", email: "" });
  const [orderResult, setOrderResult] = useState<any>(null);

  useEffect(() => {
    if (!eventId) return;
    fetchEvent(eventId).then((res) => {
      setLoading(false);
      if (res?.data) { setEvent(res.data.event); setTiers(res.data.tiers || []); }
      else setError(res?.message || "Event tidak ditemukan");
    });
  }, [eventId]);

  const handleBuy = async (tier: any) => {
    setSelectedTier(tier);
    setBuyerForm({ name: "", whatsapp: "", email: "" });
    setOrderResult(null);
    setQuantity(1);
  };

  const handleOrder = async () => {
    if (!selectedTier || !buyerForm.name || !buyerForm.whatsapp) return;
    setBuying(true);
    const res = await createTicketOrder({
      event_ticket_id: eventId, tier_id: selectedTier.id,
      buyer_name: buyerForm.name, buyer_email: buyerForm.email,
      buyer_whatsapp: buyerForm.whatsapp, quantity,
    });
    if (res?.data) setOrderResult(res.data);
    setBuying(false);
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>;
  if (error) return <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4"><Card className="border-red-800 bg-slate-900"><CardContent className="p-8"><p className="text-red-400">{error}</p></CardContent></Card></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <a href="/"><Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="w-4 h-4" /> Kembali</Button></a>
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader className="pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 mb-2"><Ticket className="w-5 h-5 text-indigo-400" /><Badge variant="info" className="text-[10px]">Tiket Event</Badge></div>
            <CardTitle className="text-xl font-bold text-white">{event?.event_title}</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-indigo-400" /><span>{event?.event_date}</span></div>
            <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-indigo-400" /><span>{event?.venue}</span></div>
            {event?.description && <p className="text-sm text-slate-400">{event.description}</p>}
          </CardContent>
        </Card>

        <h3 className="font-bold text-white text-lg">Pilih Tiket</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tiers.map((tier) => {
            const available = tier.quota - tier.sold;
            return (
              <Card key={tier.id} className={`border-slate-800 bg-slate-900 cursor-pointer transition-all hover:border-indigo-500/40 ${selectedTier?.id === tier.id ? "border-indigo-500 ring-1 ring-indigo-500" : ""}`}
                onClick={() => handleBuy(tier)}>
                <CardContent className="p-5 space-y-2">
                  <Badge className="text-[10px]" variant={tier.tier_name === "VIP" ? "success" : tier.tier_name === "Early Bird" ? "warning" : "secondary"}>{tier.tier_name}</Badge>
                  <div className="text-2xl font-extrabold text-emerald-400">{formatRupiah(tier.price)}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1"><Users className="w-3 h-3" /> Sisa {available} tiket</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedTier && !orderResult && (
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="pb-3 border-b border-slate-800"><CardTitle className="text-sm font-bold text-white">Form Pemesanan</CardTitle></CardHeader>
            <CardContent className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Nama Lengkap</label>
                <input value={buyerForm.name} onChange={(e) => setBuyerForm({ ...buyerForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white" placeholder="Nama Anda" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">No. WhatsApp</label>
                <input value={buyerForm.whatsapp} onChange={(e) => setBuyerForm({ ...buyerForm, whatsapp: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white" placeholder="0812xxxx" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Email (opsional)</label>
                <input value={buyerForm.email} onChange={(e) => setBuyerForm({ ...buyerForm, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white" placeholder="email@contoh.com" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Jumlah Tiket</label>
                <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} tiket</option>)}
                </select>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-800 pt-3">
                <span className="font-semibold text-white">Total</span>
                <span className="font-extrabold text-emerald-400">{formatRupiah(selectedTier.price * quantity)}</span>
              </div>
              <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 font-bold" disabled={buying || !buyerForm.name || !buyerForm.whatsapp} onClick={handleOrder}>
                {buying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Pesan Tiket
              </Button>
            </CardContent>
          </Card>
        )}

        {orderResult && (
          <Card className="border-emerald-800 bg-emerald-900/20">
            <CardContent className="p-5 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-emerald-400">Pesanan Berhasil!</h3>
              <p className="text-sm text-slate-400">Total: {formatRupiah(orderResult.total)}</p>
              <p className="text-xs text-slate-500">Simpan QR tiket Anda:</p>
              <div className="w-32 h-32 mx-auto bg-white rounded-xl flex items-center justify-center">
                <span className="text-slate-800 text-[8px] font-mono break-all px-2 text-center">{orderResult.qr_token}</span>
              </div>
              <a href={`/tickets/${orderResult.qr_token}`}>
                <Button variant="outline" size="sm" className="gap-2">Lihat Tiket</Button>
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
