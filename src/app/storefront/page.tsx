"use client";
import React, { useEffect, useState } from "react";
import { fetchStorefrontVendors } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, Clock, MapPin, Phone, ShoppingBag, Heart, ShieldCheck, Users, Sparkles, Camera, Music, Utensils, Flower2, Monitor } from "lucide-react";
import { motion } from "framer-motion";

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

const categoryIcons: Record<string, React.ElementType> = {
  Photography: Camera, Decoration: Flower2, Catering: Utensils,
  "Sound & Lighting": Music, "MC & Entertainment": Monitor,
};

const heroCategories = [
  { label: "Photography", icon: Camera, desc: "Foto & Video" },
  { label: "Decoration", icon: Flower2, desc: "Dekorasi & Pelaminan" },
  { label: "Catering", icon: Utensils, desc: "Katering & Kue" },
  { label: "Sound & Lighting", icon: Monitor, desc: "Sound System & LED" },
  { label: "MC & Entertainment", icon: Music, desc: "MC & Hiburan" },
];

export default function StorefrontPage() {
  const [vendors, setVendors] = useState<StoreVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const categories = ["All", "Photography", "Decoration", "Sound & Lighting", "Catering", "MC & Entertainment"];

  useEffect(() => {
    fetchStorefrontVendors().then((res) => {
      if (res?.data) setVendors(res.data);
      setLoading(false);
    });
    const saved = localStorage.getItem("eventos_wishlist");
    if (saved) setWishlist(new Set(JSON.parse(saved)));
  }, []);

  const toggleWishlist = (id: string) => {
    const next = new Set(wishlist);
    next.has(id) ? next.delete(id) : next.add(id);
    setWishlist(next);
    localStorage.setItem("eventos_wishlist", JSON.stringify([...next]));
  };

  const filtered = vendors.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === "All" || v.category === selectedCategory;
    return matchSearch && matchCat;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
          <p>Menemukan vendor terbaik untuk Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/30 font-bold px-4 py-1.5">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Direktori Vendor Event No.1 Indonesia
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            Temukan Vendor <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Impian</span> Anda
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
            Ribuan vendor tepercaya untuk pernikahan, ulang tahun, dan acara spesial Anda. 
            Dilengkapi rating, review, dan SLA ketepatan.
          </p>
          <div className="max-w-lg mx-auto relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari vendor, kategori, atau lokasi..."
              className="pl-11 bg-slate-800/50 border-slate-700 h-12 text-base rounded-2xl"
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {heroCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`p-4 rounded-2xl text-center transition-all ${
                    selectedCategory === cat.label
                      ? "bg-indigo-600/20 border-2 border-indigo-500/50"
                      : "bg-slate-800/30 border-2 border-transparent hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-indigo-400" />
                  <div className="text-sm font-semibold">{cat.label}</div>
                  <div className="text-xs text-slate-500">{cat.desc}</div>
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700"
                }`}
              >
                {cat === "All" ? "Semua" : cat}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500">{filtered.length} vendor ditemukan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((vendor, i) => {
            const Icon = categoryIcons[vendor.category] || ShoppingBag;
            return (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-slate-800/40 border-slate-700/60 hover:border-indigo-500/40 transition-all duration-300 group overflow-hidden">
                  <CardHeader className="p-5 pb-3 relative">
                    <button
                      onClick={(e) => { e.preventDefault(); toggleWishlist(vendor.id); }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 transition-colors z-10"
                    >
                      <Heart className={`w-4 h-4 ${wishlist.has(vendor.id) ? "fill-red-500 text-red-500" : "text-slate-400"}`} />
                    </button>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-indigo-400" />
                      </div>
                      <Badge className="bg-slate-700 text-slate-300 border-slate-600 text-[10px]">{vendor.category}</Badge>
                      <div className="flex items-center gap-1 text-amber-400 font-bold text-xs ml-auto">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{vendor.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {vendor.name}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{vendor.area}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-4 space-y-3 text-xs flex-1">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                      <div className="flex items-center justify-between text-slate-400 mb-1.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" /> SLA:
                        </span>
                        <span className="font-bold text-emerald-400">{vendor.sla_punctuality}%</span>
                      </div>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${vendor.sla_punctuality}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">PIC:</span>
                      <span className="font-semibold text-white">{vendor.pic_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Mulai dari:</span>
                      <span className="font-bold text-emerald-400 text-sm">{formatRupiah(vendor.starting_price)}</span>
                    </div>
                  </CardContent>
                  <div className="px-5 pb-5 pt-0 flex gap-2">
                    <a
                      href={`https://wa.me/${vendor.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 h-9 border-slate-600 hover:bg-emerald-500/10 hover:border-emerald-500/30">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        Chat WA
                      </Button>
                    </a>
                    <a href={`/storefront/${vendor.id}`} className="flex-1">
                      <Button size="sm" className="w-full text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 h-9 gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Detail
                      </Button>
                    </a>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400">Tidak ada vendor yang cocok dengan pencarian Anda</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}>
              Reset Filter
            </Button>
          </div>
        )}

        <div className="text-center py-12 space-y-4">
          <div className="flex items-center justify-center gap-8 flex-wrap text-sm text-slate-500">
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Vendor</span>
            <span className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" /> Rating Transparan</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-indigo-400" /> 500+ WO Aktif</span>
            <span className="flex items-center gap-2"><Heart className="w-4 h-4 text-red-400" /> Wishlist B2C</span>
          </div>
          <p className="text-xs text-slate-600">EventOS.id — Marketplace Vendor Event Terpercaya di Indonesia</p>
        </div>
      </div>
    </div>
  );
}
