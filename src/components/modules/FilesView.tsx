"use client";

import React, { useRef, useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderOpen, FileText, Download, Upload, Eye, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { FileAsset } from "@/types";

export function FilesView() {
  const { showToast, uploadFile, deleteFile, files } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [detailFile, setDetailFile] = useState<FileAsset | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const folders = ["/Contracts", "/Invoices", "/Moodboards", "/CAD_Layouts", "/Rundowns"];

  function handleDownload(file: FileAsset) {
    const content = `File: ${file.name}\nFolder: ${file.folder}\nSize: ${file.size}\nUpload oleh: ${file.uploadedBy}\nTanggal: ${file.uploadedAt}\n\n--- EventOS File Repository ---`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.endsWith(".pdf") ? file.name : file.name + ".txt";
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Mengunduh ${file.name}`);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-brand-400" />
            File Repository
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Kontrak, invoice, layout, moodboard — terstruktur per folder</p>
        </div>
        <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={(e) => { const file = e.target.files?.[0]; if (file) { uploadFile({ name: file.name, size: file.size, folder: "/Invoices" }); showToast(`Uploading ${file.name}...`); } }} />
        <Button onClick={() => fileInputRef.current?.click()} className="gap-1.5 font-semibold">
          <Upload className="w-4 h-4" /> Upload File
        </Button>
      </div>

      {/* Folder Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {folders.map((folder, idx) => (
          <motion.div
            key={folder}
            whileHover={{ y: -2 }}
            className="glass-card rounded-xl p-4 text-center cursor-pointer group"
          >
            <FolderOpen className="w-8 h-8 mx-auto text-brand-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-bold text-foreground">{folder.replace("/", "")}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{files.filter(f => f.folder === folder).length} files</div>
          </motion.div>
        ))}
      </div>

      {/* File List */}
      <Card className="glass-card border-border/60">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-foreground font-display">Semua File</CardTitle>
            <div className="relative w-48">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari file..." className="pl-9 bg-muted border-border/60 text-xs h-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-xs font-semibold uppercase text-muted-foreground bg-muted/30">
                  <th className="p-4 pl-6">Nama File</th>
                  <th className="p-4">Folder</th>
                  <th className="p-4">Ukuran</th>
                  <th className="p-4">Upload oleh</th>
                  <th className="p-4 pr-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm">
                {filteredFiles.map((file, idx) => (
                  <motion.tr
                    key={file.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-400 flex-shrink-0" />
                        <span className="font-medium text-foreground">{file.name}</span>
                      </div>
                    </td>
                    <td className="p-4"><Badge variant="outline" className="text-xs">{file.folder}</Badge></td>
                    <td className="p-4 text-muted-foreground">{file.size}</td>
                    <td className="p-4 text-muted-foreground">{file.uploadedBy}</td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setDetailFile(file)}><Eye className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleDownload(file)}><Download className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <AnimatePresence>
        {detailFile && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setDetailFile(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-card border border-border/60 rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground font-display flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brand-400" /> Detail File
                  </h3>
                  <button onClick={() => setDetailFile(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-xl bg-muted/50 border border-border/60">
                    <div className="font-semibold text-foreground">{detailFile.name}</div>
                    <Badge variant="outline" className="text-xs mt-1">{detailFile.folder}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                      <div className="text-xs text-muted-foreground">Ukuran</div>
                      <div className="font-semibold text-foreground">{detailFile.size}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                      <div className="text-xs text-muted-foreground">Tanggal</div>
                      <div className="font-semibold text-foreground">{detailFile.uploadedAt}</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                    <div className="text-xs text-muted-foreground">Upload oleh</div>
                    <div className="font-semibold text-foreground">{detailFile.uploadedBy}</div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setDetailFile(null)}>Tutup</Button>
                    <Button className="flex-1" onClick={() => { handleDownload(detailFile); setDetailFile(null); }}>
                      <Download className="w-4 h-4 mr-1.5" /> Download
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
