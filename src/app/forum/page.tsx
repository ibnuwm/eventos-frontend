"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchForumTopics, fetchForumCategories } from "@/lib/api";
import { Loader2, MessageCircle, Eye, Pin, Search, Plus, XCircle } from "lucide-react";

export default function ForumPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([fetchForumTopics(), fetchForumCategories()]).then(([topicsRes, catsRes]) => {
      if (topicsRes?.status === "success") setTopics(topicsRes.data);
      else setError(topicsRes?.message || "Gagal memuat forum");
      if (catsRes?.status === "success") setCategories(catsRes.data);
      setLoading(false);
    });
  }, []);

  async function fetchFiltered() {
    setLoading(true); setError(null);
    try {
      const res = await fetchForumTopics(selectedCategory === "semua" ? undefined : selectedCategory, search || undefined);
      if (res?.status === "success") setTopics(res.data);
      else setError(res?.message || "Gagal memuat forum");
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchFiltered(); }, [selectedCategory]);

  function handleSearch() { fetchFiltered(); }

  if (loading && topics.length === 0) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>;
  if (error && topics.length === 0) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-center"><XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" /><p className="text-slate-400">{error}</p></div></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 mb-2">Forum Diskusi</Badge>
            <h1 className="text-2xl font-bold text-white">Forum EventOS</h1>
            <p className="text-sm text-slate-400">Diskusikan seputar wedding, event, dan vendor bersama komunitas.</p>
          </div>
          <Link href="/forum/create">
            <Button className="bg-indigo-600 hover:bg-indigo-500 gap-2 whitespace-nowrap">
              <Plus className="w-4 h-4" /> Buat Topik Baru
            </Button>
          </Link>
        </div>

        {/* Search & Category */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Cari topik..."
              className="pl-9 bg-slate-900 border-slate-800"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setSelectedCategory("semua")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedCategory === "semua" ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800"}`}>
              Semua
            </button>
            {categories.map((cat: any) => (
              <button key={cat.id || cat} onClick={() => setSelectedCategory(cat.id || cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedCategory === (cat.id || cat) ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800"}`}>
                {cat.name || cat}
              </button>
            ))}
          </div>
        </div>

        {topics.length === 0 && (
          <div className="text-center py-12"><p className="text-slate-500">Belum ada topik diskusi.</p></div>
        )}

        <div className="space-y-3">
          {topics.map((topic: any) => (
            <Link key={topic.id} href={`/forum/${topic.id}`} className="block group">
              <Card className="border-slate-800 bg-slate-900/60 hover:border-indigo-500/40 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {topic.is_pinned && <Pin className="w-3.5 h-3.5 text-amber-400" />}
                        <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">{topic.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 flex-wrap">
                        <span>{topic.author_name || topic.author}</span>
                        {topic.category && <Badge className="text-[10px] bg-slate-800 text-slate-300">{topic.category}</Badge>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
                      <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{topic.reply_count || 0}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{topic.view_count || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
