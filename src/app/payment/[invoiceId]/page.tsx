"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPaymentStatus, createInvoicePayment, simulatePayment } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, Copy, ArrowLeft, CreditCard, QrCode, Building } from "lucide-react";

export default function PaymentPage() {
  const params = useParams();
  const invoiceId = params.invoiceId as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [method, setMethod] = useState("QRIS");

  useEffect(() => {
    if (!invoiceId) return;
    getPaymentStatus(invoiceId).then((res) => {
      setLoading(false);
      if (res?.data) setInvoice(res.data);
      else setError("Invoice tidak ditemukan");
    });
  }, [invoiceId]);

  const handlePay = async () => {
    setPaying(true);
    const res = await createInvoicePayment(invoiceId, method);
    if (res?.data) {
      setPaymentResult(res.data);
    } else {
      setError(res?.message || "Gagal memproses pembayaran");
    }
    setPaying(false);
  };

  const handleSimulate = async () => {
    if (!paymentResult?.transaction_id) return;
    setPaying(true);
    await simulatePayment(paymentResult.transaction_id);
    const res = await getPaymentStatus(invoiceId);
    if (res?.data) setInvoice({ ...invoice, status: "paid" });
    setPaying(false);
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>;

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="border-red-800 bg-slate-900 max-w-md"><CardContent className="p-8 text-center"><p className="text-red-400">{error}</p></CardContent></Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        <a href="/dashboard"><Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="w-4 h-4" /> Kembali</Button></a>
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              {invoice?.status === "paid" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <CreditCard className="w-5 h-5 text-indigo-400" />}
              Pembayaran Invoice
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="flex justify-between text-sm"><span className="text-slate-400">Invoice</span><span className="font-semibold text-white">{invoice?.invoice_id}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Termin</span><span className="font-semibold text-white">{invoice?.termin_type}</span></div>
            <div className="flex justify-between text-lg border-t border-slate-800 pt-3"><span className="font-bold text-white">Total</span><span className="font-extrabold text-emerald-400">{formatRupiah(invoice?.amount || 0)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Status</span><Badge variant={invoice?.status === "paid" ? "success" : "secondary"}>{invoice?.status === "paid" ? "LUNAS" : "Belum Dibayar"}</Badge></div>

            {invoice?.status !== "paid" && !paymentResult && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-semibold text-slate-400">Metode Pembayaran</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "QRIS", icon: QrCode, label: "QRIS" },
                    { id: "VA", icon: Building, label: "Virtual Account" },
                    { id: "CC", icon: CreditCard, label: "Kartu Kredit" },
                  ].map((m) => (
                    <button key={m.id} onClick={() => setMethod(m.id)}
                      className={`p-3 rounded-xl border text-center transition-all ${method === m.id ? "border-indigo-500 bg-indigo-500/10" : "border-slate-800 bg-slate-950"}`}>
                      <m.icon className="w-5 h-5 mx-auto mb-1 text-indigo-400" />
                      <span className="text-xs font-semibold">{m.label}</span>
                    </button>
                  ))}
                </div>
                <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 font-bold" disabled={paying} onClick={handlePay}>
                  {paying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Bayar {formatRupiah(invoice?.amount || 0)}
                </Button>
              </div>
            )}

            {paymentResult && invoice?.status !== "paid" && (
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-3">
                <div className="font-bold text-indigo-300">Instruksi Pembayaran</div>
                {method === "QRIS" && <div className="p-4 bg-white rounded-xl text-center"><div className="w-32 h-32 mx-auto bg-slate-200 flex items-center justify-center text-slate-600 text-xs">QRIS SIMULASI</div></div>}
                {method === "VA" && <div className="p-3 bg-slate-950 rounded-lg text-center"><div className="text-2xl font-mono font-bold text-white">{paymentResult.va_number}</div><div className="text-xs text-slate-400 mt-1">Bank Transfer / Virtual Account</div></div>}
                {method === "CC" && <div className="text-sm text-slate-300">Redirect ke halaman pembayaran kartu kredit...</div>}
                <div className="text-xs text-slate-400 flex items-center gap-1"><Copy className="w-3 h-3" /> Transaksi: {paymentResult.transaction_id}</div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold" disabled={paying} onClick={handleSimulate}>
                  {paying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Simulasi Pembayaran (Testing)
                </Button>
              </div>
            )}

            {invoice?.status === "paid" && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <div className="font-bold text-emerald-400 text-lg">Pembayaran Berhasil!</div>
                <p className="text-xs text-slate-400">Terima kasih, pembayaran Anda telah dikonfirmasi.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
