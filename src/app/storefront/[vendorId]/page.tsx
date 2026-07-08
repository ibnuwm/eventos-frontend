"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchStorefrontVendor } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Clock, MapPin, Phone, CheckCircle2, ArrowLeft, Briefcase, Building } from "lucide-react";

interface VendorDetail {
  id: string;
  name: string;
  category: string;
  pic_name: string;
  whatsapp: string;
  rating: number;
  sla_punctuality: number;
  starting_price: number;
  area: string;
  npwp: string | null;
  bank_account_info: string | null;
  total_projects_handled: number;
}

export default function VendorDetailPage() {
  const params = useParams();
  const vendorId = params.vendorId as string;
  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vendorId) return;
    fetchStorefrontVendor(vendorId).then((res) => {
      setLoading(false);
      if (res?.status === "success" && res?.data) {
        setVendor(res.data);
      } else {
        setError(res?.message || "Vendor tidak ditemukan");
      }
    });
  }, [vendorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Memuat detail vendor...
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="border-red-800 bg-slate-900 max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-lg font-bold text-white">Vendor Tidak Ditemukan</h2>
            <p className="text-sm text-slate-400">{error}</p>
            <a href="/storefront">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Kembali ke Storefront
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Back Button */}
        <a href="/storefront">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Button>
        </a>

        {/* Vendor Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/30">
              {vendor.name.charAt(0)}
            </div>
            <div>
              <Badge variant="info" className="text-[10px]">{vendor.category}</Badge>
              <h1 className="text-xl font-bold text-white mt-1">{vendor.name}</h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <MapPin className="w-3.5 h-3.5" /> {vendor.area}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-5 h-5 fill-amber-400" />
              <span className="text-lg">{vendor.rating}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="w-8 h-8 text-emerald-400" />
              <div>
                <div className="text-xs text-slate-400">SLA Ketepatan</div>
                <div className="text-lg font-extrabold text-emerald-400">{vendor.sla_punctuality}%</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-4 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-indigo-400" />
              <div>
                <div className="text-xs text-slate-400">Proyek Ditangani</div>
                <div className="text-lg font-extrabold text-white">{vendor.total_projects_handled}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-4 flex items-center gap-3">
              <Building className="w-8 h-8 text-amber-400" />
              <div>
                <div className="text-xs text-slate-400">Harga Mulai</div>
                <div className="text-lg font-extrabold text-emerald-400">{formatRupiah(vendor.starting_price)}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vendor Info */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-sm font-bold text-white">Informasi Vendor</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-800/50">
              <span className="text-slate-400">PIC</span>
              <span className="font-semibold text-white">{vendor.pic_name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/50">
              <span className="text-slate-400">Kategori</span>
              <span className="font-semibold text-white">{vendor.category}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/50">
              <span className="text-slate-400">Area Layanan</span>
              <span className="font-semibold text-white">{vendor.area}</span>
            </div>
            {vendor.npwp && (
              <div className="flex justify-between py-2 border-b border-slate-800/50">
                <span className="text-slate-400">NPWP</span>
                <span className="font-semibold text-white">{vendor.npwp}</span>
              </div>
            )}
            {vendor.bank_account_info && (
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Info Rekening</span>
                <span className="font-semibold text-white">{vendor.bank_account_info}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="flex gap-3">
          <a
            href={`https://wa.me/${vendor.whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 font-bold gap-2">
              <Phone className="w-4 h-4" />
              Hubungi via WhatsApp
            </Button>
          </a>
        </div>

        <div className="text-center text-xs text-slate-500 pb-8">
          EventOS.id Vendor Storefront &copy; 2026
        </div>
      </div>
    </div>
  );
}
