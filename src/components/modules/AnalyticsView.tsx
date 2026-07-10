"use client";
import React, { useMemo } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, cn } from "@/lib/utils";
import {
  BarChart3, TrendingUp, TrendingDown, Users, DollarSign,
  Target, Activity, Award, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

export function AnalyticsView() {
  const { analyticsData, leads, vendors, projects } = useApp();

  const funnelConversion = useMemo(() => {
    if (!analyticsData?.lead_funnel) return [];
    return analyticsData.lead_funnel;
  }, [analyticsData]);

  const vendorPerformance = useMemo(() => {
    if (!analyticsData?.vendor_benchmarks) return [];
    return analyticsData.vendor_benchmarks;
  }, [analyticsData]);

  const revenueChartData = analyticsData?.revenue_data || [];
  const currentMonth = revenueChartData[revenueChartData.length - 1];
  const prevMonth = revenueChartData[revenueChartData.length - 2];
  const revenueGrowth = prevMonth && currentMonth
    ? ((currentMonth.revenue - prevMonth.revenue) / prevMonth.revenue * 100).toFixed(1)
    : "0";

  if (!analyticsData) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <Card><CardContent className="text-center py-12 text-muted-foreground">Memuat data analitik...</CardContent></Card>
      </motion.div>
    );
  }

  const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan & Analitik</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Revenue, konversi lead, performa vendor</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-gradient-to-br from-brand-500/10 to-brand-600/5 border-brand-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <DollarSign className="w-5 h-5 text-brand-500" />
              <Badge className={cn("text-[10px]", Number(revenueGrowth) >= 0 ? "bg-emerald-500/15 text-emerald-500" : "bg-red-500/15 text-red-500")}>
                {Number(revenueGrowth) >= 0 ? <ArrowUpRight className="w-3 h-3 inline" /> : <ArrowDownRight className="w-3 h-3 inline" />}
                {revenueGrowth}%
              </Badge>
            </div>
            <div className="text-xl font-bold">{formatRupiah(analyticsData.total_revenue)}</div>
            <p className="text-xs text-muted-foreground">Total Revenue YTD</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-xl font-bold text-emerald-500">{formatRupiah(analyticsData.total_profit)}</div>
            <p className="text-xs text-muted-foreground">Total Laba Bersih</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-xl font-bold text-purple-500">{analyticsData.avg_margin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Rata-rata Margin</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <Target className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-xl font-bold text-amber-500">{leads.filter((l) => l.status === "won").length}/{leads.length}</div>
            <p className="text-xs text-muted-foreground">Lead Won / Total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-500" /> Revenue vs Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                    formatter={(value: any) => formatRupiah(Number(value))}
                  />
                  <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cost" name="Cost" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" /> Lead Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelConversion} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="stage" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={90} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                    formatter={(value: any) => formatRupiah(Number(value))}
                  />
                  <Bar dataKey="value" name="Nilai" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-1">
              {funnelConversion.map((stage, i) => (
                <div key={stage.stage} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{stage.count} lead</span>
                    <span className="text-muted-foreground">{formatRupiah(stage.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" /> Vendor Performance Benchmark
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/20">
                    <th className="text-left px-3 py-2 font-semibold text-muted-foreground text-xs">Vendor</th>
                    <th className="text-left px-3 py-2 font-semibold text-muted-foreground text-xs">Kategori</th>
                    <th className="text-center px-3 py-2 font-semibold text-muted-foreground text-xs">Rating</th>
                    <th className="text-center px-3 py-2 font-semibold text-muted-foreground text-xs">SLA</th>
                    <th className="text-center px-3 py-2 font-semibold text-muted-foreground text-xs">Proyek</th>
                    <th className="text-center px-3 py-2 font-semibold text-muted-foreground text-xs">Avg Kontrak</th>
                    <th className="text-center px-3 py-2 font-semibold text-muted-foreground text-xs">Tepat Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorPerformance.map((v) => (
                    <tr key={v.vendorId || v.name} className="border-b border-border/40 hover:bg-muted/20">
                      <td className="px-3 py-2 font-medium">{v.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{v.category}</td>
                      <td className="px-3 py-2 text-center">
                        <Badge className={v.rating >= 4.8 ? "bg-emerald-500/15 text-emerald-500" : v.rating >= 4.5 ? "bg-amber-500/15 text-amber-500" : "bg-muted text-muted-foreground"}>
                          {v.rating}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-center font-semibold">{v.sla}%</td>
                      <td className="px-3 py-2 text-center">{v.projectCount}</td>
                      <td className="px-3 py-2 text-center font-semibold">{formatRupiah(v.avgContractValue)}</td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${v.onTimeDelivery}%` }} />
                          </div>
                          <span className="text-xs font-semibold">{v.onTimeDelivery}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Proyek</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">{projects.filter((p) => p.paymentStatus === "fully_paid").length} selesai</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Vendor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <p className="text-xs text-muted-foreground">{vendors.filter((v) => v.rating >= 4.5).length} top-rated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Revenue / Proyek</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length > 0 ? formatRupiah(analyticsData.total_revenue / projects.length) : "Rp 0"}</div>
            <p className="text-xs text-muted-foreground">Rata-rata per proyek</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}


