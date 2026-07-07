"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Sparkles, Smartphone, ArrowDownRight } from "lucide-react";

export function RundownView() {
  const { rundown, addRundownItem, showToast } = useApp();

  const handleAIAutoGenerate = () => {
    addRundownItem({
      timeSlot: "15.00 - 16.30",
      durationMinutes: 90,
      activityTitle: "Sesi Foto Outdoor Golden Hour Sunset Bersama Bridesmaid & Groomsmen",
      divisionPic: "Lumiere Photography Team",
      notes: "Lokasi di Garden Poolside, siapkan smoke bomb warna putih.",
    });
    showToast("✨ AI berhasil menyusun & menambahkan jadwal sesi sunset ke rundown final!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Modul 8: Drag & Drop Hourly Rundown Builder
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Panduan kronologis menit per menit untuk kru lapangan dengan sistem pergeseran jadwal otomatis (Auto-Time Shifting).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-500 gap-1.5 font-semibold"
            onClick={handleAIAutoGenerate}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            AI Auto-Generate (Sesi Sore)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => showToast("📱 Tautan mobile rundown langsung dikirim ke ponsel seluruh kru via WhatsApp.")}
          >
            <Smartphone className="w-4 h-4 mr-1.5" />
            Share Mobile View
          </Button>
        </div>
      </div>

      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-white">Susunan Acara D-Day: Royal Wedding Anisa & Budi</CardTitle>
            <p className="text-xs text-slate-400">Jika jadwal akad mundur, geser waktu di blok 09.30 dan seluruh blok di bawahnya akan bergeser otomatis.</p>
          </div>
          <Badge variant="info">Total Durasi: 680 Menit</Badge>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {rundown.map((item, index) => {
            const colors = ["border-indigo-500", "border-purple-500", "border-emerald-500", "border-amber-500", "border-blue-500"];
            const borderColor = colors[index % colors.length];
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl bg-slate-950/60 border border-slate-800 border-l-4 ${borderColor} flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/80 transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-28 flex-shrink-0">
                    <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {item.timeSlot}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.durationMinutes} Menit</div>
                  </div>

                  <div>
                    <div className="font-bold text-sm text-white">{item.activityTitle}</div>
                    {item.notes && (
                      <div className="text-xs text-slate-400 mt-1 italic">📌 {item.notes}</div>
                    )}
                  </div>
                </div>

                <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  <Badge variant="outline" className="text-xs bg-slate-900 font-semibold text-slate-200">
                    PIC: {item.divisionPic}
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
