"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/context";
import { Smartphone, MessageCircle, Send, CheckCircle2, Image, FileText, Phone, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const defaultMessages = [
  { id: 1, from: "Client (Anisa)", text: "Kak, untuk pelaminan bisa pakai warna rose gold dan marun? Soalnya konsepnya elegan tapi tetap hangat 🥰", time: "09.45 WIB", isIncoming: true },
  { id: 2, from: "Sistem (Auto-Reply)", text: "📋 *Notifikasi Checklist*\nLumiere Photography telah menyelesaikan: 'Pre-Wedding Concept & Execution' ✓", time: "10.00 WIB", isIncoming: true, isSystem: true },
  { id: 3, from: "Anda (Lead WO)", text: "Tentu Kak Anisa! Saya akan koordinasikan dengan tim Grand Rose Decor untuk sample warna rose gold. Ada referensi foto? ✨", time: "10.02 WIB", isIncoming: false },
];

export function WaNativeView() {
  const { showToast, sendWa, waMessages: ctxWaMessages } = useApp();
  const [input, setInput] = useState("");
  const [activeContact, setActiveContact] = useState("Klien (Anisa)");

  const displayMessages = ctxWaMessages.length > 0 ? ctxWaMessages : defaultMessages;

  const quickActions = [
    { label: "Kirim Quotation", icon: FileText, getMsg: () => "Halo, berikut quotation terbaru untuk acara Anda." },
    { label: "Request Payment", icon: Phone, getMsg: () => "Mohon untuk segera melakukan pembayaran." },
    { label: "Remind Vendor", icon: Calendar, getMsg: () => "Halo, ini reminder untuk acara besok." },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-background border border-emerald-500/20 p-6">
        <Badge className="mb-2 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold"><Smartphone className="w-3 h-3 mr-1" /> WhatsApp-Native</Badge>
        <h2 className="text-2xl font-bold text-foreground font-display">WhatsApp-Native Workflow Simulator</h2>
        <p className="text-sm text-muted-foreground mt-1">Semua interaksi via WhatsApp tanpa instalasi aplikasi tambahan.</p>
      </div>

      {/* Contact Selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {["Klien (Anisa)", "Lumiere Photography", "Grand Rose Decor", "ProSound"].map((contact) => (
          <Button
            key={contact}
            variant={activeContact === contact ? "default" : "outline"}
            size="sm"
            className="text-xs"
            onClick={() => setActiveContact(contact)}
          >
            {contact}
          </Button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => { sendWa(activeContact, action.getMsg()); }}
            >
              <Icon className="w-4 h-4 text-emerald-400" />
              {action.label}
            </Button>
          );
        })}
      </div>

      {/* Chat Simulator */}
      <Card className="glass-card border-border/60 max-w-2xl mx-auto">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-foreground">WhatsApp - Wedding Project</CardTitle>
              <div className="text-xs text-emerald-400">3 pesan baru</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3 min-h-[300px]">
          {displayMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.isIncoming ? "" : "justify-end"}`}
            >
              <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm ${
                msg.isIncoming
                  ? msg.isSystem
                    ? "bg-muted/50 border border-border/60 text-muted-foreground"
                    : "bg-muted/80 text-foreground rounded-tl-none"
                  : "bg-brand-500 text-white rounded-tr-none"
              }`}>
                <div className="text-xs font-semibold mb-1 opacity-70">{msg.from}</div>
                <div className="whitespace-pre-line">{msg.text}</div>
                <div className="text-xs mt-1 opacity-50 text-right">{msg.time}</div>
              </div>
            </motion.div>
          ))}

          {/* Quick Reply */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/60">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) { sendWa(activeContact, input); setInput(""); } }}
              placeholder="Ketik balasan WhatsApp..."
              className="flex-1 bg-muted border border-border/60 rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-brand-500"
            />
            <Button size="sm" className="h-9 w-9 p-0" disabled={!input.trim()} onClick={() => { sendWa(activeContact, input); setInput(""); }}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
        {[
          { label: "Pesan Terkirim", value: "1,247", change: "+12%" },
          { label: "Follow-up WA", value: "89", change: "+5%" },
          { label: "Auto-Reply", value: "456", change: "+23%" },
          { label: "Conversion Rate", value: "68%", change: "+8%" },
        ].map((stat, idx) => (
          <div key={idx} className="glass-card rounded-xl p-3 text-center">
            <div className="text-lg font-extrabold text-foreground font-display">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
            <div className="text-xs text-emerald-400 font-semibold">{stat.change}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
