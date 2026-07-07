"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { FileSpreadsheet, Plus, Trash2, Send, Download, Sparkles, CheckCircle2 } from "lucide-react";

export function QuotationView() {
  const { quotationItems, toggleQuoteItem, addQuoteItem, showToast } = useApp();
  const [discount, setDiscount] = useState<number>(0);

  const selectedItems = quotationItems.filter((i) => i.isSelected);
  const subtotal = selectedItems.reduce((acc, i) => acc + i.price, 0);
  const woFee = 15000000;
  const tax = Math.round((subtotal + woFee - discount) * 0.11); // PPN 11%
  const grandTotal = subtotal + woFee - discount;

  const handleAddCustomItem = () => {
    addQuoteItem({
      category: "Special Effect",
      title: "Pyrotechnic & Dry Ice Machine Panggung Depan",
      vendorName: "ProVisual FX",
      price: 8500000,
      isSelected: true,
      isOptional: false,
    });
  };

  return (
    <div className="space-y-6">
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
            onClick={() => showToast("📄 Dokumen Quotation di-export ke format OOXML (.docx) & PDF modern tanpa cacat layout.")}
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export PDF / DOCX
          </Button>
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500"
            onClick={() => showToast("🚀 Magic Link Quotation dikirim via WhatsApp API ke Klien! Klien dapat menyetujui dengan 1 klik.")}
          >
            <Send className="w-4 h-4 mr-1.5" />
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
              <Button size="sm" variant="outline" onClick={handleAddCustomItem}>
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

              {/* Automated Invoicing Logic Info */}
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

              <Button
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 font-bold shadow-lg shadow-indigo-600/30"
                onClick={() => showToast("✨ Data Quotation disimpan sebagai Single Source of Truth proyek Anda.")}
              >
                Kunci Penawaran & Buat Invoice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
