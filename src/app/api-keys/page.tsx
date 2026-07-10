"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Star, StarHalf, ThumbsUp, Camera, CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchApiKeys, generateApiKey, revokeApiKey } from "@/lib/api";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    read: false,
    write: false,
    admin: false,
  });
  const [generating, setGenerating] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState("");

  const loadKeys = () => {
    setLoading(true);
    fetchApiKeys().then((res) => {
      if (res?.data) setKeys(res.data);
      else if (Array.isArray(res)) setKeys(res);
      setLoading(false);
    }).catch(() => {
      setError("Gagal memuat API keys");
      setLoading(false);
    });
  };

  useEffect(() => { loadKeys(); }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName) return;
    setGenerating(true);
    try {
      const selected = Object.entries(permissions).filter(([, v]) => v).map(([k]) => k);
      const res = await generateApiKey(keyName, selected);
      if (res?.data?.api_key || res?.api_key) {
        setNewKeyValue(res.data?.api_key || res.api_key);
        loadKeys();
        setKeyName("");
        setPermissions({ read: false, write: false, admin: false });
      }
    } catch { }
    setGenerating(false);
  };

  const handleRevoke = async (id: string) => {
    try {
      await revokeApiKey(id);
      loadKeys();
    } catch { }
  };

  const handleCopy = (val: string) => {
    navigator.clipboard?.writeText(val);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="border-red-800 bg-slate-900">
        <CardContent className="p-8 flex flex-col items-center gap-3">
          <XCircle className="w-8 h-8 text-red-400" />
          <p className="text-red-400 text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={() => { setError(null); loadKeys(); }} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Coba Lagi
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const permissionLabels: Record<string, string> = { read: "Read", write: "Write", admin: "Admin" };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">API Keys</h1>
            <p className="text-xs text-slate-400 mt-1">Kelola kunci API untuk integrasi eksternal</p>
          </div>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-2" onClick={() => setShowForm(!showForm)}>
            + Key Baru
          </Button>
        </div>

        {/* Generate Form */}
        {showForm && (
          <Card className="border-slate-800 bg-slate-900/60">
            <CardContent className="p-6">
              {newKeyValue && (
                <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Key berhasil dibuat!
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-slate-950 p-2 rounded-lg border border-slate-800 text-amber-400 break-all select-all">
                      {newKeyValue}
                    </code>
                    <Button size="sm" variant="outline" onClick={() => handleCopy(newKeyValue)} className="text-xs">
                      Copy
                    </Button>
                  </div>
                  <p className="text-[10px] text-amber-400">Simpan key ini. Tidak dapat dilihat lagi.</p>
                </div>
              )}
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Nama Key</label>
                  <Input
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    placeholder="Mis: Production API"
                    className="bg-slate-950 border-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Permissions</label>
                  <div className="flex gap-4">
                    {Object.entries(permissionLabels).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={permissions[key]}
                          onChange={(e) => setPermissions((prev) => ({ ...prev, [key]: e.target.checked }))}
                          className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                <Button type="submit" disabled={generating} className="bg-indigo-600 hover:bg-indigo-500 gap-2">
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Generate Key
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Keys Table */}
        <Card className="border-slate-800 bg-slate-900/60">
          <CardContent className="p-0 overflow-x-auto">
            {keys.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">Belum ada API key</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-xs text-slate-400">
                    <th className="p-4 font-medium">Nama</th>
                    <th className="p-4 font-medium">Key</th>
                    <th className="p-4 font-medium">Permissions</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Terakhir Digunakan</th>
                    <th className="p-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map((key: any) => (
                    <tr key={key.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-semibold text-white">{key.name}</td>
                      <td className="p-4">
                        <code className="text-xs text-amber-400 bg-slate-950 px-2 py-1 rounded-md">
                          {key.key_preview || key.key?.substring(0, 7) + "****..." || "dev_****..."}
                        </code>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {(key.permissions || []).map((p: string) => (
                            <Badge key={p} variant="info" className="text-[10px] capitalize">{p}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={key.status === "active" ? "success" : "destructive"} className="text-[10px] capitalize">
                          {key.status === "active" ? "Active" : "Revoked"}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-400 text-xs">
                        {key.last_used_at || key.last_used || "-"}
                      </td>
                      <td className="p-4">
                        {key.status === "active" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-400 border-red-800 hover:bg-red-500/10 text-xs"
                            onClick={() => handleRevoke(key.id)}
                          >
                            Revoke
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
