"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getWishlist, toggleWishlist } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { Loader2, Heart, Star, Tag, X, XCircle, ShoppingBag } from "lucide-react";

export default function WishlistPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true); setError(null);
    try {
      const res = await getWishlist();
      if (res?.status === "success") setItems(res.data);
      else setError(res?.message || "Gagal memuat wishlist");
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function handleRemove(vendorId: string) {
    setRemovingId(vendorId);
    try {
      const res = await toggleWishlist(vendorId);
      if (res?.status === "success") setItems((prev) => prev.filter((i: any) => i.vendor_id !== vendorId));
    } catch (e: any) { setError(e.message); }
    finally { setRemovingId(null); }
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>;
  if (error) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-center"><XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" /><p className="text-slate-400">{error}</p></div></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-3">
          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">Wishlist</Badge>
          <h1 className="text-2xl font-bold text-white">Wishlist Vendor</h1>
          <p className="text-sm text-slate-400">Vendor favorit yang Anda simpan untuk acara Anda.</p>
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">Wishlist Anda masih kosong.</p>
            <Link href="/storefront">
              <Button variant="outline" className="mt-3 gap-2"><ShoppingBag className="w-4 h-4" /> Jelajahi Vendor</Button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any) => (
            <Card key={item.id || item.vendor_id} className="border-slate-800 bg-slate-900/60 flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-[10px]">{item.category || item.vendor_category}</Badge>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => handleRemove(item.vendor_id)} disabled={removingId === item.vendor_id}>
                    {removingId === item.vendor_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                  </Button>
                </div>
                <CardTitle className="text-base font-bold text-white mt-2">{item.name || item.vendor_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs flex-1">
                {item.rating && (
                  <div className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {item.rating}
                  </div>
                )}
                {item.starting_price && (
                  <div className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Tag className="w-3.5 h-3.5" /> {formatRupiah(item.starting_price)}
                  </div>
                )}
                <Link href={`/storefront/${item.vendor_id}`}>
                  <Button size="sm" variant="outline" className="w-full gap-2 mt-2">
                    <ShoppingBag className="w-3.5 h-3.5" /> Lihat Detail
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
