"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";
import { Search, Star, Clock, CheckCircle2, ShoppingBag, MapPin, Phone } from "lucide-react";

export function MarketplaceView() {
  const { vendors, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Photography", "Decoration", "Sound & Lighting", "Catering"];

  const filteredVendors = vendors.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        v.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === "All" || v.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleInstantBook = (vendorName: string) => {
    showToast(`✅ Request Instant Booking untuk ${vendorName} berhasil dikirim via WhatsApp Webhook! Kalender inventaris terkunci sementara.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Modul 3 & 13: Database Vendor & B2B Marketplace
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Jejaring pasar B2B dengan transparansi harga dan skor keandalan lapangan (SLA Ketepatan Waktu Loading).
          </p>
        </div>
        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama vendor, kategori..."
            className="pl-9 bg-slate-900 border-slate-800"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id} className="border-slate-800 bg-slate-900/90 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg group">
            <div>
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

              <CardContent className="px-5 pb-4 space-y-3 text-xs">
                {/* SLA Performance Score Box */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-400" /> SLA Ketepatan Loading:</span>
                    <span className="font-extrabold text-emerald-400">{vendor.slaPunctuality}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full" style={{ width: `${vendor.slaPunctuality}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-300 pt-1">
                  <span>PIC Vendor:</span>
                  <span className="font-semibold text-white">{vendor.picName}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span>Rate Card B2B Mulai:</span>
                  <span className="font-bold text-emerald-400 text-sm">{formatRupiah(vendor.startingPrice)}</span>
                </div>
              </CardContent>
            </div>

            <div className="p-5 pt-0 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs gap-1 h-9"
                onClick={() => showToast(`💬 Menghubungi WhatsApp resmi ${vendor.picName} (${vendor.whatsapp})...`)}
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                Chat WA
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 h-9 gap-1"
                onClick={() => handleInstantBook(vendor.name)}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Book Now
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
