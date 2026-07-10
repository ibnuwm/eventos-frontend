"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Star, StarHalf, ThumbsUp, Camera, CheckCircle2, XCircle, MessageSquare, Smartphone, Download, Share2, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PwaPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 font-bold">
            EventOS PWA
          </Badge>
          <h1 className="text-2xl font-bold text-white">Install EventOS</h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            EventOS dapat diinstal sebagai aplikasi di perangkat Anda. Nikmati pengalaman yang lebih cepat dan akses offline.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-slate-800 bg-slate-900/60">
            <CardContent className="p-5 flex flex-col items-center text-center space-y-2">
              <Download className="w-8 h-8 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Instal Sekali</h3>
              <p className="text-[11px] text-slate-400">Tambahkan ke layar utama tanpa perlu install dari Play Store</p>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900/60">
            <CardContent className="p-5 flex flex-col items-center text-center space-y-2">
              <Share2 className="w-8 h-8 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Akses Cepat</h3>
              <p className="text-[11px] text-slate-400">Buka langsung dengan satu ketukan dari layar utama</p>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900/60">
            <CardContent className="p-5 flex flex-col items-center text-center space-y-2">
              <Bell className="w-8 h-8 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Notifikasi</h3>
              <p className="text-[11px] text-slate-400">Dapatkan notifikasi update vendor dan promo terbaru</p>
            </CardContent>
          </Card>
        </div>

        {/* How to Install */}
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-sm font-bold text-white">Cara Install</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">1</div>
              <div>
                <p className="text-slate-300">Buka EventOS di browser Chrome (Android) atau Safari (iOS)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">2</div>
              <div>
                <p className="text-slate-300">Tap ikon <strong>Install</strong> atau <strong>Share</strong> di menu browser</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">3</div>
              <div>
                <p className="text-slate-300">Pilih <strong>"Add to Home Screen"</strong> atau <strong>"Install"</strong></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">4</div>
              <div>
                <p className="text-slate-300">EventOS siap digunakan kapan saja, bahkan offline!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PWA Badge */}
        <div className="text-center text-[10px] text-slate-600">
          EventOS.id — Progressive Web App &copy; 2026
        </div>
      </div>
    </div>
  );
}
