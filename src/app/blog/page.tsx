"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Sparkles, ShoppingBag, Users, CheckCircle2 } from "lucide-react";

const posts = [
  { slug: "tips-memilih-wedding-organizer", title: "7 Tips Memilih Wedding Organizer Terbaik di Jakarta 2026", date: "5 Juli 2026", category: "Wedding Tips", excerpt: "Tidak semua WO cocok untuk setiap pernikahan. Simak 7 tips ini sebelum Anda memutuskan untuk menggunakan jasa wedding organizer favorit Anda.", image: "💍" },
  { slug: "cara-membuat-quotation-event-profesional", title: "Cara Membuat Quotation Event Profesional yang Disukai Klien", date: "28 Juni 2026", category: "Bisnis Event", excerpt: "Quotation adalah gerbang utama mendapat klien. Pelajari struktur penawaran yang membuat klien langsung yakin.", image: "📄" },
  { slug: "vendor-management-tips", title: "Tips Manajemen Vendor Event: Dari Kontrak hingga Evaluasi", date: "15 Juni 2026", category: "Manajemen", excerpt: "Mengelola 10+ vendor untuk satu acara bukan hal mudah. Gunakan sistem digital untuk tracking SLA, budget, dan timeline.", image: "🤝" },
  { slug: "ai-untuk-event-organizer", title: "AI untuk Event Organizer: Cara Kerja AI Copilot di EventOS", date: "1 Juni 2026", category: "Teknologi", excerpt: "AI Copilot bisa membantu generate rundown, analisa vendor, dan menjawab pertanyaan dari knowledge base kontrak secara instan.", image: "🤖" },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-3">
          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 font-bold">Blog EventOS</Badge>
          <h1 className="text-3xl font-bold text-white">Tips & Panduan Event</h1>
          <p className="text-slate-400">Artikel seputar wedding, event management, dan teknologi untuk WO/EO Indonesia.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <a key={post.slug} href={`/blog/${post.slug}`} className="group">
              <Card className="border-slate-800 bg-slate-900 hover:border-indigo-500/40 transition-all h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="info" className="text-[10px]">{post.category}</Badge>
                    <span className="text-[10px] text-slate-500">{post.date}</span>
                  </div>
                  <div className="text-3xl mb-2">{post.image}</div>
                  <CardTitle className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-400">
                  <p>{post.excerpt}</p>
                  <div className="flex items-center gap-1 text-indigo-400 font-semibold mt-3 text-xs">
                    Baca Selengkapnya <ArrowRight className="w-3 h-3" />
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
        <div className="text-center text-xs text-slate-500 pb-8">EventOS.id Blog &copy; 2026</div>
      </div>
    </div>
  );
}
