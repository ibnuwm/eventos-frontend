"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCheck, MapPin, Clock, Send, UserPlus } from "lucide-react";

export function StaffView() {
  const { staff, showToast } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Modul 15: Staff & Crew Rostering Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Alokasi penugasan kru lapangan, Stage Manager, dan Usher dengan fitur absensi GPS Check-In real-time.
          </p>
        </div>
        <Button
          onClick={() => showToast("📢 Jadwal loading & briefing H-1 dikirim serentak ke WhatsApp seluruh kru terdaftar!")}
          className="gap-1.5 font-semibold bg-indigo-600 hover:bg-indigo-500"
        >
          <Send className="w-4 h-4" />
          Broadcast Jadwal WA
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {staff.map((crew) => (
          <Card key={crew.id} className="border-slate-800 bg-slate-900/90 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md">
            <div>
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] text-indigo-300 border-indigo-500/30">
                    {crew.role}
                  </Badge>
                  {crew.status === "checked_in" ? (
                    <Badge variant="success" className="text-[10px]">✔ Hadir & Check-In</Badge>
                  ) : crew.status === "on_way" ? (
                    <Badge variant="warning" className="text-[10px]">🚚 Dalam Perjalanan</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">Standby</Badge>
                  )}
                </div>
                <CardTitle className="text-base font-bold text-white mt-2.5">
                  {crew.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-5 pb-4 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="font-semibold text-slate-300">Proyek:</span>
                  <span className="text-white font-medium">{crew.assignedEventTitle}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Lokasi Tugas: <strong className="text-white">{crew.location}</strong></span>
                </div>

                {crew.checkInTime && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span>Waktu Check-In: <strong className="text-emerald-400">{crew.checkInTime}</strong></span>
                  </div>
                )}
              </CardContent>
            </div>

            <div className="p-5 pt-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold"
                onClick={() => showToast(`📍 Melacak lokasi GPS realtime untuk ${crew.name}...`)}
              >
                Cek Posisi GPS
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
