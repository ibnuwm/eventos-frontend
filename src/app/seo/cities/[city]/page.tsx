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
import { fetchStorefrontVendors } from "@/lib/api";

const SEO_META: Record<string, { description: string; keywords: string }> = {
  jakarta: {
    description: "Temukan vendor event terbaik di Jakarta. Dari fotografer, dekorasi, katering, hingga sound system untuk pernikahan, ulang tahun, dan acara corporate.",
    keywords: "vendor event jakarta, WO jakarta, catering jakarta, fotografer jakarta, dekorasi jakarta",
  },
  bandung: {
    description: "Vendor event terbaik di Bandung untuk pernikahan dan acara Anda. Fotografi, dekorasi, katering, dan hiburan berkualitas.",
    keywords: "vendor event bandung, WO bandung, catering bandung, fotografer bandung",
  },
  surabaya: {
    description: "Rekomendasi vendor event terbaik di Surabaya. Fotografer, dekorasi, katering, dan wedding organizer profesional.",
    keywords: "vendor event surabaya, WO surabaya, catering surabaya, fotografer surabaya",
  },
  bali: {
    description: "Vendor event pernikahan dan acara terbaik di Bali. Dari dekorasi pantai hingga fotografer internasional.",
    keywords: "vendor event bali, wedding organizer bali, catering bali, fotografer bali",
  },
  jogja: {
    description: "Vendor event murah dan berkualitas di Yogyakarta. Fotografer, dekorasi, katering, dan WO Jogja terpercaya.",
    keywords: "vendor event jogja, WO jogja, catering jogja, fotografer jogja",
  },
  semarang: {
    description: "Vendor event terbaik di Semarang untuk acara pernikahan dan corporate. Dekorasi, katering, fotografer profesional.",
    keywords: "vendor event semarang, WO semarang, catering semarang, fotografer semarang",
  },
  makassar: {
    description: "Vendor event pernikahan terbaik di Makassar. Wedding organizer, dekorasi, dan katering Makassar.",
    keywords: "vendor event makassar, WO makassar, catering makassar, fotografer makassar",
  },
  medan: {
    description: "Rekomendasi vendor event terbaik di Medan. Fotografer, dekorasi, katering, dan hiburan untuk acara Anda.",
    keywords: "vendor event medan, WO medan, catering medan, fotografer medan",
  },
  palembang: {
    description: "Vendor event pernikahan dan acara di Palembang. Wedding organizer, catering, dekorasi, fotografer.",
    keywords: "vendor event palembang, WO palembang, catering palembang, fotografer palembang",
  },
  batam: {
    description: "Vendor event terbaik di Batam. Fotografer, dekorasi, katering, dan wedding organizer profesional.",
    keywords: "vendor event batam, WO batam, catering batam, fotografer batam",
  },
};

export default function CityLandingPage() {
  const params = useParams();
  const router = useRouter();
  const city = (params.city as string) || "";
  const cityKey = city.toLowerCase().replace(/\s+/g, "-");

  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isTopCity = !!SEO_META[cityKey];
  const seo = SEO_META[cityKey];

  useEffect(() => {
    fetchStorefrontVendors(city).then((res) => {
      if (res?.data) setVendors(res.data);
      else if (Array.isArray(res)) setVendors(res);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [city]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* SEO Meta in head */}
      <head>
        {seo && (
          <>
            <meta name="description" content={seo.description} />
            <meta name="keywords" content={seo.keywords} />
          </>
        )}
      </head>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-950 to-purple-900/20" />
        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Temukan Vendor Event Terbaik di {city}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">
            {isTopCity
              ? seo.description
              : `Direktori vendor event terpercaya di ${city}. Temukan fotografer, dekorasi, katering, dan vendor lainnya.`}
          </p>
        </div>
      </section>

      {/* Vendor Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-sm">Belum ada vendor terdaftar di {city}.</p>
            <Button size="sm" className="mt-4 bg-indigo-600 hover:bg-indigo-500" onClick={() => router.push("/storefront")}>
              Lihat Semua Vendor
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {vendors.map((vendor: any) => (
              <Card key={vendor.id} className="border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all group">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="info" className="text-[10px]">{vendor.category}</Badge>
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{vendor.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-base font-bold text-white mt-2.5 group-hover:text-indigo-300 transition-colors">
                    {vendor.name}
                  </CardTitle>
                  {vendor.area && (
                    <p className="text-xs text-slate-500 mt-1">{vendor.area}</p>
                  )}
                </CardHeader>
                <CardContent className="px-5 pb-4 space-y-2 text-xs">
                  {vendor.starting_price > 0 && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Mulai dari</span>
                      <span className="font-bold text-emerald-400">{formatRupiah(vendor.starting_price)}</span>
                    </div>
                  )}
                  <a href={`/storefront/${vendor.id}`}>
                    <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-500 text-xs mt-2">
                      Lihat Detail
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
