"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchUgcGallery, submitUgcPhoto } from "@/lib/api";
import { Loader2, Image, Upload, User, Tag, XCircle, CheckCircle2 } from "lucide-react";

export default function GalleryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [form, setForm] = useState({ uploader_name: "", caption: "", image_url: "", tagged_vendors: "" });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true); setError(null);
    try {
      const res = await fetchUgcGallery();
      if (res?.status === "success") setPhotos(res.data);
      else setError(res?.message || "Gagal memuat galeri");
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.uploader_name.trim() || !form.image_url.trim()) return;
    setSubmitting(true); setError(null);
    try {
      const payload: any = { uploader_name: form.uploader_name, image_url: form.image_url };
      if (form.caption.trim()) payload.caption = form.caption;
      if (form.tagged_vendors.trim()) payload.tagged_vendors = form.tagged_vendors.split(",").map((v) => v.trim());
      const res = await submitUgcPhoto(payload);
      if (res?.status === "success") {
        setSubmitSuccess(true);
        setForm({ uploader_name: "", caption: "", image_url: "", tagged_vendors: "" });
        fetchData();
        setTimeout(() => { setSubmitSuccess(false); setShowForm(false); }, 2000);
      } else {
        setError(res?.message || "Gagal mengunggah foto");
      }
    } catch (e: any) { setError(e.message); }
    finally { setSubmitting(false); }
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>;
  if (error) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-center"><XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" /><p className="text-slate-400">{error}</p></div></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 mb-2">Galeri UGC</Badge>
            <h1 className="text-2xl font-bold text-white">Galeri Foto Event</h1>
            <p className="text-sm text-slate-400">Foto dan momen dari acara yang dibagikan oleh komunitas.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-500 gap-2 whitespace-nowrap">
            <Upload className="w-4 h-4" /> Upload Foto
          </Button>
        </div>

        {showForm && (
          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-sm font-bold text-white">Bagikan Foto Anda</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {submitSuccess ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Foto berhasil diunggah!
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {error && <div className="p-3 rounded-lg bg-red-900/20 border border-red-800 text-red-400 text-sm">{error}</div>}
                  <Input value={form.uploader_name} onChange={(e) => setForm({ ...form, uploader_name: e.target.value })} placeholder="Nama Anda" className="bg-slate-950 border-slate-800" required />
                  <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="URL Gambar" className="bg-slate-950 border-slate-800" required />
                  <Input value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} placeholder="Caption (opsional)" className="bg-slate-950 border-slate-800" />
                  <Input value={form.tagged_vendors} onChange={(e) => setForm({ ...form, tagged_vendors: e.target.value })} placeholder="Tag vendor (pisahkan dengan koma, opsional)" className="bg-slate-950 border-slate-800" />
                  <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-500 gap-2">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {submitting ? "Mengunggah..." : "Upload"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {photos.length === 0 && (
          <div className="text-center py-12">
            <Image className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">Belum ada foto di galeri. Jadilah yang pertama berbagi!</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo: any) => (
            <Card key={photo.id} className="border-slate-800 bg-slate-900/60 overflow-hidden group">
              <div className="w-full h-48 overflow-hidden">
                {photo.image_url ? (
                  <img src={photo.image_url} alt={photo.caption || "Foto event"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-900/30 to-purple-900/30 flex items-center justify-center">
                    <Image className="w-8 h-8 text-slate-600" />
                  </div>
                )}
              </div>
              <CardContent className="p-3 space-y-1.5">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <User className="w-3 h-3" /> {photo.uploader_name}
                </div>
                {photo.caption && <p className="text-xs text-slate-300">{photo.caption}</p>}
                {photo.tagged_vendors && photo.tagged_vendors.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    <Tag className="w-3 h-3 text-indigo-400" />
                    {photo.tagged_vendors.map((v: string, i: number) => (
                      <Badge key={i} className="text-[10px] bg-slate-800 text-slate-300">{v}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
