"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";
import {
  FileSpreadsheet, Plus, Send, Download, CheckCircle2, Loader2, X, FileText,
  GripVertical, ArrowUpDown, Sparkles, MessageCircle, Smartphone
} from "lucide-react";
import * as svc from "@/lib/mock-service";
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
import { QuotationItem } from "@/types";

function SortableQuoteItem({ item, onToggle }: { item: QuotationItem; onToggle: (id: string) => void }) {
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
        "p-4 rounded-xl border transition-all flex items-center gap-3 select-none",
        item.isSelected
          ? "bg-card border-brand-500/40 shadow-md shadow-brand-500/5"
          : "bg-muted/20 border-border/60 opacity-60 hover:opacity-80"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 rounded-lg hover:bg-muted text-muted-foreground cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <input
        type="checkbox"
        checked={item.isSelected}
        onChange={() => onToggle(item.id)}
        className="w-5 h-5 rounded accent-brand-500 cursor-pointer flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase text-brand-400">
            [{item.category}]
          </span>
          {item.isOptional && (
            <Badge variant="warning" className="text-xs">Opsional</Badge>
          )}
        </div>
        <div className="text-sm font-bold text-foreground mt-0.5 truncate">{item.title}</div>
        <div className="text-xs text-muted-foreground">Vendor: <strong className="text-foreground/80">{item.vendorName}</strong></div>
      </div>

      <div className="text-base font-extrabold text-emerald-400 flex-shrink-0">
        {formatRupiah(item.price)}
      </div>
    </div>
  );
}

interface InvoiceData {
  id: string;
  termin_type: string;
  amount: number;
  status: string;
}

export function QuotationView() {
  const { quotationItems, toggleQuoteItem, addQuoteItem, exportPdf, showToast } = useApp();
  const [discount, setDiscount] = useState<number>(0);
  const [lockLoading, setLockLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [waLoading, setWaLoading] = useState(false);
  const [lockedInvoices, setLockedInvoices] = useState<InvoiceData[] | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [items, setItems] = useState(quotationItems);

  useEffect(() => {
    setItems(quotationItems);
  }, [quotationItems]);

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

  const selectedItems = items.filter((i) => i.isSelected);
  const subtotal = selectedItems.reduce((acc, i) => acc + i.price, 0);
  const woFee = 15000000;
  const grandTotal = subtotal + woFee - discount;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [formCategory, setFormCategory] = useState("Special Effect");
  const [formTitle, setFormTitle] = useState("");
  const [formVendor, setFormVendor] = useState("");
  const [formPrice, setFormPrice] = useState(0);
  const [formOptional, setFormOptional] = useState(false);

  const handleOpenModal = () => {
    setFormCategory("Special Effect");
    setFormTitle("");
    setFormVendor("");
    setFormPrice(0);
    setFormOptional(false);
    setModalOpen(true);
  };

  const handleSubmitModal = () => {
    if (!formTitle.trim() || !formVendor.trim() || formPrice <= 0) {
      showToast("Harap isi semua field (nama, vendor, harga)");
      return;
    }
    addQuoteItem({
      category: formCategory,
      title: formTitle,
      vendorName: formVendor,
      price: formPrice,
      isSelected: true,
      isOptional: formOptional,
    });
    setModalOpen(false);
  };

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
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-card border border-border/60 rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground font-display">Tambah Modul Layanan</h3>
                  <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground ring-focus">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Kategori</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-muted border border-border/60 rounded-xl px-3 py-2.5 text-sm text-foreground focus:border-brand-500 outline-none"
                    >
                      <option>Special Effect</option>
                      <option>Venue & Catering</option>
                      <option>Decoration</option>
                      <option>Documentation</option>
                      <option>Entertainment</option>
                      <option>Add-On</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Nama Layanan</label>
                    <Input
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Contoh: Pyrotechnic & Dry Ice Machine"
                      className="bg-muted border-border/60"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Nama Vendor</label>
                    <Input
                      value={formVendor}
                      onChange={(e) => setFormVendor(e.target.value)}
                      placeholder="Contoh: ProVisual FX"
                      className="bg-muted border-border/60"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Harga (Rp)</label>
                    <Input
                      type="number"
                      value={formPrice || ""}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      placeholder="Contoh: 8500000"
                      className="bg-muted border-border/60"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                    <input type="checkbox" checked={formOptional} onChange={(e) => setFormOptional(e.target.checked)} className="accent-brand-500" />
                    Opsional (Add-On)
                  </label>
                </div>
                <div className="flex gap-2 mt-5">
                  <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Batal</Button>
                  <Button className="flex-1" onClick={handleSubmitModal}>Tambah</Button>
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
            <FileSpreadsheet className="w-5 h-5 text-brand-400" />
            Quotation Builder
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Drag & drop item untuk mengatur urutan. Centang/hilangkan untuk simulasi harga interaktif.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={exportLoading} onClick={async () => {
            setExportLoading(true);
            const selected = quotationItems.filter((i) => i.isSelected);
            const rows = selected.map((item, i) => `
              <tr>
                <td style="text-align:center;padding:10px;border-bottom:1px solid #e5e7eb">${i + 1}</td>
                <td style="padding:10px;border-bottom:1px solid #e5e7eb">${item.category}</td>
                <td style="padding:10px;border-bottom:1px solid #e5e7eb">${item.title}</td>
                <td style="padding:10px;border-bottom:1px solid #e5e7eb">${item.vendorName}</td>
                <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:right">Rp ${item.price.toLocaleString("id-ID")}</td>
              </tr>`).join("");
            const subtotalVal = selected.reduce((a, i) => a + i.price, 0);
            const woFee = 15000000;
            const grandTotalVal = subtotalVal + woFee - discount;
            const html = `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><title>Quotation - EventOS</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',Arial,sans-serif;max-width:800px;margin:0 auto;padding:40px;color:#1f2937;line-height:1.6}
  .header{text-align:center;padding-bottom:20px;border-bottom:3px solid #4338ca;margin-bottom:30px}
  .header h1{font-size:24px;color:#4338ca;margin-bottom:4px}
  .header p{color:#6b7280;font-size:13px}
  .info{display:flex;justify-content:space-between;margin-bottom:30px;font-size:13px;color:#6b7280}
  .info div{flex:1}
  .info strong{color:#1f2937;display:block}
  table{width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px}
  th{background:#4338ca;color:#fff;padding:12px 10px;text-align:left;font-weight:600}
  td{padding:10px;border-bottom:1px solid #e5e7eb}
  tr:nth-child(even){background:#f9fafb}
  .summary{width:300px;margin-left:auto;border-top:2px solid #4338ca;padding-top:12px;font-size:13px}
  .summary div{display:flex;justify-content:space-between;padding:4px 0}
  .summary .grand{font-size:18px;font-weight:700;color:#4338ca;border-top:1px solid #e5e7eb;padding-top:8px;margin-top:4px}
  .terms{margin-top:30px;padding-top:20px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280}
  .terms h3{color:#1f2937;font-size:13px;margin-bottom:6px}
  .terms ul{padding-left:16px}
  .footer{text-align:center;margin-top:30px;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:12px}
  .stamp{display:inline-block;border:2px solid #4338ca;color:#4338ca;padding:4px 16px;border-radius:4px;font-size:11px;font-weight:700;margin-top:8px}
</style></head>
<body>
  <div class="header">
    <h1>SURAT PENAWARAN</h1>
    <p>Royal Emerald Wedding — 800 Pax</p>
  </div>
  <div class="info">
    <div><strong>Kepada Yth.</strong>Anisa Rahma & Budi Santoso</div>
    <div><strong>Tanggal</strong>${new Date().toLocaleDateString("id-ID", {year:"numeric",month:"long",day:"numeric"})}</div>
    <div><strong>No. Quotation</strong>Q-${Date.now().toString(36).toUpperCase()}</div>
  </div>
  <table>
    <thead><tr><th style="text-align:center">No</th><th>Kategori</th><th>Deskripsi</th><th>Vendor</th><th style="text-align:right">Harga</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="summary">
    <div><span>Subtotal (${selected.length} item)</span><span>Rp ${subtotalVal.toLocaleString("id-ID")}</span></div>
    <div><span>WO Fee (koordinator)</span><span>Rp ${woFee.toLocaleString("id-ID")}</span></div>
    ${discount > 0 ? `<div><span>Diskon</span><span>-Rp ${discount.toLocaleString("id-ID")}</span></div>` : ""}
    <div class="grand"><span>Grand Total</span><span>Rp ${grandTotalVal.toLocaleString("id-ID")}</span></div>
  </div>
  <div class="terms">
    <h3>Syarat & Ketentuan</h3>
    <ul>
      <li>Harga berlaku selama 14 hari sejak tanggal penawaran</li>
      <li>Pembayaran DP 30% diperlukan untuk mengunci jadwal</li>
      <li>Pembatalan H-30 dikenakan biaya 50% dari total kontrak</li>
    </ul>
  </div>
  <div class="footer">
    <div class="stamp">EVENTOS.ID — OFFICIAL</div>
    <p style="margin-top:6px">Dokumen ini dibuat secara otomatis oleh EventOS.id &copy; ${new Date().getFullYear()}</p>
  </div>
  <script>window.onload=function(){setTimeout(function(){window.print()},500)}</script>
</body></html>`;
            const win = window.open("", "_blank");
            if (win) { win.document.write(html); win.document.close(); }
            showToast("Tab baru terbuka. Tekan Ctrl+P / Cmd+P untuk simpan sebagai PDF");
            setExportLoading(false);
          }}>
            {exportLoading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Download className="w-4 h-4 mr-1.5" />}
            Export PDF
          </Button>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500" disabled={waLoading} onClick={async () => {
            setWaLoading(true);
            await svc.sendQuotationWa("quote-1");
            showToast("Link quotation dikirim via WhatsApp!");
            setWaLoading(false);
          }}>
            {waLoading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Send className="w-4 h-4 mr-1.5" />}
            Kirim WA
          </Button>
        </div>
      </div>

      {/* AI + QRIS Quick Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 rounded-xl bg-gradient-to-r from-purple-500/10 via-transparent to-transparent border border-purple-500/20 p-3 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span className="text-xs text-muted-foreground">
            <strong className="text-foreground">AI Saran:</strong> Tambahkan paket "Dokumentasi Premium" — 80% klien dengan budget {">"} Rp 150jt memilih opsi ini.
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Kirim via WhatsApp</span>
          <span className="font-bold text-emerald-400">QRIS • GoPay • OVO</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Draggable Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass-card border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/60">
              <div>
                <CardTitle className="text-base font-bold text-foreground font-display">
                  <ArrowUpDown className="w-4 h-4 inline mr-2 text-brand-400" />
                  Paket: Royal Emerald Wedding (800 Pax)
                </CardTitle>
                <p className="text-xs text-muted-foreground">Drag untuk urutkan, centang untuk pilih</p>
              </div>
              <Button size="sm" variant="outline" onClick={handleOpenModal} className="gap-1.5">
                <Plus className="w-4 h-4" />
                Tambah
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2.5">
                    {items.map((item) => (
                      <SortableQuoteItem key={item.id} item={item} onToggle={toggleQuoteItem} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary Panel */}
        <div className="space-y-4">
          <Card className="glass-card border-border/60 sticky top-6">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold text-foreground font-display flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                Kalkulasi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Subtotal ({selectedItems.length} item):</span>
                <span className="font-semibold text-foreground">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Biaya Koordinasi WO:</span>
                <span className="font-semibold">{formatRupiah(woFee)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Diskon:</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={discount || ""}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-24 h-7 text-xs text-right bg-muted border-border/60"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                <span className="font-bold text-foreground text-base">TOTAL:</span>
                <motion.span
                  key={grandTotal}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="font-extrabold text-2xl text-emerald-400 font-display"
                >
                  {formatRupiah(grandTotal)}
                </motion.span>
              </div>

              {lockedInvoices === null && (
                <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-200 space-y-1.5 leading-relaxed">
                  <div className="font-bold flex items-center gap-1.5 text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Otomatisasi Invoice
                  </div>
                  <div>Saat disetujui klien, sistem terbitkan:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-brand-300 font-medium">
                    <li>DP 30%: {formatRupiah(grandTotal * 0.3)}</li>
                    <li>Termin 2 (50%): {formatRupiah(grandTotal * 0.5)}</li>
                    <li>Pelunasan (20%): {formatRupiah(grandTotal * 0.2)}</li>
                  </ul>
                </div>
              )}

              <Button
                className="w-full h-11 font-bold shadow-lg shadow-brand-500/25"
                disabled={lockLoading}
                onClick={async () => {
                  setLockLoading(true);
                  const res = await svc.lockQuotation("quote-1");
                  if (res?.status === "success") {
                    const invoices = [
                      { id: "inv-dp", termin_type: "DP 30%", amount: Math.round(grandTotal * 0.3), status: "unpaid" },
                      { id: "inv-termin1", termin_type: "Termin 1 (50%)", amount: Math.round(grandTotal * 0.5), status: "unpaid" },
                      { id: "inv-pelunasan", termin_type: "Pelunasan (20%)", amount: Math.round(grandTotal * 0.2), status: "unpaid" },
                    ];
                    setLockedInvoices(invoices);
                    showToast("Quotation dikunci! 3 invoice berhasil diterbitkan");
                  }
                  setLockLoading(false);
                }}
              >
                {lockLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Kunci & Buat Invoice
              </Button>

              {lockedInvoices && lockedInvoices.length > 0 && (
                <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 font-bold shadow-lg shadow-emerald-600/30" onClick={() => setInvoiceModalOpen(true)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Lihat Invoice ({lockedInvoices.length})
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoice Modal */}
      <AnimatePresence>
        {invoiceModalOpen && lockedInvoices && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setInvoiceModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-card border border-border/60 rounded-2xl p-6 w-full max-w-lg mx-auto shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground font-display flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    Status Invoice
                  </h3>
                  <button onClick={() => setInvoiceModalOpen(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {lockedInvoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-3.5 rounded-xl bg-muted border border-border/60">
                      <div>
                        <div className="font-semibold text-foreground">{inv.termin_type}</div>
                        <div className="text-emerald-400 font-bold mt-0.5">{formatRupiah(inv.amount)}</div>
                      </div>
                      <Badge variant={inv.status === "paid" ? "success" : "secondary"}>
                        {inv.status === "paid" ? "LUNAS" : "Belum Dibayar"}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline" onClick={() => setInvoiceModalOpen(false)}>Tutup</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
