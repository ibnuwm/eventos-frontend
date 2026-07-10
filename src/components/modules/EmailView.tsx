"use client";
import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  MailPlus, Plus, Send, Eye, Copy, Clock, CheckCircle2,
  AlertCircle, FileText, Users, Star,
} from "lucide-react";
import { motion } from "framer-motion";

export function EmailView() {
  const { emailTemplates, createEmailTemplate } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("reminder");
  const [content, setContent] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const handleCreate = () => {
    if (!name || !subject || !content) return;
    createEmailTemplate({ name, subject, category, content, variables: [] });
    setShowForm(false);
    setName("");
    setSubject("");
    setCategory("reminder");
    setContent("");
  };

  const categories: Record<string, string> = {
    reminder: "Pengingat",
    marketing: "Marketing",
    invoice: "Invoice",
    followup: "Follow Up",
    thankyou: "Thank You",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Email Marketing</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Template email & broadcast untuk klien</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Template Baru
        </Button>
      </div>

      {showForm && (
        <Card className="border-brand-500/30 bg-brand-500/5">
          <CardContent className="p-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Nama Template</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Pengingat Pembayaran" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Kategori</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(categories).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Subjek Email</label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Pengingat: Pembayaran DP untuk {project_name}" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Konten HTML</label>
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6}
                  placeholder={`<h1>Hai {client_name}</h1>\n<p>Ini adalah pengingat untuk pembayaran...</p>`} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="w-3 h-3" />
              <span>Gunakan {'{variable_name}'} untuk data dinamis</span>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Batal</Button>
              <Button size="sm" onClick={handleCreate}>Simpan Template</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {emailTemplates.length === 0 && !showForm ? (
        <Card><CardContent className="text-center py-12 text-muted-foreground space-y-3">
          <MailPlus className="w-12 h-12 mx-auto opacity-30" />
          <p>Belum ada template email</p>
          <p className="text-xs">Buat template untuk otomatisasi komunikasi dengan klien</p>
        </CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {emailTemplates.map((t: any) => (
            <Card key={t.id} className={cn("hover:border-brand-500/30 transition-colors", previewId === t.id && "border-brand-500 ring-1 ring-brand-500/20")}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-brand-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{t.name}</p>
                      <Badge className="text-[9px] py-0 mt-0.5" variant="outline">
                        {categories[t.category as keyof typeof categories] || t.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground truncate">Subjek: {t.subject}</p>
                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{t.created_at ? new Date(t.created_at).toLocaleDateString("id-ID") : "Baru"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setPreviewId(previewId === t.id ? null : t.id)}>
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                {previewId === t.id && (
                  <div className="mt-2 p-3 bg-muted/30 rounded-lg text-xs border border-border/40 max-h-32 overflow-y-auto">
                    <div className="font-medium text-muted-foreground mb-1">Subjek: {t.subject}</div>
                    <div className="whitespace-pre-wrap">{t.content}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" /> Variable yang Tersedia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            {["client_name", "project_name", "event_date", "total_amount", "due_date", "vendor_name", "invoice_number", "wedding_date"].map((v) => (
              <code key={v} className="bg-muted/50 px-2 py-1 rounded text-brand-500 font-mono">{"{"}{v}{"}"}</code>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
