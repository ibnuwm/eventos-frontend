"use client";

import React, { useEffect, useState } from "react";
import { fetchStorefrontVendors } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, Clock, MapPin, Phone, ShoppingBag } from "lucide-react";

interface StoreVendor {
  id: string;
  name: string;
  category: string;
  pic_name: string;
  whatsapp: string;
  rating: number;
  sla_punctuality: number;
  starting_price: number;
  area: string;
}

export default function StorefrontPage() {
  const [vendors, setVendors] = useState<StoreVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Photography", "Decoration", "Sound & Lighting", "Catering"];

  useEffect(() => {
    fetchStorefrontVendors().then((res) => {
      if (res?.data) setVendors(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = vendors.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === "All" || v.category === selectedCategory;
    return matchSearch && matchCat;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Memuat direktori vendor...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 font-bold">
            Vendor Storefront — B2B Marketplace
          </Badge>
          <h1 className="text-2xl font-bold text-white">Temukan Vendor Event Terbaik</h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Direktori vendor tepercaya dengan rating, skor SLA, dan harga transparan.
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari vendor..."
              className="pl-9 bg-slate-900 border-slate-800"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Vendor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((vendor) => (
            <Card key={vendor.id} className="border-slate-800 bg-slate-900/90 flex flex-col hover:border-slate-700 transition-all shadow-lg group">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="info" className="text-[10px]">{vendor.category}</Badge>
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{vendor.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-base font-bold text-white mt-2.5 group-hover:text-indigo-300 transition-colors">
                  {vendor.name}
                </CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{vendor.area}</span>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-4 space-y-3 text-xs flex-1">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-400" /> SLA Ketepatan:</span>
                    <span className="font-extrabold text-emerald-400">{vendor.sla_punctuality}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full" style={{ width: `${vendor.sla_punctuality}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-slate-300 pt-1">
                  <span>PIC:</span>
                  <span className="font-semibold text-white">{vendor.pic_name}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Mulai dari:</span>
                  <span className="font-bold text-emerald-400 text-sm">{formatRupiah(vendor.starting_price)}</span>
                </div>
              </CardContent>
              <div className="p-5 pt-0 flex gap-2">
                <a
                  href={`https://wa.me/${vendor.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1 h-9">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    Chat WA
                  </Button>
                </a>
                <a href={`/storefront/${vendor.id}`} className="flex-1">
                  <Button size="sm" className="w-full text-xs font-bold bg-indigo-600 hover:bg-indigo-500 h-9 gap-1">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Detail
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center text-xs text-slate-500 pb-8">
          EventOS.id Vendor Storefront &copy; 2026
        </div>
      </div>
    </div>
  );
}
