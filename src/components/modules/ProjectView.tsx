"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatDate } from "@/lib/utils";
import {
  CheckSquare, Calendar, Users, AlertTriangle, CheckCircle2, Clock,
  Share2, FileText, ListTodo, ArrowRight, GripVertical
} from "lucide-react";
import { motion } from "framer-motion";

export function ProjectView() {
  const { projects, toggleTask, exportPdf, sendWa, showToast } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "");

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const divisions = ["Photography", "Decoration", "Catering", "Sound & MC"];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-brand-400" />
            Task Management
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Milestone event per divisi dengan bobot kritis dan T-minus timeline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => {
              if (!activeProject) return;
              const text = `*Checklist Proyek: ${activeProject.title}*\n` + activeProject.tasks.map((t) =>
                `[${t.isCompleted ? "✓" : " "}] ${t.title} — ${t.assignedVendorName || "Internal"} (Batas: ${t.dueDate})`
              ).join("\n");
              sendWa(activeProject.clientName, text);
            }}>
            <Share2 className="w-4 h-4 mr-1.5" /> Share WA
          </Button>
          <Button size="sm" onClick={() => {
              if (!activeProject) return;
              const cols = ["Nama Tugas", "Divisi", "Vendor", "Batas", "Status"];
              const rows = activeProject.tasks.map((t) => ({
                "Nama Tugas": t.title, Divisi: t.division,
                Vendor: t.assignedVendorName || "Internal", Batas: t.dueDate,
                Status: t.isCompleted ? "✓ Selesai" : "◻ Belum",
              }));
              const content = `<h2>${activeProject.title}</h2>` +
                rows.map((r) => `<tr>${cols.map((c) => `<td>${r[c as keyof typeof r]}</td>`).join("")}</tr>`).join("");
              exportPdf("Checklist Proyek", `<table>${cols.map((c) => `<th>${c}</th>`).join("")}</table>${content}`);
            }}>
            <FileText className="w-4 h-4 mr-1.5" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Project Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/60 scrollbar-thin">
        {projects.map((proj) => (
          <button
            key={proj.id}
            onClick={() => setSelectedProjectId(proj.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeProject.id === proj.id
                ? "bg-brand-500 text-white shadow-md"
                : "bg-muted text-muted-foreground hover:text-foreground border border-border/60"
            }`}
          >
            {proj.title}
            <Badge variant="secondary" className="text-xs bg-black/20">{proj.progressPercentage}%</Badge>
          </button>
        ))}
      </div>

      {/* Project Overview */}
      {activeProject && (
        <motion.div
          key={activeProject.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card border-border/60">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground">Klien & Venue</div>
                  <div className="text-lg font-bold text-foreground mt-1 font-display">{activeProject.clientName}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{activeProject.venueName}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground">Hitung Mundur</div>
                  <div className="text-lg font-bold text-amber-400 mt-1 flex items-center gap-1.5 font-display">
                    <Clock className="w-4 h-4" /> T-{activeProject.daysRemaining} Hari
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{formatDate(activeProject.eventDate)}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground">Nilai Kontrak</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1 font-display">{formatRupiah(activeProject.contractValue)}</div>
                  <Badge variant="success" className="mt-1 text-xs">{activeProject.paymentStatus.toUpperCase()}</Badge>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1.5">
                    <span>Progress</span>
                    <span className="text-brand-400 font-bold">{activeProject.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${activeProject.progressPercentage}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 via-purple-500 to-emerald-400"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1.5">
                    {activeProject.tasks.filter((t) => t.isCompleted).length} dari {activeProject.tasks.length} selesai
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Checklist by Divisions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {divisions.map((div) => {
          const divTasks = activeProject?.tasks.filter((t) => t.division === div) || [];
          return (
            <motion.div
              key={div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass-card border-border/60 h-full">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-brand-400" />
                    Divisi {div}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {divTasks.filter((t) => t.isCompleted).length}/{divTasks.length}
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 space-y-2.5">
                  {divTasks.length === 0 ? (
                    <div className="text-xs text-muted-foreground italic py-2">Belum ada checklist</div>
                  ) : (
                    divTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        whileHover={{ x: 2 }}
                        onClick={() => toggleTask(activeProject.id, task.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          task.isCompleted
                            ? "bg-muted/20 border-border/40 opacity-60"
                            : "bg-card border-border/60 hover:border-brand-500/30 shadow-sm"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={task.isCompleted}
                          onChange={() => toggleTask(activeProject.id, task.id)}
                          className="mt-1 w-4 h-4 rounded accent-brand-500 cursor-pointer flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-semibold ${task.isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                            {task.title}
                          </div>
                          <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                            <span>Vendor: <strong className="text-brand-300">{task.assignedVendorName || "Internal WO"}</strong></span>
                            <span>Batas: {formatDate(task.dueDate)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
