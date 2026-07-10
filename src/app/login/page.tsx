"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, LogIn, Eye, EyeOff, ArrowLeft, Bug } from "lucide-react";

const DEMO_EMAIL = "demo@eventos.id";
const DEMO_PASSWORD = "demo123";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) return;
    setLoading(true);
    setError(null);

    // Demo mode: bypass backend
    if (form.email === DEMO_EMAIL && form.password === DEMO_PASSWORD) {
      localStorage.setItem("token", "demo-token");
      await new Promise((r) => setTimeout(r, 600));
      setLoading(false);
      router.push("/dashboard");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/tenant/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data?.access_token) {
        localStorage.setItem("token", data.access_token);
        router.push("/dashboard");
      } else {
        setError(data?.message || "Email atau password salah");
      }
    } catch {
      if (form.email === "demo@eventos.id") {
        setError("Password demo salah. Coba: demo123");
      } else {
        setError("Gagal terhubung ke server. Gunakan akun demo di bawah.");
      }
    } finally {
      setLoading(false);
    }
  }

  function fillDemo() {
    setForm({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <div className="max-w-sm mx-auto px-4 py-16 w-full flex-1 flex flex-col justify-center">
        <Link href="/" className="mb-8">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Beranda
          </Button>
        </Link>
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader className="pb-3 border-b border-slate-800 text-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm mx-auto mb-3">OS</div>
            <CardTitle className="text-lg font-bold text-white">Masuk ke EventOS</CardTitle>
            <p className="text-xs text-slate-400">Dashboard WO/EO — kelola bisnis event Anda</p>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-slate-950 border-slate-800 text-white"
                  placeholder="nama@perusahaan.com"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="bg-slate-950 border-slate-800 text-white pr-10"
                    placeholder="Masukkan password"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 font-bold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogIn className="w-4 h-4 mr-2" />}
                Masuk
              </Button>
            </form>

            <div className="border-t border-slate-800 pt-4">
              <button onClick={fillDemo} type="button"
                className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                <Bug className="w-3.5 h-3.5" /> Isi Demo (demo@eventos.id / demo123)
              </button>
            </div>

            <div className="text-center space-y-2 pt-1">
              <p className="text-xs text-slate-500">
                Belum punya akun?{" "}
                <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">Daftar Gratis</Link>
              </p>
              <p className="text-xs text-slate-500">
                Vendor partner?{" "}
                <Link href="/vendor/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Login di sini</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
