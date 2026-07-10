"use client";
import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatRupiah, cn } from "@/lib/utils";
import {
  Gift, Plus, Copy, Check, Share2, QrCode,
  Heart, Users, Target, Banknote,
} from "lucide-react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";

export function GiftRegistryView() {
  const { giftRegistries, createGiftRegistry, projects } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [bankName, setBankName] = useState("BCA");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const handleCreate = () => {
    if (!title || !targetAmount) return;
    createGiftRegistry({
      title,
      description,
      target_amount: Number(targetAmount),
      collected_amount: 0,
      bank_name: bankName,
      account_number: accountNumber,
      account_name: accountName,
      project_id: projects[0]?.id,
      type: "cash",
      status: "active",
      contributors: [],
    });
    setShowForm(false);
    setTitle("");
    setDescription("");
    setTargetAmount("");
    setBankName("BCA");
    setAccountNumber("");
    setAccountName("");
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gift Registry</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Cash registry dengan QRIS & transfer bank</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Registry Baru
        </Button>
      </div>

      {showForm && (
        <Card className="border-brand-500/30 bg-brand-500/5">
          <CardContent className="p-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Judul Registry</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Kado Pernikahan Kami" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Deskripsi</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ucapan terima kasih untuk para tamu..." rows={2} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Target Dana (Rp)</label>
                <Input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="50000000" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Bank</label>
                <Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="BCA" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">No. Rekening</label>
                <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="1234567890" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Atas Nama</label>
                <Input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="John Doe" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Batal</Button>
              <Button size="sm" onClick={handleCreate}>Buat Registry</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {giftRegistries.length === 0 && !showForm ? (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground space-y-3">
            <Gift className="w-12 h-12 mx-auto opacity-30" />
            <p>Belum ada gift registry</p>
            <p className="text-xs text-muted-foreground">Buat registry untuk menerima kado dalam bentuk cash via QRIS atau transfer bank</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {giftRegistries.map((r: any) => {
            const progress = r.target_amount > 0 ? Math.min((r.collected_amount / r.target_amount) * 100, 100) : 0;
            const shareLink = `${window.location.origin}/gift/${r.id}`;
            return (
              <Card key={r.id}>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{r.title}</h3>
                        <Badge className="bg-brand-500/15 text-brand-500 text-[10px]">{r.type === "cash" ? "Cash" : r.type}</Badge>
                      </div>
                      {r.description && <p className="text-sm text-muted-foreground">{r.description}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Terkumpul</span>
                      <span className="font-semibold">{formatRupiah(r.collected_amount)} / {formatRupiah(r.target_amount)}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{progress.toFixed(0)}% tercapai</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">Info Rekening</span>
                        <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => copyToClipboard(`${r.bank_name} ${r.account_number} a.n. ${r.account_name}`, `rek-${r.id}`)}>
                          {copied === `rek-${r.id}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                      <p className="font-semibold text-sm">{r.bank_name}</p>
                      <p className="text-sm">{r.account_number}</p>
                      <p className="text-xs text-muted-foreground">a.n. {r.account_name}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 flex flex-col items-center justify-center">
                      <QrCode className="w-6 h-6 mb-1 text-brand-500" />
                      <span className="text-xs text-muted-foreground">QRIS / QR Code</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{r.contributors?.length || 0} kontributor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => copyToClipboard(shareLink, `share-${r.id}`)}>
                        {copied === `share-${r.id}` ? <Check className="w-3 h-3 mr-1" /> : <Share2 className="w-3 h-3 mr-1" />}
                        {copied === `share-${r.id}` ? "Tersalin!" : "Bagikan"}
                      </Button>
                    </div>
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
