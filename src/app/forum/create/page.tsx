"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createForumTopic, fetchForumCategories } from "@/lib/api";
import { Loader2, ArrowLeft, XCircle, CheckCircle2 } from "lucide-react";

export default function CreateForumTopicPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", content: "", author_name: "", author_whatsapp: "", category: "" });

  useEffect(() => {
    fetchForumCategories().then((res) => {
      if (res?.status === "success") setCategories(res.data);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim() || !form.author_name.trim()) return;
    setLoading(true); setError(null);
    try {
      const res = await createForumTopic(form);
      if (res?.status === "success") {
        setSuccess(true);
        setTimeout(() => router.push("/forum"), 1500);
      } else {
        setError(res?.message || "Gagal membuat topik");
      }
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <Link href="/forum"><Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="w-4 h-4" /> Kembali ke Forum</Button></Link>

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">Buat Topik Baru</CardTitle>
            <p className="text-sm text-slate-400">Bagikan pemikiran atau tanyakan sesuatu ke komunitas.</p>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center py-8 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <p className="text-emerald-400 font-bold">Topik berhasil dibuat! Mengalihkan...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-900/20 border border-red-800 text-red-400 text-sm flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">Judul Topik</label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Masukkan judul topik" className="bg-slate-950 border-slate-800" required />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">Kategori</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm">
                    <option value="">Pilih kategori</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id || cat} value={cat.id || cat}>{cat.name || cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">Konten</label>
                  <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} placeholder="Tulis konten topik Anda..." className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm resize-y" required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-semibold">Nama Anda</label>
                    <Input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} placeholder="Nama" className="bg-slate-950 border-slate-800" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-semibold">No. WhatsApp</label>
                    <Input value={form.author_whatsapp} onChange={(e) => setForm({ ...form, author_whatsapp: e.target.value })} placeholder="08xxxxxxxxxx" className="bg-slate-950 border-slate-800" />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? "Menyimpan..." : "Buat Topik"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
