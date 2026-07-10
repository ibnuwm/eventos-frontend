"use client";
import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Guest } from "@/types";
import {
  UserPlus, Search, Users, CheckCircle2, Clock, XCircle, Download,
  QrCode, MessageCircle, Upload, Filter, MoreHorizontal, Plus, X,
  Phone, Check, UserCheck, FileSpreadsheet, AlertCircle, Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const categories = ["Semua", "VIP", "Keluarga", "Umum"] as const;
const statuses = ["semua", "confirmed", "pending", "declined"] as const;

export function GuestView() {
  const { guests, projects, addGuest, importGuests, updateGuestStatus, deleteGuest, showToast, sendWa } = useApp();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<string>("Semua");
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showQR, setShowQR] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", whatsapp: "", category: "Umum" as string, guestCount: "1", notes: "", tableNumber: "" });
  const [csvText, setCsvText] = useState("");
  const [selectedProject, setSelectedProject] = useState("proj-1");

  const stats = useMemo(() => {
    const projectGuests = guests.filter((g) => g.projectId === selectedProject);
    return {
      total: projectGuests.length,
      confirmed: projectGuests.filter((g) => g.rsvpStatus === "confirmed").length,
      pending: projectGuests.filter((g) => g.rsvpStatus === "pending").length,
      declined: projectGuests.filter((g) => g.rsvpStatus === "declined").length,
      totalGuests: projectGuests.reduce((s, g) => s + g.guestCount, 0),
    };
  }, [guests, selectedProject]);

  const filtered = useMemo(() => {
    let list = guests.filter((g) => g.projectId === selectedProject);
    if (search) list = list.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()) || g.whatsapp?.includes(search));
    if (filterCat !== "Semua") list = list.filter((g) => g.category === filterCat);
    if (filterStatus !== "semua") list = list.filter((g) => g.rsvpStatus === filterStatus);
    return list;
  }, [guests, search, filterCat, filterStatus, selectedProject]);

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    await addGuest({ ...form, project_id: selectedProject, guest_count: Number(form.guestCount) });
    setForm({ name: "", whatsapp: "", category: "Umum", guestCount: "1", notes: "", tableNumber: "" });
    setShowAdd(false);
  };

  const handleImport = async () => {
    const lines = csvText.trim().split("\n").filter(Boolean);
    const parsed = lines.map((line) => {
      const [name, whatsapp, category = "Umum", guestCount = "1"] = line.split(",").map((s) => s.trim());
      return { name, whatsapp, category, guest_count: parseInt(guestCount) || 1, project_id: selectedProject };
    });
    if (parsed.length === 0) return;
    await importGuests(parsed);
    setCsvText("");
    setShowImport(false);
  };

  const handleWaBlast = () => {
    const pending = guests.filter((g) => g.projectId === selectedProject && g.rsvpStatus === "pending" && g.whatsapp);
    if (pending.length === 0) {
      showToast("Tidak ada tamu pending dengan nomor WA");
      return;
    }
    const msg = `Yth. Tamu Undangan,\n\nDengan hormat, kami mengingatkan untuk mengkonfirmasi kehadiran Anda pada acara pernikahan melalui link berikut:\n\nhttps://eventos.id/rsvp/{token}\n\nTerima kasih.\n\n- EventOS`;
    sendWa(pending[0].whatsapp || "", msg);
    showToast(`Pesan akan dikirim ke ${pending.length} tamu`);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "confirmed": return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Hadir</Badge>;
      case "declined": return <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20">Tidak Hadir</Badge>;
      default: return <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20">Menunggu</Badge>;
    }
  };

  const catBadge = (cat: string) => {
    const colors: Record<string, string> = {
      VIP: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
      Keluarga: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
      Umum: "bg-muted text-muted-foreground",
    };
    return <Badge className={cn(colors[cat] || colors.Umum)}>{cat}</Badge>;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tamu & RSVP</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Kelola daftar tamu, pantau konfirmasi kehadiran</p>
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
          <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
            <Upload className="w-4 h-4 mr-1.5" /> Import CSV
          </Button>
          <Button size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Tambah Tamu
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="bg-gradient-to-br from-brand-500/10 to-brand-600/5 border-brand-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Users className="w-5 h-5 text-brand-500" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total Tamu</p>
            <p className="text-lg font-semibold text-brand-500">{stats.totalGuests} <span className="text-xs font-normal text-muted-foreground">orang</span></p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-2xl font-bold text-emerald-500">{stats.confirmed}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Konfirmasi Hadir</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold text-amber-500">{stats.pending}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Menunggu</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold text-red-500">{stats.declined}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Tidak Hadir</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <CheckCircle2 className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold text-purple-500">{stats.confirmed + stats.pending}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total Diharapkan</p>
            <p className="text-xs mt-0.5 text-muted-foreground">
              {(stats.totalGuests / (stats.total || 1) * (stats.confirmed + stats.pending) / (stats.total || 1)).toFixed(0)} orang
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau WA..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-60"
                />
              </div>
              <div className="flex gap-1">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilterCat(c)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      filterCat === c ? "bg-brand-500/15 text-brand-600 dark:text-brand-400" : "text-muted-foreground hover:bg-muted/60"
                    )}
                  >{c}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      filterStatus === s ? "bg-brand-500/15 text-brand-600 dark:text-brand-400" : "text-muted-foreground hover:bg-muted/60"
                    )}
                  >{s === "semua" ? "Semua" : s === "confirmed" ? "Hadir" : s === "pending" ? "Menunggu" : "Tidak"}</button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={handleWaBlast}>
                <MessageCircle className="w-4 h-4 mr-1.5" /> WA Blast
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/20">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Nama</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Kategori</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">WhatsApp</th>
                  <th className="text-center px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Qty</th>
                  <th className="text-center px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Meja</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Menu</th>
                  <th className="text-center px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">Belum ada tamu. Tambahkan tamu pertama Anda!</td></tr>
                ) : filtered.map((guest) => (
                  <tr key={guest.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/20 to-brand-600/20 flex items-center justify-center text-xs font-bold text-brand-500">
                          {guest.name.charAt(0)}
                        </div>
                        <span className="font-medium">{guest.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{catBadge(guest.category)}</td>
                    <td className="px-4 py-3">
                      {guest.whatsapp ? (
                        <a href={`https://wa.me/${guest.whatsapp.replace(/\D/g, "")}`} target="_blank" className="text-brand-500 hover:underline text-xs">
                          {guest.whatsapp}
                        </a>
                      ) : <span className="text-muted-foreground text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold">{guest.guestCount}</td>
                    <td className="px-4 py-3 text-center">{statusBadge(guest.rsvpStatus)}</td>
                    <td className="px-4 py-3 text-xs">{guest.tableNumber || "—"}</td>
                    <td className="px-4 py-3 text-xs max-w-[150px] truncate">{guest.menuChoice || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {guest.rsvpStatus === "pending" && (
                          <>
                            <button onClick={() => updateGuestStatus(guest.id, "confirmed")} className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors" title="Konfirmasi hadir">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => updateGuestStatus(guest.id, "declined")} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors" title="Tidak hadir">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <button onClick={() => setShowQR(guest.id)} className="p-1.5 rounded-lg hover:bg-brand-500/10 text-brand-500 transition-colors" title="QR Check-in">
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        {guest.whatsapp && (
                          <button onClick={() => sendWa(guest.whatsapp!, `Halo ${guest.name}, kami tunggu kehadirannya ya! 🙏`)} className="p-1.5 rounded-lg hover:bg-brand-500/10 text-brand-500 transition-colors" title="Kirim WA">
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={() => deleteGuest(guest.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors" title="Hapus">
                          <X className="w-3.5 h-3.5 opacity-60" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowAdd(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card border border-border/60 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Tambah Tamu Baru</h2>
                <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Nama Tamu *</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama lengkap" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">WhatsApp</label>
                    <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="0812-xxxx" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Kategori</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-muted/50 border border-border/60 rounded-lg px-3 py-2 text-sm">
                      <option value="VIP">VIP</option>
                      <option value="Keluarga">Keluarga</option>
                      <option value="Umum">Umum</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Jumlah Orang</label>
                    <Input type="number" min={1} value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">No. Meja</label>
                    <Input value={form.tableNumber} onChange={(e) => setForm({ ...form, tableNumber: e.target.value })} placeholder="VIP-1" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Catatan</label>
                  <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Alergi, kursi roda, dll" />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Batal</Button>
                  <Button className="flex-1" onClick={handleAdd}>Simpan</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showImport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowImport(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card border border-border/60 rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Import Tamu dari CSV</h2>
                <button onClick={() => setShowImport(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">Format: <code className="bg-muted px-2 py-0.5 rounded text-brand-500">nama, whatsapp, kategori, jumlah</code></p>
                <p className="text-xs text-muted-foreground">Contoh: <code className="bg-muted px-2 py-0.5 rounded">Budi Santoso,0812-xxxx,VIP,2</code></p>
                <textarea
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder={"Nama Lengkap,No WhatsApp,Kategori,Jumlah\nBudi Santoso,0812-1111-0001,VIP,2\nSari Dewi,0812-1111-0002,Keluarga,3"}
                  className="w-full h-32 bg-muted/50 border border-border/60 rounded-lg px-3 py-2 text-sm font-mono resize-none"
                />
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowImport(false)}>Batal</Button>
                  <Button className="flex-1" onClick={handleImport} disabled={!csvText.trim()}>
                    <Upload className="w-4 h-4 mr-1.5" /> Import
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQR && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowQR(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card border border-border/60 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
              <QrCode className="w-32 h-32 mx-auto text-brand-500 mb-4" />
              <h3 className="font-bold text-lg">QR Check-in</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">Scan untuk check-in tamu di hari H</p>
              <div className="bg-muted/50 rounded-lg p-3 mb-4">
                <p className="text-xs text-muted-foreground break-all">https://eventos.id/checkin/{showQR}</p>
              </div>
              <Button className="w-full" onClick={() => { navigator.clipboard.writeText(`https://eventos.id/checkin/${showQR}`); showToast("Link check-in disalin"); setShowQR(null); }}>
                Salin Link Check-in
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
