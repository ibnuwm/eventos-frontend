"use client";
import React, { useMemo, useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatRupiah, cn } from "@/lib/utils";
import {
  Landmark, Plus, TrendingUp, TrendingDown, FileText,
  Receipt, Percent, Calendar, Download, Trash2, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Transaction } from "@/types";

export function AccountingView() {
  const { transactions, addTransaction, generatePnlReport, projects, toastMessage, refreshData } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<"income" | "expense">("income");
  const [subCategory, setSubCategory] = useState("Layanan");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [taxType, setTaxType] = useState("none");

  const pnl = useMemo(() => {
    const totalIncome = transactions.filter((t: any) => t.category === "income").reduce((s: number, t: any) => s + t.amount, 0);
    const totalExpense = transactions.filter((t: any) => t.category === "expense").reduce((s: number, t: any) => s + t.amount, 0);
    const totalPpn = transactions.filter((t: any) => t.tax_type === "ppn").reduce((s: number, t: any) => s + (t.amount * 0.11), 0);
    const totalPph = transactions.filter((t: any) => t.tax_type?.startsWith("pph")).reduce((s: number, t: any) => s + (t.amount * 0.02), 0);
    return { totalIncome, totalExpense, netProfit: totalIncome - totalExpense, totalPpn, totalPph };
  }, [transactions]);

  const handleAdd = () => {
    if (!amount || !description) return;
    const realType = category === "income" ? "client_payment" : "operational";
    addTransaction({
      type: realType,
      category,
      description,
      amount: Number(amount),
      tax_type: taxType !== "none" ? taxType : undefined,
      project_id: projects[0]?.id,
      date: new Date().toISOString(),
    });
    setShowForm(false);
    setDescription("");
    setAmount("");
    setCategory("income");
    setSubCategory("Layanan");
    setTaxType("none");
  };

  const handleDownloadReport = () => {
    const csv = [
      ["Tanggal", "Tipe", "Kategori", "Deskripsi", "Jumlah", "Pajak", "Status"],
      ...transactions.map((t: any) => [
        new Date(t.date).toLocaleDateString("id-ID"),
        t.category === "income" ? "Pendapatan" : "Biaya",
        t.category,
        t.description,
        t.amount.toString(),
        t.tax_type || "-",
        t.status || "confirmed",
      ]),
    ].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan_keuangan_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Akuntansi & Pajak</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Laba rugi, tracking biaya, PPN & PPh</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadReport}>
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
          </Button>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Transaksi Baru
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="border-brand-500/30 bg-brand-500/5">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Tipe</label>
                <Select value={category} onValueChange={(v) => setCategory(v as "income" | "expense")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Pendapatan</SelectItem>
                    <SelectItem value="expense">Biaya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Sub Kategori</label>
                <Select value={subCategory} onValueChange={setSubCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Layanan">Layanan</SelectItem>
                    <SelectItem value="Produk">Produk</SelectItem>
                    <SelectItem value="Transportasi">Transportasi</SelectItem>
                    <SelectItem value="Katering">Katering</SelectItem>
                    <SelectItem value="Sewa">Sewa</SelectItem>
                    <SelectItem value="Dekorasi">Dekorasi</SelectItem>
                    <SelectItem value="Dokumentasi">Dokumentasi</SelectItem>
                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Deskripsi</label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi transaksi..." />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Jumlah (Rp)</label>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Pajak</label>
                <Select value={taxType} onValueChange={setTaxType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tanpa Pajak</SelectItem>
                    <SelectItem value="ppn">PPN 11%</SelectItem>
                    <SelectItem value="pph21">PPh 21</SelectItem>
                    <SelectItem value="pph23">PPh 23</SelectItem>
                    <SelectItem value="pph4(2)">PPh Final 4(2)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Batal</Button>
              <Button size="sm" onClick={handleAdd}>Simpan</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl font-bold text-emerald-500">{formatRupiah(pnl.totalIncome)}</div>
            <p className="text-xs text-muted-foreground">Total Pendapatan</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-xl font-bold text-red-500">{formatRupiah(pnl.totalExpense)}</div>
            <p className="text-xs text-muted-foreground">Total Biaya</p>
          </CardContent>
        </Card>
        <Card className={pnl.netProfit >= 0 ? "bg-brand-500/5 border-brand-500/20" : "bg-red-500/10 border-red-500/30"}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              {pnl.netProfit >= 0 ? <ArrowUpRight className="w-4 h-4 text-brand-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
            </div>
            <div className="text-xl font-bold">{formatRupiah(pnl.netProfit)}</div>
            <p className="text-xs text-muted-foreground">Laba/(Rugi) Bersih</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Percent className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-bold text-amber-500">{pnl.totalPpn ? formatRupiah(pnl.totalPpn) : "Rp 0"}</div>
            <p className="text-xs text-muted-foreground">Total PPN</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Receipt className="w-4 h-4 text-brand-500" /> Riwayat Transaksi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Belum ada transaksi</p>
            ) : (
              <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                {[...transactions].reverse().map((t: any, i: number) => (
                  <div key={t.id || i} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/30 text-sm border-b border-border/30 last:border-0">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className={cn("w-2 h-2 rounded-full shrink-0", t.category === "income" ? "bg-emerald-500" : "bg-red-500")} />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{t.description || t.category}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(t.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          {t.tax_type && <Badge className="ml-1.5 text-[9px] py-0" variant="outline">{t.tax_type.toUpperCase()}</Badge>}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className={cn("font-semibold text-sm", t.category === "income" ? "text-emerald-500" : "text-red-500")}>
                        {t.category === "income" ? "+" : "-"}{formatRupiah(t.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Percent className="w-4 h-4 text-amber-500" /> Ringkasan Pajak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pnl.totalPpn !== undefined && (
              <div className="flex justify-between items-center p-2 bg-brand-500/5 rounded-lg">
                <span className="text-sm">PPN 11%</span>
                <span className="font-semibold text-sm">{formatRupiah(pnl.totalPpn)}</span>
              </div>
            )}
            {pnl.totalPph && (
              <div className="flex justify-between items-center p-2 bg-amber-500/5 rounded-lg">
                <span className="text-sm">PPh</span>
                <span className="font-semibold text-sm">{formatRupiah(pnl.totalPph)}</span>
              </div>
            )}
            <div className="flex justify-between items-center p-2 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">Total Pajak Terutang</span>
              <span className="font-semibold">{formatRupiah((pnl.totalPpn || 0) + (pnl.totalPph || 0))}</span>
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground space-y-1">
              <p>• PPN: 11% dari penjualan kena pajak</p>
              <p>• PPh 21: Karyawan tetap</p>
              <p>• PPh 23: Jasa profesional (2%)</p>
              <p>• PPh Final 4(2): Sewa (10%)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
