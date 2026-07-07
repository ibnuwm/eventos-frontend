"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";
import { FileSpreadsheet, Plus, Send, Download, CheckCircle2, Loader2, X, FileText } from "lucide-react";
import { lockQuotation as apiLockQuotation, exportQuotation as apiExportQuotation, sendQuotationWa as apiSendQuotationWa } from "@/lib/api";

interface InvoiceData {
  id: string;
  termin_type: string;
  amount: number;
  status: string;
}

export function QuotationView() {
  const { quotationItems, toggleQuoteItem, addQuoteItem, showToast } = useApp();
  const [discount, setDiscount] = useState<number>(0);
  const [lockLoading, setLockLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [waLoading, setWaLoading] = useState(false);
  const [lockedInvoices, setLockedInvoices] = useState<InvoiceData[] | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [formCategory, setFormCategory] = useState("Special Effect");
  const [formTitle, setFormTitle] = useState("");
  const [formVendor, setFormVendor] = useState("");
  const [formPrice, setFormPrice] = useState(0);
  const [formOptional, setFormOptional] = useState(false);

  const selectedItems = quotationItems.filter((i) => i.isSelected);
  const subtotal = selectedItems.reduce((acc, i) => acc + i.price, 0);
  const woFee = 15000000;
  const grandTotal = subtotal + woFee - discount;

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
    <div className="space-y-6">
      {/* Modal Tambah Modul */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Tambah Modul Layanan</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Kategori</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
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
                <label className="text-xs font-semibold text-slate-400 block mb-1">Nama Layanan</label>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Pyrotechnic & Dry Ice Machine"
                  className="bg-slate-950 border-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Nama Vendor</label>
                <Input
                  value={formVendor}
                  onChange={(e) => setFormVendor(e.target.value)}
                  placeholder="Contoh: ProVisual FX"
                  className="bg-slate-950 border-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Harga (Rp)</label>
                <Input
                  type="number"
                  value={formPrice || ""}
                  onChange={(e) => setFormPrice(Number(e.target.value))}
                  placeholder="Contoh: 8500000"
                  className="bg-slate-950 border-slate-800"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input type="checkbox" checked={formOptional} onChange={(e) => setFormOptional(e.target.checked)} className="accent-indigo-600" />
                Opsional (Add-On)
              </label>
            </div>
            <div className="flex gap-2 mt-5">
              <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Batal</Button>
              <Button className="flex-1 bg-indigo-600 hover:bg-indigo-500" onClick={handleSubmitModal}>Tambah</Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Modul 4: Drag & Drop Quotation Builder
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gantikan Microsoft Word manual dengan modul penawaran interaktif yang dapat dicentang langsung oleh klien.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={exportLoading}
            onClick={async () => {
              setExportLoading(true);
              const res = await apiExportQuotation("quote-1");
              if (res?.data) {
                const itemsHtml = res.data.items.map((item: any, i: number) =>
                  `<tr><td style="padding:8px;border-bottom:1px solid #ddd;text-align:center">${i + 1}</td><td style="padding:8px;border-bottom:1px solid #ddd">${item.category}</td><td style="padding:8px;border-bottom:1px solid #ddd">${item.title}</td><td style="padding:8px;border-bottom:1px solid #ddd">${item.vendor}</td><td style="padding:8px;border-bottom:1px solid #ddd;text-align:right">Rp ${Number(item.price).toLocaleString("id-ID")}</td></tr>`
                ).join("");
                const total = Number(res.data.grand_total || res.data.subtotal).toLocaleString("id-ID");
                const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${res.data.title}</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#333}h1{color:#4338ca;border-bottom:2px solid #4338ca;padding-bottom:10px}table{width:100%;border-collapse:collapse;margin-top:20px}th{background:#4338ca;color:white;padding:10px;text-align:left}td{padding:8px}tr:nth-child(even){background:#f9fafb}.total{font-size:20px;font-weight:bold;text-align:right;margin-top:20px;padding-top:10px;border-top:2px solid #4338ca}.footer{text-align:center;margin-top:40px;color:#6b7280;font-size:12px}@media print{body{margin:0;padding:20px}}</style></head><body><h1>${res.data.title}</h1><p style="color:#6b7280">Dokumen Penawaran Resmi - EventOS.id</p><table><thead><tr><th style="text-align:center">No</th><th>Kategori</th><th>Deskripsi</th><th>Vendor</th><th style="text-align:right">Harga</th></tr></thead><tbody>${itemsHtml}</tbody></table><div class="total">Total: Rp ${total}</div><div class="footer">Dokumen ini digenerate otomatis oleh EventOS.id &copy; 2026</div><script>window.onload=function(){setTimeout(function(){window.print()},500)}</script></body></html>`;
                const win = window.open("", "_blank");
                if (win) {
                  win.document.write(html);
                  win.document.close();
                }
                showToast("📄 Tab baru terbuka. Tekan Ctrl+P / Cmd+P untuk simpan sebagai PDF");
              } else {
                showToast("Gagal mengekspor quotation");
              }
              setExportLoading(false);
            }}
          >
            {exportLoading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Download className="w-4 h-4 mr-1.5" />}
            Export PDF
          </Button>
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500"
            disabled={waLoading}
            onClick={async () => {
              setWaLoading(true);
              const res = await apiSendQuotationWa("quote-1");
              if (res?.data?.wa_link) {
                showToast(`🚀 Link quotation dikirim ke ${res.data.recipient} via WhatsApp!`);
                window.open(res.data.wa_link, "_blank");
              } else {
                showToast("Gagal mengirim link WhatsApp");
              }
              setWaLoading(false);
            }}
          >
            {waLoading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Send className="w-4 h-4 mr-1.5" />}
            Kirim Link WA
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List: Interactive Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-800 bg-slate-900/80">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <CardTitle className="text-base font-bold text-white">Rincian Paket: Royal Emerald Wedding (800 Pax)</CardTitle>
                <p className="text-xs text-slate-400">Centang atau hilangkan item layanan di bawah untuk simulasi harga interaktif</p>
              </div>
              <Button size="sm" variant="outline" onClick={handleOpenModal}>
                <Plus className="w-4 h-4 mr-1" />
                Tambah Modul
              </Button>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {quotationItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleQuoteItem(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    item.isSelected
                      ? "bg-slate-900 border-indigo-500/40 shadow-md shadow-indigo-500/5"
                      : "bg-slate-950/40 border-slate-800/60 opacity-60 hover:opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="checkbox"
                      checked={item.isSelected}
                      onChange={() => {}}
                      className="w-5 h-5 rounded accent-indigo-600 cursor-pointer flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                          [{item.category}]
                        </span>
                        {item.isOptional && (
                          <Badge variant="warning" className="text-[10px]">Opsional Add-On</Badge>
                        )}
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">{item.title}</div>
                      <div className="text-xs text-slate-400">Vendor Mitra: <strong className="text-slate-300">{item.vendorName}</strong></div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div className="text-base font-extrabold text-emerald-400">
                      {formatRupiah(item.price)}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Summary Sticky Panel */}
        <div className="space-y-4">
          <Card className="border-slate-800 bg-slate-900 sticky top-6">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                Kalkulasi Kontrak & Faktur
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-sm">
              <div className="flex items-center justify-between text-slate-300">
                <span>Subtotal Layanan Terpilih ({selectedItems.length} Item):</span>
                <span className="font-semibold">{formatRupiah(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Biaya Koordinasi & Manajemen WO:</span>
                <span className="font-semibold">{formatRupiah(woFee)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Potongan Diskon Khusus:</span>
                <span className="font-semibold text-emerald-400">- {formatRupiah(discount)}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="font-bold text-white text-base">TOTAL KESEPATAN:</span>
                <span className="font-extrabold text-2xl text-emerald-400">{formatRupiah(grandTotal)}</span>
              </div>

              {/* Simulasi termin sebelum dikunci */}
              {lockedInvoices === null && (
                <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 space-y-1.5 leading-relaxed">
                  <div className="font-bold flex items-center gap-1.5 text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Otomatisasi Modul 5 (Invoice & Termin)
                  </div>
                  <div>Saat persetujuan ditandatangani klien, sistem otomatis menerbitkan:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-indigo-300 font-medium">
                    <li>Termin 1 (DP 30%): {formatRupiah(grandTotal * 0.3)}</li>
                    <li>Termin 2 (50% H-30): {formatRupiah(grandTotal * 0.5)}</li>
                    <li>Pelunasan (20% H-7): {formatRupiah(grandTotal * 0.2)}</li>
                  </ul>
                </div>
              )}

              <Button
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 font-bold shadow-lg shadow-indigo-600/30"
                disabled={lockLoading}
                onClick={async () => {
                  setLockLoading(true);
                  const res = await apiLockQuotation("quote-1");
                  if (res?.status === "success" && res?.data?.invoices) {
                    setLockedInvoices(res.data.invoices);
                    showToast(`🔒 Quotation dikunci! ${res.data.invoices.length} invoice berhasil diterbitkan`);
                  } else {
                    showToast(res?.message || "Gagal mengunci quotation");
                  }
                  setLockLoading(false);
                }}
              >
                {lockLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Kunci Penawaran & Buat Invoice
              </Button>

              {lockedInvoices !== null && lockedInvoices.length > 0 && (
                <Button
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 font-bold shadow-lg shadow-emerald-600/30"
                  onClick={() => setInvoiceModalOpen(true)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Lihat Status Invoice ({lockedInvoices.length})
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoice Status Modal */}
      {invoiceModalOpen && lockedInvoices && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Status Invoice
              </h3>
              <button onClick={() => setInvoiceModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {lockedInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <div className="font-semibold text-white">{inv.termin_type}</div>
                    <div className="text-emerald-400 font-bold mt-0.5">{formatRupiah(inv.amount)}</div>
                  </div>
                  <Badge variant={inv.status === "paid" ? "success" : "secondary"}>
                    {inv.status === "paid" ? "LUNAS" : "Belum Dibayar"}
                  </Badge>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline" onClick={() => setInvoiceModalOpen(false)}>
              Tutup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
