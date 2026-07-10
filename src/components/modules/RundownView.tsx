"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { Clock, Plus, GripVertical, Check, Timer, User, Radio, Play, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { RundownItem } from "@/types";

function SortableRundownItem({ item, index }: { item: RundownItem; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-4 rounded-xl border border-border/60 bg-card hover:bg-muted/30 transition-all flex items-center gap-3 select-none group",
        isDragging && "shadow-xl shadow-brand-500/10 border-brand-500/40"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 rounded-lg hover:bg-muted text-muted-foreground cursor-grab active:cursor-grabbing touch-none opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex flex-col items-center justify-center font-bold text-xs">
        <span>{item.timeSlot.split(" - ")[0]}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{item.activityTitle}</span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Timer className="w-3 h-3" />
            {item.durationMinutes} menit
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {item.divisionPic}
          </span>
        </div>
      </div>

      <Badge variant="outline" className="text-xs flex-shrink-0">
        {item.timeSlot}
      </Badge>
    </div>
  );
}

export function RundownView() {
  const { rundown, addRundownItem, showToast } = useApp();
  const [items, setItems] = useState(rundown);
  const [cueActive, setCueActive] = useState(false);

  useEffect(() => {
    setItems(rundown);
  }, [rundown]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIdx = prev.findIndex((i) => i.id === active.id);
        const newIdx = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [formTimeSlot, setFormTimeSlot] = useState("06.00");
  const [formDuration, setFormDuration] = useState(60);
  const [formActivity, setFormActivity] = useState("");
  const [formPic, setFormPic] = useState("");

  const handleAdd = () => {
    if (!formActivity.trim() || !formPic.trim()) {
      showToast("Harap isi aktivitas dan PIC");
      return;
    }
    const timeSlot = `${formTimeSlot} - ${(parseInt(formTimeSlot) + Math.ceil(formDuration / 60)).toString().padStart(2, "0")}.${formTimeSlot.split(".")[1] || "00"}`;
    addRundownItem({ timeSlot, durationMinutes: formDuration, activityTitle: formActivity, divisionPic: formPic });
    setModalOpen(false);
    setFormActivity("");
    setFormPic("");
  };

  const totalDuration = items.reduce((acc, i) => acc + i.durationMinutes, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Add Item Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-card border border-border/60 rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl">
                <h3 className="text-lg font-bold text-foreground font-display mb-4">Tambah Kegiatan</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Jam Mulai</label>
                    <Input
                      value={formTimeSlot}
                      onChange={(e) => setFormTimeSlot(e.target.value)}
                      placeholder="06.00"
                      className="bg-muted border-border/60"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Durasi (menit)</label>
                    <Input
                      type="number"
                      value={formDuration || ""}
                      onChange={(e) => setFormDuration(Number(e.target.value))}
                      className="bg-muted border-border/60"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Nama Aktivitas</label>
                    <Input
                      value={formActivity}
                      onChange={(e) => setFormActivity(e.target.value)}
                      placeholder="Contoh: Prosesi Akad Nikah"
                      className="bg-muted border-border/60"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">PIC Divisi</label>
                    <Input
                      value={formPic}
                      onChange={(e) => setFormPic(e.target.value)}
                      placeholder="Contoh: MC & Tim Sound"
                      className="bg-muted border-border/60"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-5">
                  <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Batal</Button>
                  <Button className="flex-1" onClick={handleAdd}>Tambah</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            Rundown Builder
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Drag & drop untuk mengatur urutan kegiatan. Auto time-shift terhitung otomatis.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-1.5 font-semibold">
          <Plus className="w-4 h-4" />
          Tambah Kegiatan
        </Button>
      </div>

      {/* Timeline Overview */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-sm">
          <Clock className="w-4 h-4 text-brand-400" />
          <span className="font-semibold text-foreground">{items.length} Kegiatan</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm">
          <Timer className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-foreground">Total: {Math.floor(totalDuration / 60)}j {totalDuration % 60}m</span>
        </div>
      </div>

      {/* StageCommand Show-Caller */}
      <Card className="glass-card border-border/60 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
          <CardHeader className="pb-4 border-b border-border/60">
            <CardTitle className="text-base font-bold text-foreground font-display flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              StageCommand Show-Caller
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Show Director tekan GO CUE. Seluruh HP kru bergetar haptik serentak dengan hitung mundur kedip 5 detik via WebSocket. Tidak perlu walkie-talkie lagi.
                </p>
                <div className={`p-4 rounded-xl border text-center font-extrabold transition-all duration-500 ${
                  cueActive ? "bg-red-500/10 text-red-400 border-red-500/30 animate-pulse" : "bg-muted/50 border-border/60 text-muted-foreground"
                }`}>
                  {cueActive ? "CUE #14: GRAND ENTRANCE... 3... 2... 1... GO!" : "Siap menerima instruksi CUE"}
                </div>
                <Button
                  disabled={cueActive}
                  onClick={() => { setCueActive(true); showToast("Seluruh HP kru bergetar! CUE #14 Grand Entrance dikirim!"); setTimeout(() => setCueActive(false), 5000); }}
                  className="gap-2 font-bold w-full"
                >
                  <Play className="w-4 h-4" />
                  {cueActive ? "CUE SEDANG BERJALAN..." : "[ GO CUE #14: GRAND ENTRANCE ]"}
                </Button>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
                  <Smartphone className="w-8 h-8 text-amber-400" />
                </div>
                <div className="text-sm font-bold text-foreground">Haptik Broadcast</div>
                <div className="text-xs text-muted-foreground">Semua HP kru getar serentak dalam 0.5 detik</div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Draggable Rundown List */}
      <Card className="glass-card border-border/60">
        <CardHeader className="pb-4 border-b border-border/60">
          <CardTitle className="text-base font-bold text-foreground font-display">
            Timeline Kegiatan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2.5">
                {items.map((item, idx) => (
                  <SortableRundownItem key={item.id} item={item} index={idx} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
    </motion.div>
  );
}
