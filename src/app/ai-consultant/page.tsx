"use client";
import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Star, StarHalf, ThumbsUp, Camera, CheckCircle2, XCircle, MessageSquare, Send, Sparkles, Heart, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const quickQuestions = [
  "Rekomendasi vendor fotografi murah",
  "Budget untuk 500 tamu",
  "Ceklis pernikahan 3 bulan",
];

const keywordResponses: Record<string, string> = {
  fotografi: "Tips vendor fotografi murah:\n1. Pilih paket dasar tanpa album cetak (hemat 30-40%)\n2. Cari vendor di luar kota besar (ongkir mungkin lebih murah)\n3. Booking di hari kerja (weekday) dapat diskon 15-25%\n4. Paket half-day (6 jam) sudah cukup untuk akad + resepsi\nRekomendasi budget: Rp 3-8 juta untuk hasil profesional.",
  budget: "Estimasi budget pernikahan 500 tamu:\n• Venue & Dekorasi: Rp 80-150 juta\n• Katering (500 pax x Rp 150rb): Rp 75 juta\n• Fotografi & Video: Rp 10-20 juta\n• Makeup & Busana: Rp 15-30 juta\n• Hiburan (band/MC): Rp 10-20 juta\n• Dokumentasi tambahan: Rp 5-10 juta\nTotal estimasi: Rp 195-305 juta\n*Sesuaikan dengan prioritas dan negosiasi vendor.",
  ceklis: "Ceklis H-3 bulan sebelum nikah:\n✅ Tentukan tanggal dan venue (WAJIB)\n✅ Booking vendor utama: foto, dekorasi, catering\n✅ Pilih busana pengantin (sewa/beli)\n✅ Tentukan konsep & tema acara\n✅ Buat daftar tamu awal\n✅ Atur budget detail per item\n✅ Cek dokumen: KTP, akta cerai (jika ada), surat nikah\n✅ Survey lokasi venue & hotel untuk keluarga\n✅ Booking MUA untuk trial makeup",
  vendor: "Tips memilih vendor pernikahan:\n1. Cek portofolio 3-5 event terakhir\n2. Baca review dari pasangan sebelumnya\n3. Bandingkan minimal 3 vendor sebelum decide\n4. Pastikan kontrak jelas (termasuk cancellation policy)\n5. Cek SLA ketepatan waktu vendor\nGunakan fitur Wishlist di EventOS untuk menyimpan vendor favorit!",
  dekorasi: "Tips dekorasi pernikahan:\n• Tentukan tema (rustic, modern, tradisional) sebelum survey\n• Konsultasi dengan WO untuk sesuaikan budget\n• Bunga musiman lebih murah 20-40% dari bunga import\n• Sewa properti dekorasi bisa hemat 50% dari beli baru\n• Lighting sangat mempengaruhi suasana — jangan skip!",
  catering: "Tips katering pernikahan:\n• Rata-rata budget katering: Rp 100-200rb/pax\n• Food tasting wajib sebelum booking\n• Minta opsi menu untuk tamu vegetarian\n• Tambah standing snack untuk hemat tempat duduk\n• Negosiasi biaya transport jika venue jauh",
  musik: "Tips hiburan pernikahan:\n• Band live: Rp 10-25 juta (termasuk sound system)\n• DJ lebih hemat: Rp 5-10 juta\n• Acoustic duo cocok untuk resepsi intim\n• Cek playlist request — pastikan lagu favorit Anda ada\n• Sewa sound system sendiri jika venue tidak termasuk",
  bulan_3: "H-3 bulan:\n✅ Booking vendor utama\n✅ Pilih konsep & tema\n✅ Buat daftar tamu awal\n✅ Ceklis dokumen pernikahan",
  bulan_2: "H-2 bulan:\n✅ Finalisasi daftar tamu\n✅ Kirim undangan (digital/cetak)\n✅ Fitting baju pengantin\n✅ Rapat koordinasi dengan WO",
  bulan_1: "H-1 bulan:\n✅ Konfirmasi ulang semua vendor\n✅ Atur schedule acara (rundown)\n✅ Packing barang untuk acara\n✅ Istirahat cukup dan manajemen stress!",
};

function findResponse(userInput: string): string {
  const lower = userInput.toLowerCase();

  for (const [keyword, response] of Object.entries(keywordResponses)) {
    if (lower.includes(keyword)) {
      if (typeof response === "string") return response;
    }
  }

  // Check for bulan keyword with number
  const bulanMatch = lower.match(/(\d+)\s*bulan/);
  if (bulanMatch) {
    const key = `bulan_${bulanMatch[1]}` as string;
    if (keywordResponses[key]) return keywordResponses[key];
  }

  return "Terima kasih sudah bertanya! 😊 Saya Hilda, asisten AI pernikahan Anda. Coba tanya:\n• Rekomendasi vendor fotografi murah\n• Budget untuk 500 tamu\n• Ceklis pernikahan 3 bulan\nAtau seputar: dekorasi, catering, musik, vendor, dan tips pernikahan lainnya.";
}

export default function AiConsultantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Halo! 👋 Saya Hilda, konsultan pernikahan AI. Ada yang bisa saya bantu?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addMessage = (text: string, role: "user" | "assistant") => {
    setMessages((prev) => [...prev, { role, text }]);
  };

  const handleSend = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput("");
    addMessage(msg, "user");
    setIsTyping(true);

    // Simulate AI typing delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 800));

    const response = findResponse(msg);
    addMessage(response, "assistant");
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-sm font-bold text-white">Hilda — Konsultan Pernikahan AI</h1>
            <p className="text-[10px] text-slate-400">Asisten virtual perencanaan pernikahan</p>
          </div>
          <Heart className="w-4 h-4 text-pink-400" />
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line leading-relaxed",
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-md"
                  : "bg-slate-800/80 text-slate-200 rounded-bl-md border border-slate-700/50"
              )}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="max-w-3xl mx-auto w-full px-4 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={isTyping}
              className="shrink-0 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700 transition-colors disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanya Hilda tentang pernikahan..."
            className="bg-slate-950 border-slate-800 flex-1"
            disabled={isTyping}
          />
          <Button
            size="sm"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="bg-indigo-600 hover:bg-indigo-500 h-10 w-10 p-0 shrink-0"
          >
            {isTyping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
