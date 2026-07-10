"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/context";
import { Award, CheckCircle2, AlertCircle, ArrowRight, Sparkles, MessageSquare, TrendingUp, Shield, FileText, Zap, Users, Search } from "lucide-react";
import { motion } from "framer-motion";

const improvements = [
  { icon: Sparkles, title: "AI Project Manager", desc: "Auto-generate rundown, analisa vendor, & prediksi risiko", status: "done" },
  { icon: MessageSquare, title: "WhatsApp-Native Workflow", desc: "Follow-up, approval, & notifikasi via WhatsApp terintegrasi", status: "done" },
  { icon: TrendingUp, title: "Vendor Performance Score", desc: "SLA rating & history real-time untuk rekomendasi terbaik", status: "done" },
  { icon: Search, title: "Predictive Conflict Detection", desc: "AI mendeteksi bentrok jadwal aset 30 hari sebelum H-1", status: "done" },
  { icon: FileText, title: "Auto Accounting & Invoice", desc: "Generate invoice otomatis dari quotation yang disetujui", status: "done" },
  { icon: Shield, title: "Marketplace Data-Driven", desc: "Rekomendasi vendor berdasarkan data operasional nyata", status: "done" },
  { icon: Users, title: "Client Portal Approvals", desc: "Portal digital untuk approval layout, rundown, & tagihan", status: "done" },
  { icon: Zap, title: "Knowledge Base AI RAG", desc: "AI menjawab pertanyaan berdasarkan dokumen kontrak & SOP", status: "done" },
];

interface ImprovementsHubViewProps {
  onNavigate: (module: any) => void;
}

export function ImprovementsHubView({ onNavigate }: ImprovementsHubViewProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-brand-500/10 to-background border border-emerald-500/20 p-6">
        <Badge className="mb-2 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold"><Award className="w-3 h-3 mr-1" /> Verified</Badge>
        <h2 className="text-2xl font-bold text-foreground font-display">8 Improvements Hub</h2>
        <p className="text-sm text-muted-foreground mt-1">Semua 8 inovasi kunci telah terverifikasi dan aktif di sistem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {improvements.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              whileHover={{ y: -2 }}
              className="glass-card rounded-xl p-5 border-border/60"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              </div>
              <h3 className="font-bold text-foreground text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        <Button onClick={() => onNavigate("dashboard")} className="font-semibold gap-2">
          Kembali ke Dashboard <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
