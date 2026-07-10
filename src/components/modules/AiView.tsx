"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, Bot, User, Zap, Clock, FileText, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AiView() {
  const { showToast } = useApp();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: "ai" | "user"; text: string; time: string }>>([
    {
      sender: "ai",
      text: "Halo Anisa! Saya **Event AI Copilot** Anda. Saya dapat:\n- Membuat rundown instan\n- Menganalisis vendor & SLA\n- Menyusun quotation\n\nAda yang bisa saya bantu?",
      time: "10.00 WIB",
    },
  ]);

  const handleSend = (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim()) return;

    const userMsg = { sender: "user" as const, text: textToSend, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " WIB" };
    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput("");

    setTimeout(() => {
      let aiReply = "";
      const lower = textToSend.toLowerCase();

      if (lower.includes("rundown") || lower.includes("7 pagi")) {
        aiReply = `**Rundown Wedding Jam 07.00 Pagi:**\n` +
          `• **05.00 - 06.30** — Persiapan MUA & Fitting (PIC: Tim MUA)\n` +
          `• **06.30 - 07.00** — Sesi Foto Morning (PIC: Lumiere Photo)\n` +
          `• **07.00 - 08.30** — Prosesi Akad Nikah (PIC: Penghulu, MC, Sound)\n` +
          `• **08.30 - 09.30** — Sungkeman & Persiapan Resepsi\n` +
          `• **09.30 - 12.30** — Resepsi & Grand Entrance\n\n` +
          `*Tersinkronisasi ke Modul Rundown Builder.*`;
      } else if (lower.includes("vendor") || lower.includes("telat")) {
        aiReply = `**Analisis Vendor:**\n` +
          `1. **Lumiere Photography** — SLA 99.2% (Sangat Baik)\n` +
          `2. **Grand Rose Decor** — SLA 97.5% (Baik)\n` +
          `3. **ProSound** — SLA 98.0% (Baik)\n\n` +
          `*Rekomendasi: Gunakan Lumiere untuk acara pagi yang ketat.*`;
      } else {
        aiReply = `Saya telah memproses perintah Anda. Data operasional telah dievaluasi dan draf siap. Apakah ada penyesuaian yang diperlukan?`;
      }

      setMessages((prev) => [...prev, {
        sender: "ai",
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " WIB",
      }]);
      showToast("AI Copilot merespons");
    }, 700);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          AI Assistant (Event Copilot)
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Kecerdasan buatan untuk rundown instan, analisa vendor, dan quotation.
        </p>
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { label: "Buat rundown jam 7 pagi", icon: Clock, prompt: "Buat rundown wedding jam 7 pagi dengan akad dan resepsi siang." },
          { label: "Analisa vendor foto", icon: Search, prompt: "Vendor foto mana di database yang sering telat?" },
          { label: "Buat quotation", icon: FileText, prompt: "Buatkan rancangan penawaran paket Silver 500 pax." },
        ].map((btn, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(btn.prompt)}
            className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-500/20 transition-all flex items-center gap-1.5"
          >
            <btn.icon className="w-3 h-3" />
            {btn.label}
          </button>
        ))}
      </div>

      {/* Chat */}
      <Card className="glass-card border-border/60 flex flex-col h-[520px]">
        <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-foreground">Event AI Copilot</CardTitle>
              <div className="text-xs text-emerald-400">Terhubung ke 15 Modul Database</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs ${msg.sender === "user" ? "bg-brand-500" : "bg-purple-600"}`}>
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-brand-500 text-white rounded-tr-none shadow-md"
                    : "bg-muted/50 border border-border/60 text-foreground rounded-tl-none shadow-md"
                }`}>
                  {msg.text}
                  <div className={`text-xs mt-2 ${msg.sender === "user" ? "text-brand-200" : "text-muted-foreground"}`}>
                    {msg.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>

        <div className="p-3 border-t border-border/60 bg-muted/20 flex items-center gap-2 flex-shrink-0">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Tanya AI: 'Buat rundown jam 8'..."
            className="flex-1 bg-muted border-border/60"
          />
          <Button
            onClick={() => handleSend()}
            className="gradient-brand hover:opacity-90 text-white font-bold px-5 h-10 gap-1.5"
          >
            <span>Kirim</span>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
