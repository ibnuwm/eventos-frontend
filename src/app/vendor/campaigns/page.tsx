"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Star, StarHalf, ThumbsUp, Camera, CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import { fetchAdCampaigns, createAdCampaign } from "@/lib/api";

export default function VendorCampaignsPage() {
  const router = useRouter();
  const vendorId = "v-1";

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [dailyBudget, setDailyBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [creating, setCreating] = useState(false);

  const loadCampaigns = () => {
    setLoading(true);
    fetchAdCampaigns(vendorId).then((res) => {
      if (res?.data) setCampaigns(res.data);
      else if (Array.isArray(res)) setCampaigns(res);
      setLoading(false);
    }).catch(() => {
      setError("Gagal memuat kampanye");
      setLoading(false);
    });
  };

  useEffect(() => { loadCampaigns(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName || !dailyBudget || !startDate || !endDate) return;
    setCreating(true);
    try {
      const res = await createAdCampaign({
        vendor_id: vendorId,
        campaign_name: campaignName,
        daily_budget: Number(dailyBudget),
        start_date: startDate,
        end_date: endDate,
      });
      if (res?.data) {
        loadCampaigns();
        setCampaignName("");
        setDailyBudget("");
        setStartDate("");
        setEndDate("");
        setShowForm(false);
      }
    } catch { }
    setCreating(false);
  };

  const calculateCTR = (clicks: number, impressions: number) => {
    if (!impressions) return "0%";
    return ((clicks / impressions) * 100).toFixed(2) + "%";
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="border-red-800 bg-slate-900">
        <CardContent className="p-8 flex flex-col items-center gap-3">
          <XCircle className="w-8 h-8 text-red-400" />
          <p className="text-red-400 text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={() => { setError(null); loadCampaigns(); }} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Coba Lagi
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Ad Campaigns</h1>
            <p className="text-xs text-slate-400 mt-1">Kelola kampanye iklan vendor</p>
          </div>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-2" onClick={() => setShowForm(!showForm)}>
            + Campaign Baru
          </Button>
        </div>

        {/* Create Form */}
        {showForm && (
          <Card className="border-slate-800 bg-slate-900/60">
            <CardContent className="p-6">
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Nama Campaign</label>
                  <Input
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Mis: Promo Q3 2026"
                    className="bg-slate-950 border-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Daily Budget (Rp)</label>
                  <Input
                    type="number"
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(e.target.value)}
                    placeholder="500000"
                    className="bg-slate-950 border-slate-800"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Tanggal Mulai</label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-slate-950 border-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Tanggal Selesai</label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-slate-950 border-slate-800"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={creating} className="bg-indigo-600 hover:bg-indigo-500 gap-2">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Buat Campaign
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Campaign Cards */}
        {campaigns.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-12">Belum ada kampanye iklan</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {campaigns.map((camp: any) => (
            <Card key={camp.id} className="border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all">
              <CardHeader className="pb-3 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold text-white">{camp.campaign_name}</CardTitle>
                  <Badge variant={camp.status === "active" ? "success" : camp.status === "paused" ? "secondary" : "destructive"} className="text-[10px] capitalize">
                    {camp.status || "active"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide">Daily Budget</div>
                    <div className="font-bold text-white mt-1">{formatRupiah(camp.daily_budget || 0)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide">Total Spent</div>
                    <div className="font-bold text-amber-400 mt-1">{formatRupiah(camp.total_spent || 0)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide">Impressions</div>
                    <div className="font-bold text-white mt-1">{(camp.impressions || 0).toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide">Clicks</div>
                    <div className="font-bold text-white mt-1">{(camp.clicks || 0).toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">CTR: <span className="font-bold text-emerald-400">{calculateCTR(camp.clicks || 0, camp.impressions || 0)}</span></span>
                  <span className="text-slate-500">{camp.start_date || ""} — {camp.end_date || ""}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
