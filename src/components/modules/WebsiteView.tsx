"use client";
import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WebsiteTemplate } from "@/types";
import {
  Globe, Eye, ExternalLink, CheckCircle2, Clock, Edit3,
  Palette, Image, MapPin, Calendar, Heart, ToggleLeft, ToggleRight,
  Share2, Sparkles, Smartphone, Layout, Type, Link2,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const templates = [
  { id: "classic", label: "Classic Elegance", color: "from-rose-500 to-pink-600", desc: "Elegan & timeless" },
  { id: "modern", label: "Modern Premium", color: "from-brand-500 to-indigo-600", desc: "Minimalis modern" },
  { id: "rustic", label: "Rustic Nature", color: "from-emerald-500 to-teal-600", desc: "Alami & hangat" },
  { id: "minimal", label: "Minimal White", color: "from-slate-400 to-slate-600", desc: "Bersih & simpel" },
  { id: "adat", label: "Adat Tradisional", color: "from-amber-500 to-orange-600", desc: "Budaya Nusantara" },
] as const;

export function WebsiteView() {
  const { websites, projects, saveWebsite, publishWebsite, showToast } = useApp();
  const [selectedProject, setSelectedProject] = useState("proj-1");
  const [editMode, setEditMode] = useState(false);

  const currentSite = useMemo(() => websites.find((w) => w.projectId === selectedProject), [websites, selectedProject]);
  const currentProject = useMemo(() => projects.find((p) => p.id === selectedProject), [projects, selectedProject]);

  const [form, setForm] = useState({
    templateStyle: "modern" as string,
    coupleName: "",
    eventDate: "",
    venueName: "",
    venueAddress: "",
    googleMapsLink: "",
    loveStory: "",
    countdownEnabled: true,
    rsvpEnabled: true,
    galleryEnabled: true,
  });

  React.useEffect(() => {
    if (currentSite) {
      setForm({
        templateStyle: currentSite.templateStyle,
        coupleName: currentSite.coupleName,
        eventDate: currentSite.eventDate,
        venueName: currentSite.venueName,
        venueAddress: currentSite.venueAddress,
        googleMapsLink: currentSite.googleMapsLink || "",
        loveStory: currentSite.loveStory || "",
        countdownEnabled: currentSite.countdownEnabled,
        rsvpEnabled: currentSite.rsvpEnabled,
        galleryEnabled: currentSite.galleryEnabled,
      });
    } else if (currentProject) {
      setForm((prev) => ({
        ...prev,
        coupleName: currentProject.clientName,
        eventDate: currentProject.eventDate,
        venueName: currentProject.venueName,
      }));
    }
  }, [currentSite, currentProject]);

  const handleSave = async () => {
    await saveWebsite({
      project_id: selectedProject,
      template_style: form.templateStyle,
      couple_name: form.coupleName,
      event_date: form.eventDate,
      venue_name: form.venueName,
      venue_address: form.venueAddress,
      google_maps_link: form.googleMapsLink,
      love_story: form.loveStory,
      countdown_enabled: form.countdownEnabled,
      rsvp_enabled: form.rsvpEnabled,
      gallery_enabled: form.galleryEnabled,
      slug: (form.coupleName || currentProject?.clientName || "wedding").toLowerCase().replace(/\s+/g, "-"),
    });
    setEditMode(false);
  };

  const previewUrl = currentSite ? `/website/${currentSite.slug}` : null;

  const Toggle = ({ enabled, onChange, label }: { enabled: boolean; onChange: (v: boolean) => void; label: string }) => (
    <button onClick={() => onChange(!enabled)} className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border",
      enabled ? "bg-brand-500/10 border-brand-500/30 text-brand-500" : "bg-muted/30 border-border/60 text-muted-foreground"
    )}>
      {enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
      {label}
    </button>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Website Pernikahan</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Buat website undangan online untuk klien Anda</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedProject}
            onChange={(e) => { setSelectedProject(e.target.value); setEditMode(false); }}
            className="bg-muted/50 border border-border/60 rounded-lg px-3 py-2 text-sm"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          {currentSite?.isPublished ? (
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">Published</Badge>
          ) : (
            <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400">Draft</Badge>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {!editMode ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Template</CardTitle>
                    <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
                      <Edit3 className="w-4 h-4 mr-1.5" /> Edit Website
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {currentSite ? (
                    <div className="space-y-4">
                      <div className={cn(
                        "h-32 rounded-xl flex items-center justify-center text-white font-bold text-xl bg-gradient-to-br",
                        templates.find((t) => t.id === currentSite.templateStyle)?.color || "from-brand-500 to-indigo-600"
                      )}>
                        <div className="text-center">
                          <div className="text-2xl">{currentSite.coupleName}</div>
                          <div className="text-sm opacity-80 mt-1">{formatDate(currentSite.eventDate)}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground">Venue</div>
                          <div className="text-sm font-semibold mt-0.5">{currentSite.venueName}</div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground">Alamat</div>
                          <div className="text-sm font-semibold mt-0.5 truncate">{currentSite.venueAddress}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentSite.countdownEnabled && <Badge className="bg-brand-500/10 text-brand-500">Countdown</Badge>}
                        {currentSite.rsvpEnabled && <Badge className="bg-emerald-500/10 text-emerald-500">RSVP Online</Badge>}
                        {currentSite.galleryEnabled && <Badge className="bg-purple-500/10 text-purple-500">Galeri Foto</Badge>}
                        {currentSite.isPublished && <Badge className="bg-blue-500/10 text-blue-500">Public</Badge>}
                      </div>
                      <div className="flex gap-2">
                        <a href={previewUrl || "#"} target="_blank" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 text-xs font-medium hover:bg-muted/60 transition-colors">
                          <Eye className="w-4 h-4" /> Preview
                        </a>
                        <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/website/${currentSite.slug}`); showToast("Link disalin"); }}>
                          <Share2 className="w-4 h-4 mr-1.5" /> Salin Link
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Globe className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground mb-4">Belum ada website untuk proyek ini</p>
                      <Button onClick={() => setEditMode(true)}>
                        <Sparkles className="w-4 h-4 mr-1.5" /> Buat Website
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {currentSite?.isPublished && (
                <Card className="bg-emerald-500/5 border-emerald-500/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">Website sudah publik!</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Link: {window.location.origin}/website/{currentSite.slug}</p>
                    </div>
                    <a href={`/website/${currentSite.slug}`} target="_blank" className="inline-flex items-center gap-1.5 px-3 py-1.5 ml-auto rounded-lg border border-border/60 text-xs font-medium hover:bg-muted/60 transition-colors">
                      <ExternalLink className="w-4 h-4" /> Buka
                    </a>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Semua Website</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {websites.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Belum ada website</p>
                    ) : websites.map((site) => (
                      <div key={site.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-brand-500" />
                          <div>
                            <span className="font-medium text-sm">{site.coupleName}</span>
                            <span className="text-xs text-muted-foreground ml-2">{formatDate(site.eventDate)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {site.isPublished ? (
                            <Badge className="bg-emerald-500/10 text-emerald-500 text-xs">Public</Badge>
                          ) : (
                            <Badge className="bg-amber-500/10 text-amber-500 text-xs">Draft</Badge>
                          )}
                          <button onClick={() => { setSelectedProject(site.projectId); setEditMode(true); }} className="p-1.5 rounded-lg hover:bg-muted">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Edit Website</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-2">Pilih Template</label>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setForm({ ...form, templateStyle: t.id })}
                        className={cn(
                          "relative overflow-hidden rounded-xl p-3 text-white text-center transition-all",
                          `bg-gradient-to-br ${t.color}`,
                          form.templateStyle === t.id && "ring-2 ring-white ring-offset-2 ring-offset-background scale-105"
                        )}
                      >
                        <Palette className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs font-bold">{t.label}</div>
                        <div className="text-[10px] opacity-80">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Nama Pasangan</label>
                    <Input value={form.coupleName} onChange={(e) => setForm({ ...form, coupleName: e.target.value })} placeholder="Anisa & Budi" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Tanggal Acara</label>
                    <Input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Nama Venue</label>
                  <Input value={form.venueName} onChange={(e) => setForm({ ...form, venueName: e.target.value })} placeholder="Grand Hotel Ballroom" />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Alamat Venue</label>
                  <Input value={form.venueAddress} onChange={(e) => setForm({ ...form, venueAddress: e.target.value })} placeholder="Jl. MH Thamrin No.1, Jakarta" />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Link Google Maps</label>
                  <Input value={form.googleMapsLink} onChange={(e) => setForm({ ...form, googleMapsLink: e.target.value })} placeholder="https://maps.google.com/?q=..." />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Cerita Cinta</label>
                  <textarea
                    value={form.loveStory}
                    onChange={(e) => setForm({ ...form, loveStory: e.target.value })}
                    placeholder="Tuliskan cerita pertemuan pasangan..."
                    className="w-full h-24 bg-muted/50 border border-border/60 rounded-lg px-3 py-2 text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-2">Fitur Website</label>
                  <div className="flex flex-wrap gap-2">
                    <Toggle enabled={form.countdownEnabled} onChange={(v) => setForm({ ...form, countdownEnabled: v })} label="Countdown" />
                    <Toggle enabled={form.rsvpEnabled} onChange={(v) => setForm({ ...form, rsvpEnabled: v })} label="RSVP Online" />
                    <Toggle enabled={form.galleryEnabled} onChange={(v) => setForm({ ...form, galleryEnabled: v })} label="Galeri Foto" />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setEditMode(false)}>Batal</Button>
                  <Button className="flex-1" onClick={handleSave}>Simpan Website</Button>
                  {currentSite && !currentSite.isPublished && (
                    <Button variant="secondary" onClick={async () => { await handleSave(); await publishWebsite(selectedProject); }}>
                      <Globe className="w-4 h-4 mr-1.5" /> Publikasikan
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Template Tersedia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {templates.map((t) => (
                <div key={t.id} className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  form.templateStyle === t.id ? "bg-brand-500/10 border border-brand-500/30" : "bg-muted/20 hover:bg-muted/40"
                )}>
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white bg-gradient-to-br", t.color)}>
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.label}</div>
                    <div className="text-xs text-muted-foreground">{t.desc}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-brand-500/5 to-purple-500/5 border-brand-500/20">
            <CardContent className="p-4">
              <Sparkles className="w-6 h-6 text-brand-500 mb-2" />
              <h3 className="font-bold text-sm mb-1">Undangan Digital Terintegrasi</h3>
              <p className="text-xs text-muted-foreground">Website undangan terhubung dengan modul Tamu & RSVP untuk tracking kehadiran real-time.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>✅ Gunakan foto prewedding sebagai cover</p>
              <p>✅ Aktifkan RSVP untuk tracking otomatis</p>
              <p>✅ Bagikan link website ke tamu via WhatsApp</p>
              <p>✅ Custom domain tersedia (Pro plan)</p>
            </CardContent>
          </Card>

          <a href="/storefront" target="_blank" className="inline-flex items-center justify-center gap-1.5 w-full px-4 py-2 rounded-lg border border-border/60 text-sm font-medium hover:bg-muted/60 transition-colors">
            <ExternalLink className="w-4 h-4" /> Cari Vendor Fotografer
          </a>
        </div>
      </div>
    </motion.div>
  );
}
