"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatDate } from "@/lib/utils";
import {
  TrendingUp, Users, CalendarCheck, AlertOctagon, ArrowUpRight, PlusCircle,
  DollarSign, PieChart, Activity, Target, Zap, ShoppingBag, FileSpreadsheet, CheckSquare, Calculator,
  Sparkles, PartyPopper, Lightbulb
} from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart,
  Pie, Cell, RadialBarChart, RadialBar, Legend
} from "recharts";
import { Celebration } from "@/components/shared/celebration";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
};

const chartVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } }
};

const revenueData = [
  { month: "Feb", revenue: 85000000, cost: 52000000, profit: 33000000 },
  { month: "Mar", revenue: 120000000, cost: 74000000, profit: 46000000 },
  { month: "Apr", revenue: 95000000, cost: 58000000, profit: 37000000 },
  { month: "Mei", revenue: 160000000, cost: 98000000, profit: 62000000 },
  { month: "Jun", revenue: 140000000, cost: 85000000, profit: 55000000 },
  { month: "Jul", revenue: 180000000, cost: 110000000, profit: 70000000 },
];

const budgetAllocation = [
  { name: "Vendor Cost", value: 62, color: "#6366f1" },
  { name: "Operational", value: 10, color: "#10b981" },
  { name: "Profit Margin", value: 28, color: "#f59e0b" },
];

const performanceData = [
  { name: "Photography", sla: 99, rating: 4.9, projects: 12 },
  { name: "Decoration", sla: 97, rating: 4.8, projects: 8 },
  { name: "Catering", sla: 100, rating: 4.9, projects: 15 },
  { name: "Sound", sla: 98, rating: 4.7, projects: 10 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border/60 rounded-xl p-3 shadow-xl text-xs space-y-1">
        <p className="font-bold text-foreground">{label}</p>
        {payload.map((entry: any, idx: number) => (
          <p key={idx} style={{ color: entry.color }}>
            {entry.name}: {formatRupiah(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface DashboardViewProps {
  onNavigate: (module: any) => void;
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  const { projects, leads, inventory, showToast } = useApp();
  const [celebrate, setCelebrate] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");

  const activeProjectsCount = projects.length;
  const totalContractValue = projects.reduce((acc, p) => acc + p.contractValue, 0);
  const totalProfitEstimate = projects.reduce((acc, p) => acc + (p.contractValue - p.vendorCost - p.operationalCost), 0);
  const avgMargin = totalContractValue > 0 ? ((totalProfitEstimate / totalContractValue) * 100).toFixed(1) : "0";
  const conflictingCount = inventory.filter((i) => i.hasConflict).length;

  const kpiCards = [
    {
      title: "Proyek Berjalan",
      value: `${activeProjectsCount} Proyek`,
      trend: "+2 dari bulan lalu",
      trendColor: "text-emerald-400",
      icon: CalendarCheck,
      iconColor: "text-brand-400",
      bgGradient: "from-brand-500/10 to-transparent",
    },
    {
      title: "Prospek CRM Aktif",
      value: `${leads.length} Leads`,
      trend: "2 menunggu follow-up",
      trendColor: "text-amber-400",
      icon: Users,
      iconColor: "text-blue-400",
      bgGradient: "from-blue-500/10 to-transparent",
    },
    {
      title: "Nilai Kontrak (GMV)",
      value: formatRupiah(totalContractValue),
      trend: `Rata-rata Margin: ${avgMargin}%`,
      trendColor: "text-emerald-400",
      icon: DollarSign,
      iconColor: "text-emerald-400",
      bgGradient: "from-emerald-500/10 to-transparent",
    },
    {
      title: "Alert Inventaris",
      value: `${conflictingCount} Bentrok`,
      trend: conflictingCount > 0 ? "Cek Kursi Tiffany 14 Agt" : "Aman terkendali",
      trendColor: conflictingCount > 0 ? "text-red-400" : "text-emerald-400",
      icon: AlertOctagon,
      iconColor: "text-red-400",
      bgGradient: "from-red-500/10 to-transparent",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-2xl gradient-brand/20 border border-brand-500/20 p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_50%)]" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <Badge className="mb-2 bg-brand-500/20 text-brand-300 border-brand-500/30">
                Sistem Operasi Event & Wedding
              </Badge>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight">
                Selamat Datang, Anisa! <span className="inline-block animate-wiggle">👋</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                Semua alur kerja dari prospek CRM WhatsApp, checklist tugas, pengesahan klien, hingga kalkulasi margin HPP tersinkronisasi secara langsung.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => onNavigate("quotation")}
                className="gap-2 font-semibold shadow-lg shadow-brand-500/25"
              >
                <PlusCircle className="w-4 h-4" />
                Buat Penawaran Baru
              </Button>
              <Button
                variant="outline"
                onClick={() => onNavigate("ai")}
                className="gap-2 border-purple-500/40 text-purple-400 hover:bg-purple-500/10"
              >
                <Zap className="w-4 h-4" />
                AI Copilot
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card rounded-xl p-5 relative overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${kpi.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-xs font-semibold uppercase text-muted-foreground flex items-center justify-between">
                      <span>{kpi.title}</span>
                      <Icon className={`w-4 h-4 ${kpi.iconColor}`} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="text-2xl lg:text-3xl font-extrabold text-foreground font-display tracking-tight">
                      {kpi.value}
                    </div>
                      <p className={`text-xs mt-1 flex items-center gap-1 font-medium ${kpi.trendColor}`}>
                      <TrendingUp className="w-3.5 h-3.5" /> {kpi.trend}
                    </p>
                  </CardContent>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Workflow Guide untuk Pemula */}
      <motion.div variants={itemVariants}>
        <div className="rounded-xl bg-gradient-to-r from-brand-500/5 via-purple-500/5 to-background border border-brand-500/20 p-5">
          <h3 className="font-bold text-foreground font-display text-sm flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-brand-400" />
            Mulai dari Mana? Ikuti Alur Ini
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { step: "1", label: "Kelola Prospek", desc: "Catat & follow-up calon klien", module: "crm", icon: Users, color: "text-blue-400" },
              { step: "2", label: "Buat Penawaran", desc: "Quotation & paket harga", module: "quotation", icon: FileSpreadsheet, color: "text-brand-400" },
              { step: "3", label: "Atur Proyek", desc: "Tugas, rundown, kru", module: "project", icon: CheckSquare, color: "text-amber-400" },
              { step: "4", label: "Pantau Anggaran", desc: "Margin & modal kerja", module: "budget", icon: Calculator, color: "text-emerald-400" },
              { step: "5", label: "Cari Vendor", desc: "Marketplace & inventaris", module: "marketplace", icon: ShoppingBag, color: "text-purple-400" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={idx}
                  whileHover={{ y: -3 }}
                  onClick={() => onNavigate(item.module)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border/60 hover:bg-card hover:border-brand-500/30 transition-all text-left"
                >
                  <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center font-extrabold text-sm ${item.color} flex-shrink-0`}>
                    {item.step}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <motion.div variants={chartVariants} className="lg:col-span-2">
          <Card className="glass-card border-border/60">
            <CardHeader className="pb-4 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-foreground font-display">
                    <TrendingUp className="w-4 h-4 inline mr-2 text-emerald-400" />
                    Tren Pendapatan 6 Bulan
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Revenue, biaya vendor, dan laba bersih</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  +32% YoY
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revenueGrad)" name="Revenue" />
                    <Area type="monotone" dataKey="cost" stroke="#f59e0b" strokeWidth={2} fill="none" strokeDasharray="4 4" name="Biaya Vendor" />
                    <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2.5} fill="url(#profitGrad)" name="Laba Bersih" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Budget Allocation Pie */}
        <motion.div variants={chartVariants}>
          <Card className="glass-card border-border/60 h-full">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-base font-bold text-foreground font-display">
                <PieChart className="w-4 h-4 inline mr-2 text-brand-400" />
                Alokasi Rata-rata Proyek
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex flex-col items-center justify-center h-[280px]">
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie
                    data={budgetAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={300}
                    animationDuration={1000}
                  >
                    {budgetAllocation.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) =>
                      active && payload && payload.length ? (
                        <div className="bg-card border border-border/60 rounded-xl p-2.5 text-xs shadow-xl">
                          <p style={{ color: payload[0].color }} className="font-bold">{payload[0].name}: {payload[0].value}%</p>
                        </div>
                      ) : null
                    }
                  />
                </RePieChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 text-xs mt-2">
                {budgetAllocation.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Bottom Section: Bento Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Projects Table — 7 cols */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="glass-card border-border/60 overflow-hidden h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/60 px-6">
              <div>
                <CardTitle className="text-base font-bold text-foreground font-display">
                  Status Proyek Berjalan
                </CardTitle>
                <p className="text-xs text-muted-foreground">Pantau progres checklist & jadwal hari H</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => onNavigate("project")}>
                Lihat Semua <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 text-xs font-semibold uppercase text-muted-foreground bg-muted/30">
                      <th className="p-4 pl-6">Proyek & Klien</th>
                      <th className="p-4">Tanggal</th>
                      <th className="p-4">Nilai</th>
                      <th className="p-4">Progres</th>
                      <th className="p-4 pr-6 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-sm">
                    {projects.map((proj, idx) => (
                      <motion.tr
                        key={proj.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="p-4 pl-6">
                          <div className="font-bold text-foreground">{proj.title}</div>
                          <div className="text-xs text-muted-foreground">{proj.clientName}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-foreground/80">{formatDate(proj.eventDate)}</div>
                          <Badge variant={proj.daysRemaining <= 40 ? "warning" : "info"} className="mt-1 text-xs">
                            T-{proj.daysRemaining} Hari
                          </Badge>
                        </td>
                        <td className="p-4 font-semibold text-emerald-400">
                          {formatRupiah(proj.contractValue)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-between text-xs font-semibold mb-1">
                            <span className="text-muted-foreground">{proj.progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${proj.progressPercentage}%` }}
                              transition={{ duration: 1, delay: idx * 0.1 }}
                              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-400"
                            />
                          </div>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-brand-400 hover:text-brand-300 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onNavigate("project")}
                          >
                            Detail <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column — 5 cols split into 3 stacked rows */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Insight Card */}
          <div className="rounded-xl bg-gradient-to-r from-purple-500/10 via-brand-500/10 to-transparent border border-brand-500/20 p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm text-foreground">Rekomendasi AI</div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Proyek "Grand Palace Wedding" butuh konfirmasi dekorasi. Disarankan hubungi Grand Rose Decor segera.
              </p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => onNavigate("marketplace")}>
                  <ShoppingBag className="w-3 h-3" /> Cari Vendor
                </Button>
                <Button size="sm" className="h-7 text-xs gap-1" onClick={() => onNavigate("chat")}>
                  Buka Chat
                </Button>
              </div>
            </div>
          </div>

          {/* Akses Cepat */}
          <Card className="glass-card border-border/60">
            <CardContent className="p-3 space-y-1.5">
              {[
                { label: "CRM Pipeline", desc: "Prospek & follow-up", module: "crm", icon: Users },
                { label: "Rundown Acara", desc: "Jadwal & Stage CUE", module: "rundown", icon: CheckSquare },
                { label: "Modal Kerja", desc: "PayLater 15 menit", module: "budget", icon: DollarSign },
                { label: "WhatsApp", desc: "Notifikasi otomatis", module: "wanative", icon: Zap },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ x: 3 }}
                    onClick={() => onNavigate(item.module)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/40 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/10 transition-colors">
                      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-brand-400 transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-foreground">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-brand-400 transition-colors flex-shrink-0" />
                  </motion.button>
                );
              })}
            </CardContent>
          </Card>

          {/* Vendor SLA Mini Chart */}
          <Card className="glass-card border-border/60">
            <CardHeader className="pb-2 border-b border-border/60 px-4 py-3">
              <CardTitle className="text-xs font-bold text-foreground font-display flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                Vendor SLA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="h-[90px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} layout="vertical" margin={{ left: -5, right: 5, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} horizontal={false} />
                    <XAxis type="number" domain={[90, 100]} tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip formatter={(value: any) => [`${value}%`, "SLA"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "11px" }} />
                    <Bar dataKey="sla" radius={[0, 3, 3, 0]} barSize={8}>
                      {performanceData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.sla >= 98 ? "#10b981" : entry.sla >= 95 ? "#f59e0b" : "#ef4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Celebration trigger */}
      {leads.some((l) => l.status === "won") && (
        <div className="hidden">
          <button onClick={() => { setCelebrationMessage("Selamat! Ada deal baru!"); setCelebrate(true); }} />
        </div>
      )}

      {/* Celebration Overlay */}
      <Celebration trigger={celebrate} message={celebrationMessage} />
    </motion.div>
  );
}
