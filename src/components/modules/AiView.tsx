"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, Bot, User } from "lucide-react";

export function AiView() {
  const { showToast } = useApp();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: "ai" | "user"; text: string; time: string }>>([
    {
      sender: "ai",
      text: "👋 Halo Anisa! Saya **Event AI Copilot** Anda yang terhubung secara native dengan database 15 modul Vendor Event OS. Saya dapat merancang rundown dalam hitungan detik, menganalisis vendor mana yang sering terlambat loading, atau menyusun estimasi penawaran paket pernikahan. Apa yang ingin Anda buat hari ini?",
      time: "10.00 WIB",
    },
  ]);

  const handleSend = (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " WIB",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput("");

    // Simulate AI Copilot intelligent response
    setTimeout(() => {
      let aiReply = "";
      const lower = textToSend.toLowerCase();

      if (lower.includes("rundown") || lower.includes("7 pagi") || lower.includes("jam 7")) {
        aiReply = `✅ **Rundown Pernikahan Jam 07.00 Pagi Berhasil Disusun:**\n` +
          `• **05.00 - 06.30 WIB (90 mnt):** Persiapan MUA & Fitting Busana Akad (PIC: Tim MUA di Bridal Suite)\n` +
          `• **06.30 - 07.00 WIB (30 mnt):** Sesi Foto Morning & Family First Look (PIC: Lumiere Photo)\n` +
          `• **07.00 - 08.30 WIB (90 mnt):** Prosesi Akad Nikah & Ijab Kabul (PIC: Penghulu, MC & Tim Sound)\n` +
          `• **08.30 - 09.30 WIB (60 mnt):** Sungkeman & Persiapan Resepsi Siang\n` +
          `• **09.30 - 12.30 WIB (180 mnt):** Resepsi Sesi 1, Grand Entrance & Lunch Ramah Tamah\n\n` +
          `*💡 Catatan AI:* Susunan ini telah disalin dan disinkronkan ke Modul 8 (Rundown Builder) Anda!`;
      } else if (lower.includes("telat") || lower.includes("vendor") || lower.includes("foto")) {
        aiReply = `📊 **Analisis Kinerja & Keandalan Vendor Fotografi:**\n` +
          `Berdasarkan log historis absensi dan checklist pada 120+ event di database Modul 3:\n` +
          `1. 🏆 **Lumiere Photography:** SLA Kedatangan **99.2% Tepat Waktu** (Rata-rata tiba 45 menit sebelum jadwal loading).\n` +
          `2. ⚠️ **Studio X Photo:** SLA Kedatangan **82.0%** (Tercatat 3 kali terlambat pada acara pagi hari bulan lalu).\n\n` +
          `*💡 Rekomendasi AI:* Untuk acara Akad Nikah jam 07.00 pagi yang ketat waktu, sangat disarankan menugaskan **Lumiere Photography**.`;
      } else if (lower.includes("quotation") || lower.includes("silver") || lower.includes("paket")) {
        aiReply = `📝 **Draf Penawaran Paket Silver (500 Pax Indoor) Berhasil Diracik:**\n` +
          `• **Harga Jual Klien (Contract Value):** Rp 120.000.000\n` +
          `• **Total Biaya Vendor Mitra (HPP):** Rp 82.000.000\n` +
          `• **Biaya Operasional WO:** Rp 8.000.000\n` +
          `• **Laba Bersih Proyek:** Rp 30.000.000 *(Margin Bersih: 25.0%)*\n\n` +
          `*💡 Status:* Penawaran ini memenuhi target margin minimal perusahaan Anda (≥ 20%). Magic link siap dikirim ke WhatsApp klien!`;
      } else {
        aiReply = `🤖 Saya telah memproses perintah Anda: *"__${textToSend}__"*. Sistem secara otomatis mengevaluasi relasi data di PostgreSQL (tenant database) dan menyusun draf operasional yang relevan. Apakah ada penyesuaian anggaran atau vendor tertentu yang ingin ditambahkan?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " WIB",
        },
      ]);
      showToast("✨ AI Copilot merespons dengan analisis berbasis data operasional nyata.");
    }, 700);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Modul 12: Generative AI Assistant (Event Copilot) ✨
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Kecerdasan buatan generatif yang memahami bahasa alami untuk membuat rundown instan, menyusun quotation, dan mengevaluasi keandalan vendor.
        </p>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => handleSend("Buat rundown wedding jam 7 pagi dengan akad dan resepsi siang.")}
          className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-500/20 transition-all flex items-center gap-1.5 shadow-sm"
        >
          💡 &ldquo;Buat rundown wedding jam 7 pagi&rdquo;
        </button>
        <button
          onClick={() => handleSend("Vendor foto mana di database yang sering telat atau SLA di bawah standar?")}
          className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold hover:bg-indigo-500/20 transition-all flex items-center gap-1.5 shadow-sm"
        >
          💡 &ldquo;Vendor foto mana yang sering telat?&rdquo;
        </button>
        <button
          onClick={() => handleSend("Buatkan rancangan penawaran paket Silver 500 pax dengan margin keuntungan minimal 25%.")}
          className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/20 transition-all flex items-center gap-1.5 shadow-sm"
        >
          💡 &ldquo;Buat quotation paket Silver 500 pax&rdquo;
        </button>
      </div>

      {/* Chat Container */}
      <Card className="border-slate-800 bg-slate-900/90 flex flex-col h-[520px]">
        <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-white">Event AI Copilot Engine (v2.4)</CardTitle>
              <div className="text-[11px] text-emerald-400">Terhubung ke 15 Modul & Database PostgreSQL</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs ${
                  msg.sender === "user" ? "bg-indigo-600" : "bg-purple-600"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-md"
                    : "bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none shadow-md whitespace-pre-line"
                }`}
              >
                {msg.text}
                <div className={`text-[10px] mt-2 ${msg.sender === "user" ? "text-indigo-200" : "text-slate-500"}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </CardContent>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2 flex-shrink-0">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Tanya AI: Misal 'Buat rundown jam 8' atau 'Siapa vendor dekorasi terbaik'..."
            className="flex-1 bg-slate-900 border-slate-800"
          />
          <Button
            onClick={() => handleSend()}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-5 h-10 gap-1.5"
          >
            <span>Kirim</span>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
