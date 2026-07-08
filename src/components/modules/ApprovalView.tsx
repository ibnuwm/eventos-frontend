"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { CheckCircle2, Smartphone, FileCheck, ExternalLink, ShieldCheck, Copy, Loader2 } from "lucide-react";
import { generatePortalLink, verifyPortalToken } from "@/lib/api";

export function ApprovalView() {
  const { showToast, projects } = useApp();
  const [sending, setSending] = useState(false);
  const [portalUrl, setPortalUrl] = useState<string | null>(null);
  const [generatedFor, setGeneratedFor] = useState<string | null>(null);

  const firstProject = projects[0];

  const handleSendLink = async () => {
    if (!firstProject) {
      showToast("Tidak ada proyek untuk dibuatkan link portal");
      return;
    }
    setSending(true);
    const res = await generatePortalLink({
      project_id: firstProject.id,
      client_name: firstProject.clientName,
      client_whatsapp: "0812-8899-1234",
      tenant_id: "tenant-demo-uuid",
    });
    if (res?.status === "success") {
      setPortalUrl(res.data.portal_url);
      setGeneratedFor(res.data.client_name);
      showToast(`📲 Tautan portal persetujuan berhasil dibuat untuk ${res.data.client_name}!`);
    } else {
      showToast("Gagal membuat link portal");
    }
    setSending(false);
  };

  const handleCopyLink = () => {
    if (portalUrl) {
      navigator.clipboard?.writeText(portalUrl);
      showToast("📋 Tautan portal disalin ke clipboard!");
    }
  };

  const [layoutApproved, setLayoutApproved] = useState(false);
  const [rundownApproved, setRundownApproved] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Modul 11: Client Digital Approval Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Portal persetujuan digital berbasis tautan. Klien mengesahkan layout, rundown, dan tagihan dengan 1 klik E-Signature via tautan WA.
          </p>
        </div>
        <Button
          onClick={handleSendLink}
          disabled={sending}
          className="gap-1.5 font-semibold bg-emerald-600 hover:bg-emerald-500"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
          {sending ? "Membuat..." : "Buat & Kirim Link Portal"}
        </Button>
      </div>

      {/* Generated Link Info */}
      {portalUrl && (
        <Card className="border-emerald-800 bg-emerald-900/20">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="font-semibold text-white">Portal untuk {generatedFor}: </span>
                <span className="text-emerald-300 break-all">{portalUrl}</span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="flex-shrink-0 gap-1" onClick={handleCopyLink}>
              <Copy className="w-3.5 h-3.5" /> Salin
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Simulated Mobile Device Frame */}
      <div className="max-w-md mx-auto rounded-3xl border-4 border-slate-800 bg-slate-950 p-6 shadow-2xl shadow-black/60 relative overflow-hidden">
        {/* Notch */}
        <div className="w-32 h-4 bg-slate-800 rounded-b-xl mx-auto absolute top-0 left-0 right-0 flex items-center justify-center">
          <div className="w-8 h-1 rounded-full bg-slate-700"></div>
        </div>

        <div className="pt-4 text-center pb-4 border-b border-slate-800/80">
          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 font-bold">
            Portal Persetujuan Resmi
          </Badge>
          <h3 className="text-lg font-bold text-white mt-2">
            {firstProject?.title || "Royal Wedding Anisa & Budi"}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Diselenggarakan oleh: <strong className="text-slate-300">EventOS Wedding Organizer</strong>
          </p>
        </div>

        <div className="py-4 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Dokumen Menunggu Pengesahan Anda:
          </div>

          {/* Item 1: 3D Layout */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                📐 Sketsa 3D Pelaminan & Floorplan
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Versi Final v3.2 (Revisi Lorong Kursi Roda)</div>
            </div>
            {layoutApproved ? (
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approved
              </Badge>
            ) : (
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold px-3 h-8"
                onClick={() => {
                  setLayoutApproved(true);
                  showToast("✅ Klien menyetujui Sketsa 3D Layout! Notifikasi instan masuk ke dasbor divisi Dekorasi.");
                }}
              >
                Approve
              </Button>
            )}
          </div>

          {/* Item 2: Rundown */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                ⏱️ Susunan Rundown Menit per Menit
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Durasi 05.00 - 15.00 WIB (Akad & Resepsi)</div>
            </div>
            {rundownApproved ? (
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approved
              </Badge>
            ) : (
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold px-3 h-8"
                onClick={() => {
                  setRundownApproved(true);
                  showToast("✅ Klien menyetujui Rundown Final H-7!");
                }}
              >
                Approve
              </Button>
            )}
          </div>

          {/* Item 3: Invoice Payment */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-white">🧾 Faktur Termin 2 (50%)</div>
                <div className="text-[11px] text-amber-400 font-semibold mt-0.5">Jatuh Tempo: 14 Juli 2026</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-extrabold text-emerald-400">{formatRupiah(90000000)}</div>
              </div>
            </div>
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold text-xs h-9 gap-1.5"
              onClick={() => showToast("💳 Mengalihkan klien ke Midtrans / Xendit Virtual Account Payment Gateway...")}
            >
              <span>Bayar via Virtual Account / QRIS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Diamankan dengan enkripsi SSL 256-bit & E-Signature Audit Log
          </div>
        </div>
      </div>

      {/* Info */}
      <Card className="border-slate-800 bg-slate-900">
        <CardContent className="p-4 flex items-start gap-3 text-sm text-slate-300">
          <FileCheck className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
          <div>
            <strong className="text-white">Cara kerja:</strong> Klik &quot;Buat & Kirim Link Portal&quot; untuk menghasilkan tautan unik.
            Tautan bisa dikirim manual ke WhatsApp klien. Buka tautan tersebut untuk melihat portal persetujuan publik sebenarnya.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
