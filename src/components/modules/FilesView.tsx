"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Folder, FileText, Upload, Download, Share2, HardDrive } from "lucide-react";

export function FilesView() {
  const { showToast } = useApp();
  const [selectedFolder, setSelectedFolder] = useState<string>("/Contracts");

  const folders = [
    { id: "/Contracts", label: "01_Contracts_and_Legals", count: 3 },
    { id: "/Invoices", label: "02_Invoices_and_Receipts", count: 4 },
    { id: "/Moodboards", label: "03_Concept_and_Moodboards", count: 8 },
    { id: "/CAD_Layouts", label: "04_Layouts_and_Floorplans", count: 5 },
    { id: "/Rundowns", label: "05_Rundowns_and_Checklists", count: 2 },
  ];

  const mockFiles = [
    { id: "f-1", name: "MoU_Klien_RoyalWedding_Signed.pdf", folder: "/Contracts", size: "2.4 MB", date: "10 Jul 2026", author: "Lead WO" },
    { id: "f-2", name: "Surat_Izin_Keramaian_Kepolisian_Resmi.pdf", folder: "/Contracts", size: "1.1 MB", date: "12 Jul 2026", author: "Legal Team" },
    { id: "f-3", name: "Kontrak_B2B_LumierePhotography.pdf", folder: "/Contracts", size: "3.5 MB", date: "05 Jul 2026", author: "Mas Rio" },
    { id: "f-4", name: "CAD_Layout_Ballroom_3D_v3.2.dwg", folder: "/CAD_Layouts", size: "18.2 MB", date: "11 Jul 2026", author: "Grand Rose Decor" },
    { id: "f-5", name: "Moodboard_Palette_Maroon_Gold.pdf", folder: "/Moodboards", size: "8.7 MB", date: "02 Jul 2026", author: "Creative Designer" },
  ];

  const currentFiles = mockFiles.filter((f) => f.folder === selectedFolder);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Modul 10: Cloud File & Asset Repository
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Brankas penyimpanan cloud terstruktur otomatis untuk setiap proyek, kompatibel dengan MinIO S3 & Cloudflare R2.
          </p>
        </div>
        <Button
          onClick={() => showToast("📤 Mengunggah berkas baru ke kontainer penyimpanan MinIO S3...")}
          className="gap-1.5 font-semibold bg-indigo-600 hover:bg-indigo-500"
        >
          <Upload className="w-4 h-4" />
          Upload Dokumen
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Folder Navigation */}
        <Card className="border-slate-800 bg-slate-900/80 md:col-span-1">
          <CardHeader className="p-4 border-b border-slate-800 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Folder Proyek
            </CardTitle>
            <HardDrive className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent className="p-2 space-y-1">
            {folders.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFolder(f.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedFolder === f.id
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <Folder className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="truncate">{f.label}</span>
                </span>
                <span className="text-[10px] opacity-70">{f.count}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Files Table */}
        <Card className="border-slate-800 bg-slate-900/90 md:col-span-3">
          <CardHeader className="p-4 border-b border-slate-800 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-400" />
              <CardTitle className="text-sm font-bold text-white">{selectedFolder}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/40">
                    <th className="p-4">Nama File</th>
                    <th className="p-4">Ukuran</th>
                    <th className="p-4">Tanggal Diunggah</th>
                    <th className="p-4">Pengunggah</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {currentFiles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                        Belum ada berkas di dalam folder ini.
                      </td>
                    </tr>
                  ) : (
                    currentFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 flex items-center gap-2 font-semibold text-white">
                          <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                          <span>{file.name}</span>
                        </td>
                        <td className="p-4 text-slate-400">{file.size}</td>
                        <td className="p-4 text-slate-400">{file.date}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-[10px]">{file.author}</Badge>
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-indigo-400 hover:text-indigo-300"
                            onClick={() => showToast(`📥 Mengunduh ${file.name}...`)}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-emerald-400 hover:text-emerald-300"
                            onClick={() => showToast(`🔗 Tautan berbagi aman untuk ${file.name} disalin ke clipboard!`)}
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
