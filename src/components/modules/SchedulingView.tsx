"use client";
import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarCheck, Plus, X, Clock, User, CheckCircle2,
  Circle, Phone, Calendar, ArrowRight, Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function SchedulingView() {
  const { bookingSlots, vendors, createBookingSlot, bookSlot, showToast, sendWa } = useApp();
  const [selectedVendor, setSelectedVendor] = useState("v-1");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ vendorId: "v-1", date: "", startTime: "09:00", endTime: "10:00" });

  const vendorSlots = useMemo(() =>
    bookingSlots.filter((s) => s.vendorId === selectedVendor && s.date === selectedDate),
    [bookingSlots, selectedVendor, selectedDate]
  );

  const currentVendor = vendors.find((v) => v.id === selectedVendor);

  const handleCreate = async () => {
    if (!form.date || !form.startTime) return;
    await createBookingSlot({ vendor_id: form.vendorId, date: form.date, start_time: form.startTime, end_time: form.endTime || "10:00" });
    setForm({ vendorId: selectedVendor, date: "", startTime: "09:00", endTime: "10:00" });
    setShowCreate(false);
  };

  const handleBook = (slotId: string) => {
    const name = prompt("Nama klien:");
    if (name) bookSlot(slotId, name);
  };

  const next7Days = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d.toISOString().split("T")[0]);
    }
    return days;
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jadwal Konsultasi</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Atur jadwal meeting dengan vendor dan klien</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            className="bg-muted/50 border border-border/60 rounded-lg px-3 py-2 text-sm"
          >
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Tambah Slot
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {next7Days.map((day) => {
          const d = new Date(day);
          const dayName = d.toLocaleDateString("id-ID", { weekday: "short" });
          const dayNum = d.getDate();
          const isToday = day === new Date().toISOString().split("T")[0];
          const slotCount = bookingSlots.filter((s) => s.vendorId === selectedVendor && s.date === day).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDate(day)}
              className={cn(
                "flex flex-col items-center p-3 rounded-xl min-w-[72px] transition-all border",
                selectedDate === day
                  ? "bg-brand-500/15 border-brand-500/40 text-brand-500"
                  : "bg-muted/20 border-border/60 hover:bg-muted/40"
              )}
            >
              <span className="text-xs font-medium">{dayName}</span>
              <span className={cn("text-lg font-bold", isToday && "text-brand-500")}>{dayNum}</span>
              {slotCount > 0 && (
                <span className="text-[10px] text-muted-foreground">{slotCount} slot</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Slot Tersedia — {new Date(selectedDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vendorSlots.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                  Tidak ada slot untuk tanggal ini
                </div>
              ) : (
                <div className="space-y-2">
                  {vendorSlots
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((slot) => (
                      <div key={slot.id} className={cn(
                        "flex items-center justify-between p-3 rounded-xl transition-all",
                        slot.status === "available" && "bg-emerald-500/5 border border-emerald-500/20",
                        slot.status === "booked" && "bg-red-500/5 border border-red-500/20",
                        slot.status === "pending" && "bg-amber-500/5 border border-amber-500/20",
                      )}>
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            slot.status === "available" ? "bg-emerald-500" : slot.status === "booked" ? "bg-red-500" : "bg-amber-500"
                          )} />
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-sm">{slot.startTime} - {slot.endTime}</span>
                          {slot.clientName && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                              <User className="w-3 h-3" /> {slot.clientName}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={cn(
                            "text-[10px]",
                            slot.status === "available" && "bg-emerald-500/10 text-emerald-500",
                            slot.status === "booked" && "bg-red-500/10 text-red-500",
                            slot.status === "pending" && "bg-amber-500/10 text-amber-500",
                          )}>
                            {slot.status === "available" ? "Tersedia" : slot.status === "booked" ? "Terisi" : "Pending"}
                          </Badge>
                          {slot.status === "available" && (
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleBook(slot.id)}>
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Pesan
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statistik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(() => {
                const all = bookingSlots.filter((s) => s.vendorId === selectedVendor);
                const avail = all.filter((s) => s.status === "available").length;
                const booked = all.filter((s) => s.status === "booked").length;
                const pending = all.filter((s) => s.status === "pending").length;
                return (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5">
                      <span className="text-sm">Tersedia</span>
                      <span className="font-bold text-emerald-500">{avail}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/5">
                      <span className="text-sm">Pending</span>
                      <span className="font-bold text-amber-500">{pending}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/5">
                      <span className="text-sm">Terisi</span>
                      <span className="font-bold text-red-500">{booked}</span>
                    </div>
                    <div className="pt-2 border-t border-border/60">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-bold">{all.length}</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>

          {currentVendor && (
            <Card className="bg-gradient-to-br from-brand-500/5 to-purple-500/5 border-brand-500/20">
              <CardContent className="p-4">
                <h3 className="font-bold text-sm mb-1">{currentVendor.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{currentVendor.picName}</p>
                <Button size="sm" variant="outline" className="w-full" onClick={() => sendWa(currentVendor.whatsapp, `Halo ${currentVendor.picName}, saya ingin menjadwalkan konsultasi.`)}>
                  <Phone className="w-3.5 h-3.5 mr-1.5" /> Hubungi via WA
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card border border-border/60 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Tambah Slot Jadwal</h2>
                <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Vendor</label>
                  <select
                    value={form.vendorId}
                    onChange={(e) => setForm({ ...form, vendorId: e.target.value })}
                    className="w-full bg-muted/50 border border-border/60 rounded-lg px-3 py-2 text-sm"
                  >
                    {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Tanggal</label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Mulai</label>
                    <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Selesai</label>
                    <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Batal</Button>
                  <Button className="flex-1" onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-1.5" /> Tambah Slot
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
