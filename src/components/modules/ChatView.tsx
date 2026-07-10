"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, User, Bot, Hash, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const channels = [
  { id: "#dekorasi-layout", label: "Dekorasi & Layout", color: "text-emerald-400" },
  { id: "#foto-video", label: "Foto & Video", color: "text-blue-400" },
  { id: "#katering", label: "Katering & Venue", color: "text-amber-400" },
  { id: "#sound-mc", label: "Sound & MC", color: "text-purple-400" },
  { id: "#umum", label: "General", color: "text-slate-400" },
];

export function ChatView() {
  const { messages, sendMessage, projects, showToast } = useApp();
  const [activeChannel, setActiveChannel] = useState("#dekorasi-layout");
  const [input, setInput] = useState("");

  const filteredMessages = messages.filter((m) => m.channel === activeChannel);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim(), activeChannel);
    setInput("");
  };

  const activeProject = projects[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-400" />
          Vendor Chat Hub
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Ruang obrolan berbasis proyek per divisi — menggantikan grup WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Channel List */}
        <div className="space-y-2">
          <Card className="glass-card border-border/60">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold text-foreground font-display">Channel</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-1">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeChannel === ch.id
                      ? "bg-brand-500/15 text-brand-400"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Hash className={`w-4 h-4 ${ch.color}`} />
                  <span className="truncate">{ch.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card border-border/60">
            <CardContent className="p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">Proyek Aktif</div>
              {activeProject && (
                <div className="text-sm font-bold text-foreground">{activeProject.title}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="glass-card border-border/60 flex flex-col h-[580px]">
            <CardHeader className="pb-3 border-b border-border/60 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className={`w-5 h-5 ${channels.find(c => c.id === activeChannel)?.color || "text-muted-foreground"}`} />
                  <CardTitle className="text-sm font-bold text-foreground">
                    {channels.find(c => c.id === activeChannel)?.label || activeChannel}
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">{filteredMessages.length} pesan</Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              <AnimatePresence>
                {filteredMessages.map((msg, idx) => (
                  <motion.div
                    key={msg.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-brand-400">
                      {msg.senderName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{msg.senderName}</span>
                        <Badge variant="secondary" className="text-xs">{msg.senderRole}</Badge>
                        <span className="text-xs text-muted-foreground ml-auto">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="w-10 h-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">Belum ada pesan di channel ini</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Mulai percakapan dengan mengetik pesan</p>
                </div>
              )}
            </CardContent>

            <div className="p-3 border-t border-border/60 bg-muted/20 flex items-center gap-2 flex-shrink-0">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ketik pesan..."
                className="flex-1 bg-muted border-border/60"
              />
              <Button onClick={handleSend} className="gap-1.5 font-semibold" size="sm">
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Kirim</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
