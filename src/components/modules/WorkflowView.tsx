"use client";
import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkflowRule } from "@/types";
import {
  Workflow, Zap, MessageCircle, CheckSquare, DollarSign,
  Calendar, ToggleLeft, ToggleRight, Plus, X, Sparkles,
  ArrowRight, Send, FileText, Users, Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const triggerOptions = [
  { value: "lead_created", label: "Lead Baru Dibuat", icon: Users, color: "text-blue-500" },
  { value: "lead_won", label: "Lead Menjadi Won", icon: Zap, color: "text-emerald-500" },
  { value: "payment_received", label: "Pembayaran Diterima", icon: DollarSign, color: "text-green-500" },
  { value: "task_completed", label: "Tugas Selesai", icon: CheckSquare, color: "text-purple-500" },
  { value: "date_approaching", label: "Tanggal Mendekat", icon: Calendar, color: "text-amber-500" },
];

const actionOptions = [
  { value: "send_wa", label: "Kirim WhatsApp", icon: MessageCircle, color: "text-emerald-500" },
  { value: "assign_task", label: "Buat Tugas", icon: CheckSquare, color: "text-blue-500" },
  { value: "update_status", label: "Update Status", icon: ArrowRight, color: "text-indigo-500" },
  { value: "send_email", label: "Kirim Email", icon: Send, color: "text-rose-500" },
  { value: "create_project", label: "Buat Proyek", icon: FileText, color: "text-amber-500" },
];

export function WorkflowView() {
  const { workflows, toggleWorkflow, createWorkflow, showToast } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "", trigger: "lead_created" as string, action: "send_wa" as string,
    actionConfig: {} as Record<string, string>,
  });

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    await createWorkflow({
      name: form.name, trigger: form.trigger, action: form.action,
      action_config: form.actionConfig,
    });
    setForm({ name: "", trigger: "lead_created", action: "send_wa", actionConfig: {} });
    setShowCreate(false);
  };

  const getTriggerInfo = (value: string) => triggerOptions.find((t) => t.value === value);
  const getActionInfo = (value: string) => actionOptions.find((a) => a.value === value);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workflow Automation</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Otomatisasi tugas berulang — tinggal set, jalan sendiri</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Buat Rule
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {workflows.length === 0 ? (
          <div className="lg:col-span-2 text-center py-16">
            <Workflow className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Workflow</h3>
            <p className="text-sm text-muted-foreground mb-4">Buat aturan otomatisasi untuk menghemat waktu Anda</p>
            <Button onClick={() => setShowCreate(true)}>
              <Sparkles className="w-4 h-4 mr-1.5" /> Buat Workflow Pertama
            </Button>
          </div>
        ) : workflows.map((wf) => {
          const trigger = getTriggerInfo(wf.trigger);
          const action = getActionInfo(wf.action);
          const TriggerIcon = trigger?.icon || Bell;
          const ActionIcon = action?.icon || Zap;

          return (
            <Card key={wf.id} className={cn(
              "border transition-all",
              wf.isActive ? "border-emerald-500/30 bg-emerald-500/[0.02]" : "border-border/60"
            )}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-sm">{wf.name}</h3>
                    <Badge className={cn(
                      "mt-1.5 text-[10px]",
                      wf.isActive ? "bg-emerald-500/15 text-emerald-500" : "bg-muted text-muted-foreground"
                    )}>
                      {wf.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                  <button
                    onClick={() => toggleWorkflow(wf.id)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      wf.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-muted/50 text-muted-foreground"
                    )}
                  >
                    {wf.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20">
                  <div className="flex items-center gap-2 flex-1">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-muted", trigger?.color)}>
                      <TriggerIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-semibold">Trigger</div>
                      <div className="text-xs font-semibold">{trigger?.label || wf.trigger}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex items-center gap-2 flex-1">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-muted", action?.color)}>
                      <ActionIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-semibold">Action</div>
                      <div className="text-xs font-semibold">{action?.label || wf.action}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  {wf.actionConfig?.template && <p>Template: &quot;{wf.actionConfig.template.substring(0, 50)}...&quot;</p>}
                  {wf.actionConfig?.days_before && <p>H-{wf.actionConfig.days_before} sebelum acara</p>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card border border-border/60 rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Buat Workflow Baru</h2>
                <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Nama Rule</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Mis: Kirim WA saat lead baru" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-2">Trigger (Pemicu)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {triggerOptions.map((t) => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.value}
                          onClick={() => setForm({ ...form, trigger: t.value })}
                          className={cn(
                            "flex items-center gap-2 p-3 rounded-xl text-xs font-medium transition-all border",
                            form.trigger === t.value ? "border-brand-500/50 bg-brand-500/10" : "border-border/60 bg-muted/20 hover:bg-muted/40"
                          )}
                        >
                          <Icon className={cn("w-4 h-4", t.color)} />
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-2">Action (Aksi)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {actionOptions.map((a) => {
                      const Icon = a.icon;
                      return (
                        <button
                          key={a.value}
                          onClick={() => setForm({ ...form, action: a.value })}
                          className={cn(
                            "flex items-center gap-2 p-3 rounded-xl text-xs font-medium transition-all border",
                            form.action === a.value ? "border-brand-500/50 bg-brand-500/10" : "border-border/60 bg-muted/20 hover:bg-muted/40"
                          )}
                        >
                          <Icon className={cn("w-4 h-4", a.color)} />
                          {a.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Batal</Button>
                  <Button className="flex-1" onClick={handleCreate}>
                    <Sparkles className="w-4 h-4 mr-1.5" /> Buat Workflow
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
