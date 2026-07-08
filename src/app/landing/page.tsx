"use client";

import React, { useEffect, useState } from "react";
import { fetchStorefrontVendors } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, MapPin, ArrowRight, Sparkles, Users, CheckCircle2, FileSpreadsheet, ShoppingBag } from "lucide-react";

interface StoreVendor {
  id: string; name: string; category: string; rating: number;
  sla_punctuality: number; starting_price: number; area: string; pic_name: string;
}

export default function LandingPage() {
  const [vendors, setVendors] = useState<StoreVendor[]>([]);

  useEffect(() => {
    fetchStorefrontVendors().then((res) => { if (res?.data) setVendors(res.data.slice(0, 4)); });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-950" />
        <div className="max-w-6xl mx-auto px-4 py-20 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 font-bold text-sm px-4 py-1">
              🚀 All-in-One EventOS Platform
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              Kelola Event & Temukan Vendor<br />
              <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">dalam Satu Ekosistem</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Dari CRM, project management, quotation, hingga marketplace vendor — platform operasi bisnis event terlengkap untuk WO/EO Indonesia.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <a href="/storefront">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 font-bold text-base px-8 gap-2">
                  <ShoppingBag className="w-5 h-5" /> Jelajahi Vendor
                </Button>
              </a>
              <a href="/">
                <Button size="lg" variant="outline" className="font-bold text-base px-8 gap-2">
                  Buka Dashboard <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white text-center mb-10">Fitur Unggulan EventOS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Users, title: "CRM & Pipeline", desc: "Kelola leads, follow-up otomatis via WhatsApp, dan tracking closing probability." },
            { icon: FileSpreadsheet, title: "Quotation Builder", desc: "Buat penawaran interaktif dengan drag-drop modul, export PDF, dan kirim via WA." },
            { icon: CheckCircle2, title: "Client Portal", desc: "Portal persetujuan digital untuk klien — setujui layout, rundown, dan invoice online." },
            { icon: Clock, title: "Rundown Builder", desc: "Jadwal menit-per-menit dengan auto time-shift. Siap untuk D-Day." },
            { icon: Sparkles, title: "AI Copilot", desc: "AI generator untuk rundown, analisa vendor, dan knowledge base kontrak." },
            { icon: ShoppingBag, title: "Marketplace Vendor", desc: "Temukan vendor dengan rating SLA real-time dan harga transparan." },
          ].map((f, i) => (
            <Card key={i} className="border-slate-800 bg-slate-900/80 hover:border-indigo-500/40 transition-all">
              <CardContent className="p-6 space-y-3">
                <f.icon className="w-8 h-8 text-indigo-400" />
                <h3 className="font-bold text-white">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="max-w-6xl mx-auto px-4 py-16 border-t border-slate-800">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Vendor Terbaik</h2>
          <a href="/storefront"><Button variant="outline" size="sm" className="gap-2">Lihat Semua <ArrowRight className="w-4 h-4" /></Button></a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendors.map((v) => (
            <Card key={v.id} className="border-slate-800 bg-slate-900/90 hover:border-slate-700 transition-all">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="info" className="text-[10px]">{v.category}</Badge>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {v.rating}
                  </div>
                </div>
                <h3 className="font-bold text-white">{v.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400"><MapPin className="w-3.5 h-3.5" />{v.area}</div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3 text-emerald-400" /> SLA</span>
                    <span className="font-bold text-emerald-400">{v.sla_punctuality}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Mulai</span>
                  <span className="font-bold text-emerald-400">{formatRupiah(v.starting_price)}</span>
                </div>
                <a href={`/storefront/${v.id}`}><Button size="sm" className="w-full text-xs font-bold bg-indigo-600 hover:bg-indigo-500">Lihat Detail</Button></a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800 py-16">
        <div className="max-w-3xl mx-auto text-center px-4 space-y-6">
          <h2 className="text-2xl font-bold text-white">Siap Mengelola Event Lebih Profesional?</h2>
          <p className="text-slate-400">Platform all-in-one untuk WO/EO Indonesia. Dari leads hingga invoice, semua dalam satu dashboard.</p>
          <div className="flex items-center justify-center gap-4">
            <a href="/"><Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 font-bold gap-2">Buka Dashboard <ArrowRight className="w-5 h-5" /></Button></a>
            <a href="/storefront"><Button size="lg" variant="outline" className="font-bold">Jelajahi Vendor</Button></a>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        EventOS.id — Vendor Event Operating System &copy; 2026
      </footer>
    </div>
  );
}
