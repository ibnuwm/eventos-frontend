"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Star, StarHalf, ThumbsUp, Camera, CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchSponsoredContent } from "@/lib/api";

export default function SponsoredPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSponsoredContent().then((res) => {
      if (res?.data) setItems(res.data);
      else if (Array.isArray(res)) setItems(res);
      setLoading(false);
    }).catch(() => {
      setError("Gagal memuat konten sponsor");
      setLoading(false);
    });
  }, []);

  const typeVariants: Record<string, "info" | "success" | "secondary" | "destructive"> = {
    article: "info",
    banner: "secondary",
    video: "destructive",
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
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 font-bold">
            Sponsored Content
          </Badge>
          <h1 className="text-2xl font-bold text-white">Konten Sponsor</h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Artikel, banner, dan video promosi dari vendor terbaik
          </p>
        </div>

        {/* Sponsored Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item: any) => (
            <Card key={item.id} className="border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all flex flex-col overflow-hidden">
              {item.image_url && (
                <div className="w-full h-40 overflow-hidden">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant={typeVariants[item.type] || "info"} className="text-[10px] capitalize">
                    {item.type || "article"}
                  </Badge>
                  {(item.start_date || item.end_date) && (
                    <span className="text-[10px] text-slate-500">
                      {item.start_date} — {item.end_date}
                    </span>
                  )}
                </div>
                <CardTitle className="text-base font-bold text-white mt-2">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4 space-y-3 flex-1 flex flex-col">
                {item.content_preview && (
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{item.content_preview}</p>
                )}
                {item.target_url && (
                  <a
                    href={item.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto"
                  >
                    <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-500 text-xs gap-2">
                      Lihat Selengkapnya
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {items.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-12">Belum ada konten sponsor</p>
        )}
      </div>
    </div>
  );
}
