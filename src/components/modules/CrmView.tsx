"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Lead } from "@/types";
import { MessageCircle, Phone, Mail, Plus, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export function CrmView() {
  const { leads, updateLeadStatus, showToast } = useApp();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const columns: { id: Lead["status"]; title: string; color: string }[] = [
    { id: "new", title: "🟢 New Lead (Masuk)", color: "border-blue-500/30 bg-blue-500/5" },
    { id: "quotation_sent", title: "📑 Quotation Sent", color: "border-amber-500/30 bg-amber-500/5" },
    { id: "negotiation", title: "🤝 Negotiation", color: "border-purple-500/30 bg-purple-500/5" },
    { id: "won", title: "🎉 Won / Deal!", color: "border-emerald-500/30 bg-emerald-500/5" },
  ];

  const handleSendWaFollowUp = (lead: Lead) => {
    showToast(`🚀 Automated WhatsApp terkirim ke ${lead.name} (${lead.whatsapp}): "Halo Kak, apakah ada yang ingin dikonsultasikan dari proposal yang dikirim?"`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Modul 1: CRM Lead & WhatsApp Pipeline
            <Badge variant="info">Automasi Follow-Up</Badge>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Kelola prospek dari Instagram / Ads, sinkronisasi WhatsApp otomatis, dan perkiraan estimasi closing.
          </p>
        </div>
        <Button
          onClick={() => showToast("📋 Formulir prospek baru dibuka. Leads dari Instagram Ads otomatis tersinkron via API.")}
          className="gap-2 font-semibold"
        >
          <Plus className="w-4 h-4" />
          Tambah Prospek Lead
        </Button>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.id);
          return (
            <div
              key={col.id}
              className={`rounded-xl border ${col.color} p-4 flex flex-col min-h-[480px]`}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className="font-bold text-sm text-white">{col.title}</span>
                <Badge variant="secondary" className="px-2 font-bold">
                  {colLeads.length}
                </Badge>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto">
                {colLeads.map((lead) => (
                  <Card
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="p-4 border-slate-800 bg-slate-900 hover:border-slate-700 cursor-pointer transition-all shadow-md group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                        {lead.name}
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {lead.paxCount} Pax
                      </Badge>
                    </div>

                    <div className="mt-2 space-y-1 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        {lead.whatsapp}
                      </div>
                      <div className="text-amber-400 font-semibold">
                        Estimasi: {formatRupiah(lead.budgetEstimation)}
                      </div>
                      {lead.eventDate && (
                        <div className="text-slate-500">Rencana: {formatDate(lead.eventDate)}</div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendWaFollowUp(lead);
                        }}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Follow-Up WA
                      </Button>

                      {col.id !== "won" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextStatus =
                              col.id === "new"
                                ? "quotation_sent"
                                : col.id === "quotation_sent"
                                ? "negotiation"
                                : "won";
                            updateLeadStatus(lead.id, nextStatus as any);
                          }}
                        >
                          Lanjut <ArrowRight className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
