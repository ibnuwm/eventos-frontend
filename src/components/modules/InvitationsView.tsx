"use client";
import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DigitalInvitation } from "@/types";
import {
  Mail, Send, Plus, Eye, Edit3, Copy, CheckCircle2, Clock,
  AlertCircle, Palette, Users, MapPin, Calendar, Phone, X,
  MessageCircle, Sparkles, ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const templates = [
  { id: "classic", label: "Classic", color: "from-rose-500 to-pink-600" },
  { id: "modern", label: "Modern", color: "from-brand-500 to-indigo-600" },
  { id: "rustic", label: "Rustic", color: "from-emerald-500 to-teal-600" },
  { id: "minimal", label: "Minimal", color: "from-slate-400 to-slate-600" },
  { id: "adat", label: "Adat", color: "from-amber-500 to-orange-600" },
] as const;

export function InvitationsView() {
  const { invitations, projects, guests, createInvitation, sendInvitation, showToast, sendWa } = useApp();
  const [selectedProject, setSelectedProject] = useState("proj-1");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    templateStyle: "modern" as string,
    coupleName: "",
    eventDate: "",
    eventTime: "",
    venueName: "",
    venueAddress: "",
    googleMapsLink: "",
    senderName: "",
    message: "",
    guestNames: [] as string[],
    selectedGuests: new Set<string>(),
  });

  const projectInvitations = useMemo(() =>
    invitations.filter((i) => i.projectId === selectedProject),
    [invitations, selectedProject]
  );

  const projectGuests = useMemo(() =>
    guests.filter((g) => g.projectId === selectedProject && g.whatsapp),
    [guests, selectedProject]
  );

  const currentProject = useMemo(() =>
    projects.find((p) => p.id === selectedProject),
    [projects, selectedProject]
  );

  const handleCreate = async () => {
    if (!form.coupleName || !form.eventDate) return;
    const guestNames = projectGuests
      .filter((_, i) => form.selectedGuests.has(`g-${i}`))
      .map((g) => g.name);
    const inv = {
      project_id: selectedProject,
      template_style: form.templateStyle,
      couple_name: form.coupleName,
      event_date: form.eventDate,
      event_time: form.eventTime,
      venue_name: form.venueName,
      venue_address: form.venueAddress,
      google_maps_link: form.googleMapsLink,
      guest_names: guestNames.length > 0 ? guestNames : form.guestNames,
      sender_name: form.senderName || form.coupleName,
      message: form.message,
    };
    await createInvitation(inv);
    setForm({
      templateStyle: "modern", coupleName: "", eventDate: "", eventTime: "",
      venueName: "", venueAddress: "", googleMapsLink: "",
      senderName: "", message: "", guestNames: [], selectedGuests: new Set(),
    });
    setShowCreate(false);
    showToast("Undangan digital dibuat");
  };

  const handleSend = async (inv: DigitalInvitation) => {
    await sendInvitation(inv.id);
    const waText = `*Undangan Pernikahan ${inv.coupleName}*\n\n${inv.message || "Mohon doa restu dan kehadirannya"}\n\n📅 ${formatDate(inv.eventDate)}\n⏰ ${inv.eventTime}\n📍 ${inv.venueName}\n📌 ${inv.venueAddress}\n\n${inv.googleMapsLink ? `🗺️ ${inv.googleMapsLink}` : ""}`;
    const guestWithWa = projectGuests.filter((g) => inv.guestNames.includes(g.name) && g.whatsapp);
    if (guestWithWa.length > 0) {
      sendWa(guestWithWa[0].whatsapp!, waText);
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`, "_blank");
    }
    showToast(`Undangan dikirim ke ${inv.guestNames.length} tamu`);
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "sent": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "opened": return <Eye className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "sent": return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">Terkirim</Badge>;
      case "opened": return <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400">Dibuka</Badge>;
      default: return <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400">Draft</Badge>;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Undangan Digital</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Buat dan kirim undangan digital via WhatsApp</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-muted/50 border border-border/60 rounded-lg px-3 py-2 text-sm"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          <Button size="sm" onClick={() => {
            if (currentProject) {
              setForm((prev) => ({
                ...prev, coupleName: currentProject.clientName,
                eventDate: currentProject.eventDate,
                venueName: currentProject.venueName,
                senderName: currentProject.clientName.split("&")[0]?.trim() || currentProject.clientName,
              }));
            }
            setShowCreate(true);
          }}>
            <Plus className="w-4 h-4 mr-1.5" /> Buat Undangan
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {projectInvitations.length === 0 ? (
          <div className="lg:col-span-3 text-center py-16">
            <Mail className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Undangan Digital</h3>
            <p className="text-sm text-muted-foreground mb-4">Buat undangan digital untuk dikirim ke tamu via WhatsApp</p>
            <Button onClick={() => setShowCreate(true)}>
              <Sparkles className="w-4 h-4 mr-1.5" /> Buat Undangan Pertama
            </Button>
          </div>
        ) : projectInvitations.map((inv) => (
          <Card key={inv.id} className={cn(
            "relative overflow-hidden",
            inv.status === "sent" && "border-emerald-500/30",
          )}>
            {inv.status === "sent" && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-2xl flex items-start justify-end p-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
            )}
            <CardContent className="p-5">
              <div className={cn(
                "h-20 rounded-xl flex items-center justify-center text-white font-bold bg-gradient-to-br mb-4",
                templates.find((t) => t.id === inv.templateStyle)?.color || "from-brand-500 to-indigo-600"
              )}>
                <div className="text-center">
                  <div className="text-sm">{inv.coupleName}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{formatDate(inv.eventDate)}</div>
                </div>
              </div>

              <h3 className="font-bold text-sm mb-3">{inv.coupleName}</h3>

              <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(inv.eventDate)} • {inv.eventTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{inv.venueName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" />
                  <span>{inv.guestNames.length} tamu undangan</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  {statusIcon(inv.status)}
                  <span className="text-xs font-medium">{statusBadge(inv.status)}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {inv.status === "sent" && inv.sentAt ? `Dikirim ${formatDate(inv.sentAt)}` : "Belum dikirim"}
                </span>
              </div>

              <div className="flex gap-2">
                {inv.status === "draft" && (
                  <Button size="sm" className="flex-1" onClick={() => handleSend(inv)}>
                    <Send className="w-3.5 h-3.5 mr-1" /> Kirim WA
                  </Button>
                )}
                {inv.status === "sent" && (
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleSend(inv)}>
                    <MessageCircle className="w-3.5 h-3.5 mr-1" /> Kirim Ulang
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-card border border-border/60 rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Buat Undangan Digital</h2>
                <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-2">Pilih Template</label>
                  <div className="flex gap-2">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setForm({ ...form, templateStyle: t.id })}
                        className={cn(
                          "flex-1 p-3 rounded-xl text-white text-center text-xs font-bold bg-gradient-to-br transition-all",
                          t.color,
                          form.templateStyle === t.id && "ring-2 ring-white ring-offset-2 ring-offset-background scale-105"
                        )}
                      >{t.label}</button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Nama Pasangan</label>
                    <Input value={form.coupleName} onChange={(e) => setForm({ ...form, coupleName: e.target.value })} placeholder="Anisa & Budi" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Tanggal</label>
                    <Input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Waktu Acara</label>
                    <Input value={form.eventTime} onChange={(e) => setForm({ ...form, eventTime: e.target.value })} placeholder="09.00 WIB" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Nama Pengirim</label>
                    <Input value={form.senderName} onChange={(e) => setForm({ ...form, senderName: e.target.value })} placeholder="Anisa" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Venue</label>
                  <Input value={form.venueName} onChange={(e) => setForm({ ...form, venueName: e.target.value })} placeholder="Grand Hotel Ballroom" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Alamat</label>
                  <Input value={form.venueAddress} onChange={(e) => setForm({ ...form, venueAddress: e.target.value })} placeholder="Jl. MH Thamrin No.1" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Link Google Maps (opsional)</label>
                  <Input value={form.googleMapsLink} onChange={(e) => setForm({ ...form, googleMapsLink: e.target.value })} placeholder="https://maps.google.com/?q=..." />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Pesan Undangan</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Mohon doa restu dan kehadirannya 🙏"
                    className="w-full h-20 bg-muted/50 border border-border/60 rounded-lg px-3 py-2 text-sm resize-none"
                  />
                </div>

                {projectGuests.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-2">Pilih Tamu untuk Dikirimi Undangan</label>
                    <div className="max-h-32 overflow-y-auto space-y-1 border border-border/60 rounded-lg p-2">
                      {projectGuests.map((g, i) => (
                        <label key={g.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/40 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.selectedGuests.has(`g-${i}`)}
                            onChange={() => {
                              const next = new Set(form.selectedGuests);
                              next.has(`g-${i}`) ? next.delete(`g-${i}`) : next.add(`g-${i}`);
                              setForm({ ...form, selectedGuests: next });
                            }}
                            className="rounded border-border"
                          />
                          <span className="text-sm">{g.name}</span>
                          {g.whatsapp && <span className="text-xs text-muted-foreground ml-auto">{g.whatsapp}</span>}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Batal</Button>
                  <Button className="flex-1" onClick={handleCreate}>
                    <Sparkles className="w-4 h-4 mr-1.5" /> Buat Undangan
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
