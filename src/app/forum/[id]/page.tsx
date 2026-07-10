"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchForumTopic, replyToTopic } from "@/lib/api";
import { Loader2, ArrowLeft, MessageCircle, Eye, Pin, User, Send, XCircle, CheckCircle2 } from "lucide-react";

export default function ForumTopicDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState<any>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyName, setReplyName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);

  useEffect(() => { fetchData(); }, [id]);

  async function fetchData() {
    if (!id) return;
    setLoading(true); setError(null);
    try {
      const res = await fetchForumTopic(id);
      if (res?.status === "success") setTopic(res.data);
      else setError(res?.message || "Gagal memuat topik");
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyContent.trim() || !replyName.trim()) return;
    setSubmitting(true); setError(null);
    try {
      const res = await replyToTopic(id, { author_name: replyName, content: replyContent });
      if (res?.status === "success") {
        setReplySuccess(true);
        setReplyContent("");
        fetchData();
        setTimeout(() => setReplySuccess(false), 3000);
      } else {
        setError(res?.message || "Gagal mengirim balasan");
      }
    } catch (e: any) { setError(e.message); }
    finally { setSubmitting(false); }
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>;
  if (error) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-center"><XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" /><p className="text-slate-400">{error}</p></div></div>;
  if (!topic) return <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4"><Card className="border-slate-800 bg-slate-900"><CardContent className="p-8 text-center space-y-3"><XCircle className="w-12 h-12 text-red-400 mx-auto" /><h2 className="text-lg font-bold text-white">Topik Tidak Ditemukan</h2><Link href="/forum"><Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" /> Kembali</Button></Link></CardContent></Card></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <Link href="/forum"><Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="w-4 h-4" /> Kembali ke Forum</Button></Link>

        {/* Topic */}
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader className="pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              {topic.is_pinned && <Pin className="w-4 h-4 text-amber-400" />}
              {topic.category && <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">{topic.category}</Badge>}
            </div>
            <CardTitle className="text-lg font-bold text-white">{topic.title}</CardTitle>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{topic.author_name || topic.author}</span>
              <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{topic.reply_count || 0} balasan</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{topic.view_count || 0}</span>
            </div>
          </CardHeader>
          <CardContent className="p-5 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {topic.content}
          </CardContent>
        </Card>

        {/* Replies */}
        {topic.replies && topic.replies.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-indigo-400" />
              Balasan ({topic.replies.length})
            </h3>
            {topic.replies.map((reply: any) => (
              <Card key={reply.id} className="border-slate-800 bg-slate-900/40 ml-4">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <User className="w-3 h-3" />
                    <span className="font-semibold text-slate-300">{reply.author_name}</span>
                    <span>{reply.created_at}</span>
                  </div>
                  <p className="text-sm text-slate-300 whitespace-pre-line">{reply.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {topic.replies && topic.replies.length === 0 && (
          <div className="text-center py-8 text-sm text-slate-500">Belum ada balasan. Jadilah yang pertama!</div>
        )}

        {/* Reply Form */}
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-sm font-bold text-white">Tulis Balasan</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleReply} className="space-y-3">
              {error && (
                <div className="p-3 rounded-lg bg-red-900/20 border border-red-800 text-red-400 text-sm flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> {error}
                </div>
              )}
              {replySuccess && (
                <div className="p-3 rounded-lg bg-emerald-900/20 border border-emerald-800 text-emerald-400 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Balasan berhasil dikirim!
                </div>
              )}
              <Input value={replyName} onChange={(e) => setReplyName(e.target.value)} placeholder="Nama Anda" className="bg-slate-950 border-slate-800" required />
              <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} rows={3} placeholder="Tulis balasan Anda..." className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm resize-y" required />
              <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-500 gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? "Mengirim..." : "Kirim Balasan"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
