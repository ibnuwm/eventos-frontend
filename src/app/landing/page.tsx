"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Star, ArrowRight, Sparkles, Users, CheckCircle2,
  FileSpreadsheet, ShoppingBag, Zap, Shield, Smartphone,
  Clock, Briefcase, Wallet, HeadphonesIcon, Play, ChevronRight,
  Quote, Menu, X, Infinity, Layers, BarChart3
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const stats = [
  { label: "Vendor Terverifikasi", value: "12.000+" },
  { label: "Event Terselenggara", value: "5.000+" },
  { label: "WO/EO Aktif", value: "2.500+" },
  { label: "Rata-rata Margin", value: "28%" },
];

const howItWorks = [
  { step: "1", title: "Daftar & Setup Profil", desc: "Buat akun gratis, isi profil bisnis, dan undang tim dalam 5 menit." },
  { step: "2", title: "Kelola Prospek & Proyek", desc: "CRM otomatis follow-up WA, quotation drag-drop, rundown builder, semua terpusat." },
  { step: "3", title: "Kolaborasi & Cairkan Dana", desc: "Vendor, klien, dan tim dalam satu platform. Terima pembayaran via QRIS/transfer." },
];

const features = [
  {
    icon: Users, title: "CRM dengan WhatsApp Auto", desc: "Capture leads dari Instagram/Ads, kirim follow-up otomatis, lacak closing probability real-time.",
    gradient: "from-blue-500/10 to-transparent", color: "text-blue-400",
    stat: "Rata-rata closing 3x lebih cepat",
  },
  {
    icon: FileSpreadsheet, title: "Quotation Drag & Drop", desc: "Buat penawaran dengan drag-drop modul. Export PDF, kirim via WhatsApp, approval online.",
    gradient: "from-brand-500/10 to-transparent", color: "text-brand-400",
    stat: "Hemat 2 jam per penawaran",
  },
  {
    icon: Clock, title: "Rundown StageCommand", desc: "Atur jadwal menit-per-menit. GO CUE broadcast ke seluruh HP kru serentak via WebSocket.",
    gradient: "from-amber-500/10 to-transparent", color: "text-amber-400",
    stat: "Zero miss communication",
  },
  {
    icon: Wallet, title: "Budget Engine + PayLater", desc: "Simulasi margin real-time. Butuh dana talangan? PayLater cair 15 menit dengan jaminan escrow.",
    gradient: "from-emerald-500/10 to-transparent", color: "text-emerald-400",
    stat: "Modal kerja instan 0% bunga",
  },
  {
    icon: ShoppingBag, title: "Marketplace + Anti-Scam", desc: "Temukan vendor dengan rating SLA real-time. AI verifikasi portofolio & NPWP — bebas vendor fiktif.",
    gradient: "from-purple-500/10 to-transparent", color: "text-purple-400",
    stat: "100% vendor terverifikasi",
  },
  {
    icon: Sparkles, title: "AI Copilot Terintegrasi", desc: "Generate rundown otomatis, analisa vendor, ringkasan kontrak, & deteksi risiko proyek.",
    gradient: "from-pink-500/10 to-transparent", color: "text-pink-400",
    stat: "Efisiensi tim hingga 40%",
  },
];

const testimonials = [
  { quote: "Dulu saya pakai Excel, WA grup, dan buku catatan. Sekarang semua dalam satu dashboard. Closing rate naik 60% dalam 3 bulan.", name: "Sari Dewi", role: "Pemilik, Dream Wedding Organizer", city: "Jakarta", rating: 5 },
  { quote: "Fitur PayLater jadi penyelamat. Saya bisa bayar DP vendor dulu tanpa pakai uang pribadi. Cair 15 menit beneran!", name: "Rudi Hartono", role: "CEO, Grand Palace Event", city: "Surabaya", rating: 5 },
  { quote: "StageCommand CUE bikin kru nggak bingung lagi. Tinggal tekan GO, semua HP getar. Client puas, acara lancar.", name: "Maya Putri", role: "Lead Coordinator, Floral Bliss", city: "Bandung", rating: 5 },
];

const plans = [
  {
    name: "Starter", price: "Gratis", period: "selamanya", desc: "Coba semua fitur dasar",
    features: ["1 Event aktif", "CRM + WA follow-up", "Quotation builder", "Dashboard dasar", "Marketplace akses"],
    cta: "Daftar Gratis", popular: false,
  },
  {
    name: "Pro", price: "Rp 149rb", period: "/bulan", desc: "Untuk WO dengan 3-5 event/bulan",
    features: ["5 Event aktif", "Semua fitur Starter", "Rundown + StageCommand", "Budget engine + PayLater", "AI Copilot", "Client portal", "Priority support"],
    cta: "Mulai Trial 7 Hari", popular: true,
  },
  {
    name: "Business", price: "Rp 399rb", period: "/bulan", desc: "Untuk EO dengan tim & banyak event",
    features: ["Unlimited event", "Semua fitur Pro", "Multi-user (10 tim)", "API akses + webhook", "White-label portal", "Dedicated account manager", "Custom integration"],
    cta: "Hubungi Sales", popular: false,
  },
];

const faqs = [
  { q: "Apakah EventOS gratis?", a: "Ya! Starter plan gratis selamanya dengan 1 event aktif, CRM, quotation builder, dan akses marketplace. Upgrade kapan saja sesuai kebutuhan." },
  { q: "Bagaimana cara mulai?", a: "Daftar gratis (tidak perlu kartu kredit), isi profil bisnis, dan langsung bisa kelola proyek pertama. Ada onboarding interaktif yang memandu langkah demi langkah." },
  { q: "Apakah data saya aman?", a: "Kami menggunakan enkripsi SSL 256-bit, server tersertifikasi ISO 27001, dan backup harian. Data klien & vendor Anda sepenuhnya milik Anda." },
  { q: "Bisa integrasi dengan WhatsApp?", a: "Tentu! WhatsApp adalah kanal komunikasi utama di EventOS. Follow-up otomatis, notifikasi, approval, dan pengiriman dokumen — semua via WhatsApp tanpa instalasi tambahan." },
  { q: "Apakah ada biaya tersembunyi?", a: "Tidak ada. Harga transparan tanpa biaya setup, tanpa biaya tersembunyi. Anda bisa cancel kapan saja." },
  { q: "Bagaimana dengan vendor di luar platform?", a: "Anda bisa mengundang vendor eksternal ke proyek. Mereka akan mendapat akses terbatas ke chat, task, dan dokumen yang relevan — gratis." },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}`} />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [email, setEmail] = React.useState("");
  const [mobileMenu, setMobileMenu] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-card/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center font-bold text-white shadow-md shadow-brand-500/30">
              OS
            </div>
            <span className="font-display font-bold text-base text-foreground tracking-tight">EventOS.id</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {["Fitur", "Cara Kerja", "Harga", "FAQ"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, "-")}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-sm hidden sm:flex">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="font-semibold text-sm shadow-lg shadow-brand-500/25">
                Daftar Gratis
              </Button>
            </Link>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-xl hover:bg-muted text-muted-foreground">
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden border-t border-border/60 bg-card p-4 space-y-2">
            {["Fitur", "Cara Kerja", "Harga", "FAQ"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, "-")}`} onClick={() => setMobileMenu(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                {item}
              </a>
            ))}
            <Link href="/register" onClick={() => setMobileMenu(false)}>
              <Button className="w-full mt-2 font-semibold">Daftar Gratis</Button>
            </Link>
          </motion.div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 via-purple-500/10 to-background" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-brand-500/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[100px]" />
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Badge className="bg-brand-500/15 text-brand-600 dark:text-brand-400 border-brand-500/30 font-bold text-sm px-4 py-1.5">
                  <Zap className="w-4 h-4 mr-1.5" /> #1 Sistem Operasi Event Indonesia
                </Badge>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight font-display"
              >
                Kelola Event & Wedding dari Prospek ke{" "}
                <span className="gradient-text">Pembayaran</span>
                {" "}dalam Satu Platform
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-lg text-muted-foreground max-w-xl leading-relaxed"
              >
                CRM dengan follow-up WhatsApp otomatis, quotation drag-drop, rundown dengan StageCommand, marketplace vendor anti-scam, dan AI Copilot — khusus untuk WO/EO Indonesia.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-3 pt-2"
              >
                <Link href="/register">
                  <Button size="lg" className="font-bold text-base px-8 gap-2 shadow-lg shadow-brand-500/30 w-full sm:w-auto">
                    <Sparkles className="w-5 h-5" /> Coba Gratis
                  </Button>
                </Link>
                <Link href="#fitur">
                  <Button size="lg" variant="outline" className="font-bold text-base px-8 gap-2 w-full sm:w-auto">
                    Lihat Demo <Play className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-muted-foreground flex items-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Gratis selamanya • No card required • 5 menit setup
              </motion.p>

              {/* Lead capture mini */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex items-center gap-2 max-w-md"
              >
                <Input
                  type="email"
                  placeholder="Masukkan email kamu..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background border-border/60"
                />
                <Button className="font-semibold gap-1 flex-shrink-0" onClick={() => {}}>
                  Daftar <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>

            {/* Right: Hero visual - Dashboard preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-2xl shadow-brand-500/10 overflow-hidden">
                <div className="p-1">
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/60">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                    <span className="text-xs text-muted-foreground ml-2 font-medium">EventOS.id — Dashboard</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-32 bg-muted/50 rounded" />
                      <div className="flex gap-2">
                        <div className="h-6 w-16 bg-brand-500/15 rounded-lg" />
                        <div className="h-6 w-16 bg-emerald-500/15 rounded-lg" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[60, 40, 80].map((w, i) => (
                        <div key={i} className="h-16 rounded-xl bg-muted/30 border border-border/60 p-2 space-y-1.5">
                          <div className="h-2 w-12 bg-muted/50 rounded" />
                          <div className="h-4 w-full bg-gradient-to-r from-brand-500/30 to-emerald-500/30 rounded" />
                        </div>
                      ))}
                    </div>
                    <div className="h-32 rounded-xl bg-muted/20 border border-border/60" />
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-24 bg-muted/40 rounded" />
                      <div className="h-6 w-20 bg-brand-500/20 rounded-lg flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                        <span className="text-[10px] font-bold text-brand-400">Live</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/30">
                <Zap className="w-3 h-3 inline mr-1" /> Akses Sekarang
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} className="text-center"
              >
                <div className="text-2xl md:text-3xl font-extrabold text-foreground font-display">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="cara-kerja" className="max-w-7xl mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
          <Badge className="mb-3 bg-brand-500/15 text-brand-600 dark:text-brand-400 border-brand-500/30">Cara Kerja</Badge>
          <h2 className="text-3xl font-bold text-foreground font-display">Mulai dalam 3 Langkah Sederhana</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Dari daftar hingga proyek pertama berjalan, tidak sampai 15 menit.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howItWorks.map((item, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} className="relative"
            >
              <div className="glass-card rounded-xl p-6 border-border/60 h-full text-center">
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center mx-auto mb-4 text-white font-extrabold text-lg">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg text-foreground font-display">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
              </div>
              {i < howItWorks.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 text-muted-foreground/30">
                  <ChevronRight className="w-6 h-6" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="fitur" className="border-t border-border/60 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
            <Badge className="mb-3 bg-brand-500/15 text-brand-600 dark:text-brand-400 border-brand-500/30">Fitur Lengkap</Badge>
            <h2 className="text-3xl font-bold text-foreground font-display">Semua yang WO/EO Butuhkan dalam Satu Platform</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Fitur dirancang berdasarkan alur kerja nyata WO/EO Indonesia — dari leads hingga closing.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }} whileHover={{ y: -3 }}
                  className="glass-card rounded-xl border-border/60 p-5 relative overflow-hidden group h-full"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3 ${f.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-foreground font-display">{f.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.desc}</p>
                    <div className={`mt-3 text-xs font-semibold ${f.color} flex items-center gap-1`}>
                      <CheckCircle2 className="w-3 h-3" /> {f.stat}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
          <Badge className="mb-3 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">Testimonial</Badge>
          <h2 className="text-3xl font-bold text-foreground font-display">Dipercaya 2.500+ WO/EO di Indonesia</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Lihat apa kata mereka tentang pengalaman menggunakan EventOS.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-xl border-border/60 p-6 relative"
            >
              <Quote className="w-8 h-8 text-brand-500/20 absolute top-4 right-4" />
              <StarRating rating={t.rating} />
              <p className="text-sm text-foreground/90 mt-3 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 pt-4 border-t border-border/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role} • {t.city}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="harga" className="border-t border-border/60 bg-muted/10 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
            <Badge className="mb-3 bg-brand-500/15 text-brand-600 dark:text-brand-400 border-brand-500/30">Harga Transparan</Badge>
            <h2 className="text-3xl font-bold text-foreground font-display">Pilih Paket yang Sesuai</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Mulai gratis, upgrade kapan saja. Tidak ada biaya tersembunyi.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-2xl border ${plan.popular ? "border-brand-500/40 shadow-xl shadow-brand-500/10" : "border-border/60"} bg-card p-6 flex flex-col`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    <Zap className="w-3 h-3 inline mr-1" /> Paling Populer
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="font-bold text-lg text-foreground font-display">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.desc}</p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-foreground font-display">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link href="/register">
                    <Button
                      className={`w-full font-semibold ${plan.popular ? "shadow-lg shadow-brand-500/25" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="max-w-7xl mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
          <Badge className="mb-3 bg-brand-500/15 text-brand-600 dark:text-brand-400 border-brand-500/30">FAQ</Badge>
          <h2 className="text-3xl font-bold text-foreground font-display">Pertanyaan Umum</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Jawaban cepat untuk pertanyaan yang sering diajukan.</p>
        </motion.div>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group rounded-xl border border-border/60 bg-card/50 open:bg-card open:border-brand-500/30 transition-all">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-foreground list-none">
                {faq.q}
                <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform flex-shrink-0" />
              </summary>
              <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/60 pt-3">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="border-t border-border/60 bg-muted/20 py-20">
        <div className="max-w-3xl mx-auto text-center px-4 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <Badge className="mb-3 bg-brand-500/15 text-brand-600 dark:text-brand-400 border-brand-500/30">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Mulai Sekarang
            </Badge>
            <h2 className="text-3xl font-bold text-foreground font-display">Siap Bawa Bisnis Eventmu ke Level Selanjutnya?</h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto leading-relaxed">
              Bergabung dengan 2.500+ WO/EO di Indonesia yang sudah beralih ke EventOS. Gratis selamanya, upgrade kapan saja.
            </p>
          </motion.div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Masukkan email kamu..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-border/60"
            />
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="font-bold gap-2 shadow-lg shadow-brand-500/25 w-full sm:w-auto">
                Daftar Gratis <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Gratis selamanya • No card required • Batalkan kapan saja
          </p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border/60 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center font-bold text-white text-xs">OS</div>
                <span className="font-display font-bold text-foreground">EventOS.id</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                Sistem operasi event & wedding all-in-one untuk WO/EO Indonesia. Dari CRM, vendor, proyek, hingga pembayaran.
              </p>
            </div>
            {[
              { title: "Produk", links: [
                { label: "Fitur", href: "/#fitur" },
                { label: "Harga", href: "/#harga" },
                { label: "Cara Kerja", href: "/#cara-kerja" },
                { label: "FAQ", href: "/#faq" },
              ]},
              { title: "Perusahaan", links: [
                { label: "Tentang", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Karir", href: "/careers" },
                { label: "Kontak", href: "/contact" },
              ]},
              { title: "Dukungan", links: [
                { label: "Pusat Bantuan", href: "/help" },
                { label: "API Docs", href: "/help" },
                { label: "Status", href: "/status" },
                { label: "Keamanan", href: "/security" },
              ]},
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-bold text-sm text-foreground mb-3">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href={link.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border/60 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <span>&copy; 2026 EventOS.id — Vendor Event Operating System. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a href="/privacy" className="hover:text-foreground transition-colors">Kebijakan Privasi</a>
              <a href="/terms" className="hover:text-foreground transition-colors">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
