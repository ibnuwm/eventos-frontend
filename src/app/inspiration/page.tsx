"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getInspirationBoards, createInspirationBoard } from "@/lib/api";
import { Loader2, Plus, ChevronDown, ChevronUp, Image, XCircle, CheckCircle2 } from "lucide-react";

export default function InspirationPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [boards, setBoards] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedBoard, setExpandedBoard] = useState<string | null>(null);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true); setError(null);
    try {
      const res = await getInspirationBoards();
      if (res?.status === "success") setBoards(res.data);
      else setError(res?.message || "Gagal memuat board inspirasi");
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function handleCreate() {
    if (!newTitle.trim()) return;
    setCreating(true); setError(null);
    try {
      const res = await createInspirationBoard(newTitle);
      if (res?.status === "success") {
        setNewTitle("");
        setShowCreate(false);
        fetchData();
      } else {
        setError(res?.message || "Gagal membuat board");
      }
    } catch (e: any) { setError(e.message); }
    finally { setCreating(false); }
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>;
  if (error) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-center"><XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" /><p className="text-slate-400">{error}</p></div></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 mb-2">Inspirasi</Badge>
            <h1 className="text-2xl font-bold text-white">Inspiration Boards</h1>
            <p className="text-sm text-slate-400">Kumpulkan ide dan referensi vendor untuk acara Anda.</p>
          </div>
          <Button onClick={() => setShowCreate(!showCreate)} className="bg-indigo-600 hover:bg-indigo-500 gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" /> Buat Board Baru
          </Button>
        </div>

        {showCreate && (
          <Card className="border-slate-800 bg-slate-900/60">
            <CardContent className="p-4 flex gap-3">
              <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Nama board inspirasi..." className="bg-slate-950 border-slate-800 flex-1" />
              <Button onClick={handleCreate} disabled={creating || !newTitle.trim()} className="bg-indigo-600 hover:bg-indigo-500">
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
              </Button>
            </CardContent>
          </Card>
        )}

        {boards.length === 0 && (
          <div className="text-center py-12">
            <Image className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">Belum ada board inspirasi. Buat board pertama Anda!</p>
          </div>
        )}

        <div className="space-y-4">
          {boards.map((board: any) => (
            <Card key={board.id} className="border-slate-800 bg-slate-900/60">
              <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpandedBoard(expandedBoard === board.id ? null : board.id)}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-white">{board.title}</CardTitle>
                    <p className="text-xs text-slate-500 mt-1">{board.items?.length || 0} item</p>
                  </div>
                  {expandedBoard === board.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </CardHeader>
              {expandedBoard === board.id && (
                <CardContent className="p-4 pt-0">
                  {board.items && board.items.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {board.items.map((item: any) => (
                        <div key={item.id} className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.note || "Inspirasi"} className="w-full h-28 object-cover" />
                          ) : (
                            <div className="w-full h-28 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 flex items-center justify-center">
                              <Image className="w-6 h-6 text-slate-600" />
                            </div>
                          )}
                          {item.note && <p className="text-xs text-slate-400 p-2">{item.note}</p>}
                          {item.vendor_name && <p className="text-xs text-indigo-400 px-2 pb-2">{item.vendor_name}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-6">Belum ada item di board ini.</p>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
