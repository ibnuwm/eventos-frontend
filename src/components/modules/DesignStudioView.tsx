"use client";
import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Palette, Plus, X, Sparkles, Share2, Eye, Image, Grid,
  Heart, Download, CheckCircle2, Circle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const presetPalettes = [
  { name: "Gold & Ivory", colors: ["#C9A96E", "#2C1810", "#F5F0E8", "#8B7355", "#D4C5A0"] },
  { name: "Rustic Earth", colors: ["#5B7B5E", "#D4A574", "#F5EDE0", "#8B5E3C", "#A8C5A0"] },
  { name: "Blush Pink", colors: ["#F7CAC9", "#92A8D1", "#F5E1DA", "#D4A5A5", "#E8D1C5"] },
  { name: "Ocean Blue", colors: ["#006994", "#48C9B0", "#F0F8FF", "#1E3A5F", "#85C1E9"] },
  { name: "Modern Dark", colors: ["#1A1A2E", "#16213E", "#0F3460", "#E94560", "#533483"] },
  { name: "Tropical", colors: ["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#F38181"] },
];

const presetStyles = [
  "Modern Elegan", "Rustic Natural", "Classic Vintage", "Minimal White",
  "Tropical Beach", "Garden Party", "Industrial", "Bohemian",
];

export function DesignStudioView() {
  const { designBoards, projects, createDesignBoard, toggleShareBoard, showToast } = useApp();
  const [selectedProject, setSelectedProject] = useState("proj-1");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "", style: "Modern Elegan", colorPalette: [] as string[],
    notes: "", images: [] as string[],
  });

  const projectBoards = designBoards.filter((b) => b.projectId === selectedProject);

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    await createDesignBoard({
      project_id: selectedProject, title: form.title, style: form.style,
      color_palette: form.colorPalette.length > 0 ? form.colorPalette : presetPalettes[0].colors,
      notes: form.notes, images: [],
    });
    setForm({ title: "", style: "Modern Elegan", colorPalette: [], notes: "", images: [] });
    setShowCreate(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Design Studio</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Buat moodboard, color palette, dan style guide untuk acara</p>
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
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Buat Moodboard
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {projectBoards.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Palette className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">Belum ada moodboard untuk proyek ini</p>
                <Button onClick={() => setShowCreate(true)}>
                  <Sparkles className="w-4 h-4 mr-1.5" /> Buat Moodboard
                </Button>
              </CardContent>
            </Card>
          ) : projectBoards.map((board) => (
            <Card key={board.id} className="overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-brand-500/10 to-purple-500/10 relative">
                <div className="absolute inset-0 flex items-center justify-center gap-2 p-4">
                  {board.colorPalette.slice(0, 5).map((color, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white/20 shadow-lg" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-sm">{board.title}</h3>
                    <Badge className="mt-1 bg-muted text-muted-foreground text-[10px]">{board.style}</Badge>
                  </div>
                  <button
                    onClick={() => toggleShareBoard(board.id)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      board.isShared ? "bg-brand-500/10 text-brand-500" : "bg-muted/50 text-muted-foreground"
                    )}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {board.colorPalette.map((color, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-lg text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-muted-foreground">{color}</span>
                    </div>
                  ))}
                </div>

                {board.notes && (
                  <p className="text-xs text-muted-foreground mb-3">{board.notes}</p>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className={cn("w-3.5 h-3.5", board.isShared ? "text-emerald-500" : "text-muted-foreground")} />
                  <span>{board.isShared ? "Shared with client" : "Private"}</span>
                  <span className="ml-auto">{new Date(board.createdAt).toLocaleDateString("id-ID")}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Color Palettes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {presetPalettes.map((p) => (
                <div key={p.name} className="p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => { setForm({ ...form, colorPalette: p.colors }); showToast(`Palette "${p.name}" dipilih`); }}>
                  <div className="flex items-center gap-1 mb-1.5">
                    {p.colors.map((c, i) => (
                      <div key={i} className="flex-1 h-5 rounded" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <div className="text-xs font-medium">{p.name}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Style Guide</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              {presetStyles.map((s) => (
                <Badge key={s} className="bg-muted text-muted-foreground cursor-pointer hover:bg-brand-500/10 hover:text-brand-500 transition-colors"
                  onClick={() => { setForm({ ...form, style: s }); showToast(`Style "${s}" dipilih`); }}
                >{s}</Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card border border-border/60 rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Buat Moodboard Baru</h2>
                <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Judul</label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Mis: Moodboard Dekorasi Pelaminan" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Style</label>
                  <select
                    value={form.style}
                    onChange={(e) => setForm({ ...form, style: e.target.value })}
                    className="w-full bg-muted/50 border border-border/60 rounded-lg px-3 py-2 text-sm"
                  >
                    {presetStyles.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-2">Color Palette</label>
                  <div className="grid grid-cols-3 gap-2">
                    {presetPalettes.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => setForm({ ...form, colorPalette: p.colors })}
                        className={cn(
                          "p-2 rounded-lg border transition-all",
                          JSON.stringify(form.colorPalette) === JSON.stringify(p.colors)
                            ? "border-brand-500/50 bg-brand-500/10"
                            : "border-border/60 bg-muted/20"
                        )}
                      >
                        <div className="flex items-center gap-0.5 mb-1">
                          {p.colors.map((c, i) => (
                            <div key={i} className="flex-1 h-3 rounded-sm" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">{p.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Catatan</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Deskripsi konsep..."
                    className="w-full h-20 bg-muted/50 border border-border/60 rounded-lg px-3 py-2 text-sm resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Batal</Button>
                  <Button className="flex-1" onClick={handleCreate}>
                    <Sparkles className="w-4 h-4 mr-1.5" /> Buat Moodboard
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
