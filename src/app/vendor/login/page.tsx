"use client";

import React, { useState } from "react";
import { vendorLogin } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, LogIn } from "lucide-react";

export default function VendorLoginPage() {
  const [form, setForm] = useState({ name: "", whatsapp: "" });
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!form.name || !form.whatsapp) return;
    setLoading(true);
    setError(null);
    const res = await vendorLogin(form.whatsapp, form.name);
    if (res?.data) {
      setLoggedIn(res.data);
      sessionStorage.setItem("vendor_token", res.data.access_token);
      sessionStorage.setItem("vendor_id", res.data.vendor_id);
    } else {
      setError(res?.message || "Login gagal");
    }
    setLoading(false);
  };

  if (loggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <Card className="border-emerald-800 bg-slate-900 max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white mx-auto">
              {loggedIn.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-white">Selamat Datang, {loggedIn.name}!</h2>
            <Badge variant="info" className="text-[10px]">{loggedIn.category}</Badge>
            <a href={`/vendor/dashboard?vendor_id=${loggedIn.vendor_id}`}>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold gap-2">
                Buka Dashboard Vendor
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-sm mx-auto px-4 py-16 space-y-6">
        <a href="/"><Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="w-4 h-4" /> Beranda</Button></a>
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader className="pb-3 border-b border-slate-800 text-center">
            <LogIn className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
            <CardTitle className="text-base font-bold text-white">Login Vendor</CardTitle>
            <p className="text-xs text-slate-400">Masuk untuk melihat jadwal dan statistik Anda</p>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Nama Vendor</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white" placeholder="Nama perusahaan Anda" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">No. WhatsApp</label>
              <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white" placeholder="0812-1111-2222" />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 font-bold" disabled={loading || !form.name || !form.whatsapp} onClick={handleLogin}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Masuk
            </Button>
            <p className="text-[10px] text-slate-500 text-center">Demo: Lumiere Photography Indonesia / 0812-1111-2222</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
