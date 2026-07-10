"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, ExternalLink, Clock, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { formatRupiah } from "@/lib/utils";

export function ApprovalView() {
  const { approvals, projects, showToast, approveItem, copyLink, sendWa } = useApp();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-brand-400" />
          Client Digital Approval Portal
        </h2>
        <p className="text-xs text-muted-foreground mt-1">Portal 1-klik bagi klien untuk menyetujui layout, rundown, dan penawaran</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Approval Cards */}
        <div className="lg:col-span-2 space-y-3">
          {approvals.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card rounded-xl p-5 border-border/60"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    item.status === "approved" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                  }`}>
                    {item.status === "approved" ? <Check className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="info" className="text-xs">{item.type}</Badge>
                      <Badge variant={item.status === "approved" ? "success" : "warning"} className="text-xs">
                        {item.status === "approved" ? "Disetujui" : "Menunggu"}
                      </Badge>
                    </div>
                    <div className="font-bold text-foreground mt-1">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Klien: {item.client}</div>
                    {item.value && (
                      <div className="text-sm font-bold text-emerald-400 mt-1">{formatRupiah(item.value)}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.status === "pending" && (
                    <>
                      <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={async () => { await copyLink(item.id); await sendWa(item.client, `Link approval ${item.type} untuk "${item.title}": eventos.id/portal/${item.id}`); showToast(`Link ${item.type} dikirim ke ${item.client}`); }}>
                        <ExternalLink className="w-3 h-3" /> Kirim Link
                      </Button>
                      <Button size="sm" className="h-8 text-xs gap-1 bg-emerald-600 hover:bg-emerald-500" onClick={() => { approveItem(item.id); showToast(`${item.type} "${item.title}" disetujui!`); }}>
                        <Check className="w-3 h-3" /> Setujui
                      </Button>
                    </>
                  )}
                  {item.status === "approved" && (
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => showToast(`${item.type}: ${item.title} — Klien: ${item.client}${item.value ? `, Nilai: ${formatRupiah(item.value)}` : ""} — Status: Disetujui`)}>
                      <FileText className="w-3 h-3 mr-1" /> Lihat
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-3">
          <Card className="glass-card border-border/60">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold text-foreground font-display">Portal Link</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="p-3 rounded-xl bg-muted/50 border border-border/60 text-xs">
                <div className="font-semibold text-foreground">Link Aktif</div>
                <div className="text-brand-400 font-mono text-xs mt-1 truncate">eventos.id/portal/a1b2c3</div>
              </div>
              <div className="text-xs text-muted-foreground">Bagikan link ini ke klien untuk approval mandiri</div>
              <Button size="sm" className="w-full text-xs" onClick={() => { copyLink("a1b2c3"); showToast("Link portal disalin ke clipboard!"); }}>Salin Link</Button>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/60">
            <CardContent className="p-4 text-xs text-muted-foreground">
              <div className="font-semibold text-foreground mb-1">Proyek Terkait</div>
              {projects.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-1.5">
                  <span className="truncate">{p.clientName}</span>
                  <Badge variant={p.paymentStatus === "fully_paid" ? "success" : "secondary"} className="text-xs">
                    {p.paymentStatus === "fully_paid" ? "Lunas" : p.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
