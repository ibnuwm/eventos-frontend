"use client";
import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatRupiah, cn } from "@/lib/utils";
import {
  Video, Plus, Copy, ExternalLink, Clock, Calendar,
  Phone, PhoneOff, Link, Users, Check, X,
} from "lucide-react";
import { motion } from "framer-motion";

export function VideoCallView() {
  const { meetings, createMeeting, projects, vendors } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("zoom");
  const [vendorId, setVendorId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [copied, setCopied] = useState<string | null>(null);

  const handleCreate = () => {
    if (!title || !dateTime) return;
    createMeeting({
      title,
      platform,
      vendor_id: vendorId || undefined,
      project_id: projects[0]?.id,
      date_time: new Date(dateTime).toISOString(),
      duration: Number(duration),
      status: "scheduled",
    });
    setShowForm(false);
    setTitle("");
    setPlatform("zoom");
    setVendorId("");
    setDateTime("");
    setDuration("30");
  };

  const copyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const platformColors: Record<string, string> = {
    zoom: "bg-blue-500/15 text-blue-500",
    google_meet: "bg-emerald-500/15 text-emerald-500",
    whatsapp: "bg-green-500/15 text-green-500",
    telegram: "bg-sky-500/15 text-sky-500",
    custom: "bg-muted text-muted-foreground",
  };

  const statusColors: Record<string, string> = {
    scheduled: "bg-amber-500/15 text-amber-500",
    completed: "bg-emerald-500/15 text-emerald-500",
    cancelled: "bg-red-500/15 text-red-500",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Video Call</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Jadwalkan & kelola meeting online dengan klien / vendor</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Meeting Baru
        </Button>
      </div>

      {showForm && (
        <Card className="border-brand-500/30 bg-brand-500/5">
          <CardContent className="p-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Judul Meeting</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Konsultasi Dekorasi" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Platform</label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="google_meet">Google Meet</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp Video</SelectItem>
                    <SelectItem value="telegram">Telegram</SelectItem>
                    <SelectItem value="custom">Link Kustom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Vendor (opsional)</label>
                <Select value={vendorId} onValueChange={setVendorId}>
                  <SelectTrigger><SelectValue placeholder="Pilih vendor" /></SelectTrigger>
                  <SelectContent>
                    {vendors.slice(0, 10).map((v: any) => (
                      <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Tanggal & Waktu</label>
                <Input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Durasi (menit)</label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 menit</SelectItem>
                    <SelectItem value="30">30 menit</SelectItem>
                    <SelectItem value="45">45 menit</SelectItem>
                    <SelectItem value="60">1 jam</SelectItem>
                    <SelectItem value="90">1.5 jam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Batal</Button>
              <Button size="sm" onClick={handleCreate}>Buat Meeting</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {meetings.length === 0 && !showForm ? (
        <Card><CardContent className="text-center py-12 text-muted-foreground space-y-3">
          <Video className="w-12 h-12 mx-auto opacity-30" />
          <p>Belum ada meeting</p>
          <p className="text-xs">Jadwalkan video call dengan klien atau vendor</p>
        </CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {meetings.map((m: any) => {
            const generatedLink = m.link || `https://${m.platform}.app/meet/${m.id || "abc"}`;
            return (
              <Card key={m.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", platformColors[m.platform] || platformColors.custom)}>
                        <Video className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{m.title}</p>
                        <Badge className={cn("text-[9px] py-0 mt-0.5", statusColors[m.status] || statusColors.scheduled)}>
                          {m.status === "scheduled" ? "Terjadwal" : m.status === "completed" ? "Selesai" : "Dibatalkan"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(m.date_time).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(m.date_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} - {m.duration || 30} menit</span>
                    </div>
                    {m.vendor_id && (
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3 h-3" />
                        <span>Vendor: {vendors.find((v: any) => v.id === m.vendor_id)?.name || m.vendor_id}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                    <Button variant="outline" size="sm" className="h-7 text-xs flex-1" onClick={() => copyLink(generatedLink, m.id)}>
                      {copied === m.id ? <Check className="w-3 h-3 mr-1" /> : <Link className="w-3 h-3 mr-1" />}
                      {copied === m.id ? "Tersalin" : "Salin Link"}
                    </Button>
                    <Button size="sm" className="h-7 text-xs flex-1" onClick={() => window.open(generatedLink, "_blank")}>
                      <ExternalLink className="w-3 h-3 mr-1" /> Buka
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
