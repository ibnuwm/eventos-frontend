"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerTenant } from "@/lib/api";
import { Loader2, ArrowLeft, Store, XCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ company_name: "", email: "", whatsapp: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company_name.trim() || !form.email.trim() || !form.whatsapp.trim() || !form.password.trim()) return;
    setLoading(true); setError(null);
    try {
      const res = await registerTenant(form);
      if (res?.status === "success") setSuccess(true);
      else setError(res?.message || "Gagal mendaftarkan tenant");
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="border-emerald-800 bg-slate-900 max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Pendaftaran Berhasil!</h2>
            <p className="text-sm text-slate-400">Akun tenant Anda telah berhasil dibuat. Silakan cek email atau WhatsApp Anda untuk informasi lebih lanjut.</p>
            <Link href="/dashboard"><Button className="bg-indigo-600 hover:bg-indigo-500">Masuk ke Dashboard</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 mb-2">Daftar Tenant</Badge>
          <h1 className="text-2xl font-bold text-white">Daftar Akun Tenant</h1>
          <p className="text-sm text-slate-400 mt-1">Bergabung dengan EventOS dan kelola bisnis event Anda.</p>
        </div>

        <Card className="border-slate-800 bg-slate-900/60">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-900/20 border border-red-800 text-red-400 text-sm flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Nama Perusahaan</label>
                <Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} placeholder="CV Event Makmur" className="bg-slate-950 border-slate-800" required />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Email</label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="admin@perusahaan.com" className="bg-slate-950 border-slate-800" required />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">No. WhatsApp</label>
                <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="0812xxxxxxxx" className="bg-slate-950 border-slate-800" required />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Password</label>
                <div className="relative">
                  <Input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type={showPassword ? "text" : "password"} placeholder="Min. 6 karakter" className="bg-slate-950 border-slate-800 pr-10" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-500 hover:text-slate-300">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Store className="w-4 h-4" />}
                {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500">
          Sudah punya akun? <Link href="/vendor/login" className="text-indigo-400 hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  );
}
