"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatDate } from "@/lib/utils";
import { CheckSquare, Calendar, Users, AlertTriangle, CheckCircle2, Clock, Share2, FileText } from "lucide-react";

export function ProjectView() {
  const { projects, toggleTask, showToast } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "");

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const divisions = ["Photography", "Decoration", "Catering", "Sound & MC"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Modul 2 & 7: Project Management & Checklist (ClickUp Event Style)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manajemen milestone event per divisi dengan bobot kritis dan pemantauan T-minus timeline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => showToast("📄 Checklist dibagikan ke seluruh vendor terkait via WhatsApp Webhook.")}>
            <Share2 className="w-4 h-4 mr-1.5" />
            Share Vendor WA
          </Button>
          <Button size="sm" onClick={() => showToast("📥 PDF Checklist & Milestone berhasil diunduh.")}>
            <FileText className="w-4 h-4 mr-1.5" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Project Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {projects.map((proj) => (
          <button
            key={proj.id}
            onClick={() => setSelectedProjectId(proj.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeProject.id === proj.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
            }`}
          >
            <span>{proj.title}</span>
            <Badge variant="secondary" className="text-[10px] bg-black/30">
              {proj.progressPercentage}%
            </Badge>
          </button>
        ))}
      </div>

      {/* Project Overview Card */}
      {activeProject && (
        <Card className="border-slate-800 bg-slate-900/90">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Klien & Venue</div>
                <div className="text-lg font-bold text-white mt-1">{activeProject.clientName}</div>
                <div className="text-xs text-slate-400 mt-0.5">{activeProject.venueName}</div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Hitung Mundur Timeline</div>
                <div className="text-lg font-bold text-amber-400 mt-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> T-{activeProject.daysRemaining} Hari Lagi
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{formatDate(activeProject.eventDate)}</div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nilai Kontrak Proyek</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">{formatRupiah(activeProject.contractValue)}</div>
                <Badge variant="success" className="mt-1">
                  Status: {activeProject.paymentStatus.toUpperCase()}
                </Badge>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1.5">
                  <span>Progress Penyelesaian Tugas</span>
                  <span className="text-indigo-400 font-bold">{activeProject.progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${activeProject.progressPercentage}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500 mt-1.5">
                  {activeProject.tasks.filter((t) => t.isCompleted).length} dari {activeProject.tasks.length} Milestone kritis selesai
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Checklist by Divisions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {divisions.map((div) => {
          const divTasks = activeProject?.tasks.filter((t) => t.division === div) || [];
          return (
            <Card key={div} className="border-slate-800 bg-slate-900/80">
              <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-indigo-400" />
                    Divisi {div}
                  </CardTitle>
                </div>
                <Badge variant="secondary">
                  {divTasks.filter((t) => t.isCompleted).length} / {divTasks.length} Done
                </Badge>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {divTasks.length === 0 ? (
                  <div className="text-xs text-slate-500 italic py-2">Belum ada checklist khusus untuk divisi ini.</div>
                ) : (
                  divTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(activeProject.id, task.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        task.isCompleted
                          ? "bg-slate-950/40 border-slate-800/60 opacity-60"
                          : "bg-slate-900 border-slate-700 hover:border-slate-600 shadow-sm"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => {}} // handled by outer div
                        className="mt-1 w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className={`text-sm font-semibold ${task.isCompleted ? "line-through text-slate-400" : "text-white"}`}>
                          {task.title}
                        </div>
                        <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
                          <span>Vendor: <strong className="text-indigo-300">{task.assignedVendorName || "Internal WO"}</strong></span>
                          <span>Batas: {formatDate(task.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
