"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Calendar, Sparkles, ShoppingBag, Users, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/blog");
        const json = await res.json();
        if (json?.status === "success") setPosts(json.data || []);
      } catch (e) { console.warn(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const categoryEmoji: Record<string, string> = { tips: "💍", bisnis: "📄", manajemen: "🤝", teknologi: "🤖" };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link href="/landing" className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 mb-6"><ArrowLeft className="w-4 h-4 mr-1" />Kembali</Link>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Blog EventOS</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">Tips, trik, dan panduan lengkap seputar industri event dan wedding organizer di Indonesia.</p>
        </div>
        {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div> : posts.length === 0 ? (
          <div className="text-center py-20"><XCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" /><p className="text-slate-500">Belum ada artikel</p></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="bg-slate-900/60 border-slate-800 hover:border-indigo-500/50 transition-all h-full group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="text-3xl mb-3">{categoryEmoji[post.category] || "📝"}</div>
                    <Badge variant="secondary" className="mb-2 text-xs">{post.category}</Badge>
                    <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors mb-2">{post.title}</h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{post.author}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.created_at?.substring(0, 10)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
