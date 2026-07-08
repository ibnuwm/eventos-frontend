"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { verifyPortalToken, approvePortalDocument } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, FileText, ShieldCheck } from "lucide-react";

interface ProjectData {
  id: string;
  title: string;
  client_name: string;
  event_date: string;
  venue_name: string;
  progress_percentage: number;
}

interface QuotationData {
  id: string;
  title: string;
  grand_total: number;
  status: string;
  items: { id: string; category: string; title: string; vendor_name: string; price: number }[];
}

interface InvoiceData {
  id: string;
  termin_type: string;
  amount: number;
  status: string;
}

export default function ClientPortalPage() {
  const params = useParams();
  const token = params.token as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [quotation, setQuotation] = useState<QuotationData | null>(null);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [approvedDocs, setApprovedDocs] = useState<string[]>([]);
  const [approving, setApproving] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    if (!token) return;
    verifyPortalToken(token).then((res) => {
      setLoading(false);
      if (res?.status === "success" && res?.data) {
        setProject(res.data.project);
        setQuotation(res.data.quotation);
        setInvoices(res.data.invoices || []);
        setApprovedDocs(res.data.approved_documents || []);
        setClientName(res.data.client_name);
        setExpiresAt(res.data.expires_at);
      } else {
        setError(res?.message || "Token tidak valid");
      }
    });
  }, [token]);

  const handleApprove = async (docType: string) => {
    setApproving(docType);
    const res = await approvePortalDocument(token, docType, clientName);
    if (res?.status === "success") {
      setApprovedDocs(res.data.approved_documents || []);
    }
    setApproving(null);
  };

  const isApproved = (docType: string) => approvedDocs.includes(docType);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Memuat portal persetujuan...
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="border-red-800 bg-slate-900 max-w-md w-full">
          <CardContent className="p-8 text-center space-y-3">
            <XCircle className="w-12 h-12 text-red-400 mx-auto" />
            <h2 className="text-lg font-bold text-white">Token Tidak Valid</h2>
            <p className="text-sm text-slate-400">{error || "Link ini sudah kedaluwarsa atau tidak ditemukan."}</p>
            <p className="text-xs text-slate-500">Silakan hubungi WO Anda untuk mendapatkan tautan baru.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 font-bold text-xs">
            Portal Persetujuan Digital
          </Badge>
          <h1 className="text-xl font-bold text-white">{project.title}</h1>
          <p className="text-sm text-slate-400">
            Halo <strong className="text-white">{clientName}</strong>, dokumen berikut siap Anda setujui.
          </p>
          <p className="text-xs text-slate-500">Tautan berlaku hingga: {new Date(expiresAt).toLocaleDateString("id-ID")}</p>
        </div>

        {/* Project Info */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Informasi Proyek
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Client</span>
              <span className="font-semibold text-white">{project.client_name}</span>
            </div>
            {project.venue_name && (
              <div className="flex justify-between text-slate-300">
                <span>Venue</span>
                <span className="font-semibold text-white">{project.venue_name}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-300">
              <span>Tanggal Event</span>
              <span className="font-semibold text-white">{project.event_date}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Progress</span>
              <span className="font-semibold text-emerald-400">{project.progress_percentage}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Documents to Approve */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-sm font-bold text-white">Dokumen Persetujuan</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-white">Layout 3D & Floorplan</div>
                <div className="text-xs text-slate-400">Sketsa pelaminan & tata ruang</div>
              </div>
              {isApproved("3D_LAYOUT") ? (
                <Badge variant="success" className="gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Disetujui
                </Badge>
              ) : (
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold h-8 px-3"
                  disabled={approving === "3D_LAYOUT"}
                  onClick={() => handleApprove("3D_LAYOUT")}>
                  {approving === "3D_LAYOUT" ? "..." : "Setujui"}
                </Button>
              )}
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-white">Rundown Acara</div>
                <div className="text-xs text-slate-400">Jadwal menit per menit</div>
              </div>
              {isApproved("RUNDOWN") ? (
                <Badge variant="success" className="gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Disetujui
                </Badge>
              ) : (
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold h-8 px-3"
                  disabled={approving === "RUNDOWN"}
                  onClick={() => handleApprove("RUNDOWN")}>
                  {approving === "RUNDOWN" ? "..." : "Setujui"}
                </Button>
              )}
            </div>
            {quotation && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">Penawaran ({quotation.title})</div>
                    <div className="text-xs text-slate-400">{quotation.items.length} item layanan</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-emerald-400">{formatRupiah(quotation.grand_total)}</div>
                  </div>
                </div>
                {isApproved("QUOTATION") ? (
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Disetujui
                  </Badge>
                ) : (
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold h-9 mt-2"
                    disabled={approving === "QUOTATION"}
                    onClick={() => handleApprove("QUOTATION")}>
                    {approving === "QUOTATION" ? "..." : "Setujui Penawaran & Terbitkan Invoice"}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoices */}
        {invoices.length > 0 && (
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Status Invoice
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <div className="text-sm font-semibold text-white">{inv.termin_type}</div>
                    <div className="text-emerald-400 font-bold">{formatRupiah(inv.amount)}</div>
                  </div>
                  <Badge variant={inv.status === "paid" ? "success" : "secondary"}>
                    {inv.status === "paid" ? "LUNAS" : "Belum Dibayar"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center pb-8">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Diamankan dengan enkripsi SSL 256-bit & E-Signature Audit Log
          </div>
        </div>
      </div>
    </div>
  );
}
