"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchFeaturedVendors } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { Loader2, Sparkles, Shield, Trophy, Users, Star, Calendar, Search, XCircle } from "lucide-react";

const badgeIcons: Record<string, React.ReactNode> = {
  premium: <Sparkles className="w-4 h-4 text-amber-400" />,
  verified: <Shield className="w-4 h-4 text-emerald-400" />,
  top_rated: <Trophy className="w-4 h-4 text-indigo-400" />,
};

const badgeStyles: Record<string, string> = {
  premium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  verified: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  top_rated: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};

export default function VendorPremiumPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBadge, setFilterBadge] = useState("");

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true); setError(null);
    try {
      const res = await fetchFeaturedVendors();
      if (res?.status === "success") setVendors(res.data);
      else setError(res?.message || "Gagal memuat vendor premium");
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  const filtered = vendors.filter((v: any) => {
    const matchSearch = v.name?.toLowerCase().includes(searchTerm.toLowerCase()) || v.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBadge = !filterBadge || v.badge_type === filterBadge;
    return matchSearch && matchBadge;
  });

  const badgeTypes = [...new Set(vendors.map((v: any) => v.badge_type).filter(Boolean))];

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>;
  if (error) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-center"><XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" /><p className="text-slate-400">{error}</p></div></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-3">
          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">Premium Profiles</Badge>
          <h1 className="text-3xl font-bold text-white">Vendor Premium</h1>
          <p className="text-slate-400 max-w-xl mx-auto">Vendor terbaik dengan badge premium, terverifikasi, dan rating tertinggi.</p>
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cari vendor premium..." className="pl-9 bg-slate-900 border-slate-800" />
          </div>
        </div>

        {/* Badge Filter */}
        {badgeTypes.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button onClick={() => setFilterBadge("")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${!filterBadge ? "bg-indigo-600 text-white shadow-md" : "bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800"}`}>
              Semua
            </button>
            {badgeTypes.map((type) => (
              <button key={type} onClick={() => setFilterBadge(type)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${filterBadge === type ? "bg-indigo-600 text-white shadow-md" : "bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800"}`}>
                {badgeIcons[type]} {type.replace("_", " ")}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">Tidak ada vendor premium yang ditemukan.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((vendor: any) => (
            <Card key={vendor.id} className="border-slate-800 bg-slate-900/60 flex flex-col hover:border-indigo-500/30 transition-all group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`text-[10px] capitalize ${badgeStyles[vendor.badge_type] || "bg-slate-800 text-slate-300"}`}>
                    {badgeIcons[vendor.badge_type]} {vendor.badge_type?.replace("_", " ") || "Standard"}
                  </Badge>
                  {vendor.priority_score && (
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" /> Skor: {vendor.priority_score}
                    </span>
                  )}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white mb-2">
                  {vendor.name?.charAt(0)}
                </div>
                <CardTitle className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">{vendor.name}</CardTitle>
                {vendor.category && <p className="text-xs text-slate-400 mt-1">{vendor.category}</p>}
              </CardHeader>
              <CardContent className="text-xs space-y-2 flex-1">
                {vendor.rating && (
                  <div className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {vendor.rating}
                  </div>
                )}
                {vendor.starting_price && (
                  <div className="text-emerald-400 font-bold">{formatRupiah(vendor.starting_price)}</div>
                )}
                {vendor.subscription_start && vendor.subscription_end && (
                  <div className="flex items-center gap-1 text-slate-500 pt-1 border-t border-slate-800">
                    <Calendar className="w-3 h-3" />
                    {vendor.subscription_start} - {vendor.subscription_end}
                  </div>
                )}
                <Link href={`/storefront/${vendor.id}`}>
                  <Button size="sm" variant="outline" className="w-full gap-2 mt-2">
                    Lihat Profil
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
