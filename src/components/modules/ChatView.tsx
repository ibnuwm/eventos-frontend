"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Hash, Send, Users, Shield } from "lucide-react";

export function ChatView() {
  const { messages, sendMessage } = useApp();
  const [activeChannel, setActiveChannel] = useState("#dekorasi-layout");
  const [inputText, setInputText] = useState("");

  const channels = [
    { id: "#announcements", label: "announcements-general", count: 12 },
    { id: "#dekorasi-layout", label: "divisi-dekorasi-layout", count: 4 },
    { id: "#foto-video", label: "divisi-foto-video", count: 8 },
    { id: "#sound-ent", label: "divisi-sound-entertainment", count: 3 },
  ];

  const channelMessages = messages.filter((m) => m.channel === activeChannel);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText, activeChannel);
    setInputText("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Modul 9: Vendor Chat & Project Communication Hub
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Gantikan grup WhatsApp yang kacau dengan saluran komunikasi terstruktur berdasarkan divisi untuk proyek Royal Wedding.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Channel Sidebar */}
        <Card className="border-slate-800 bg-slate-900/80 md:col-span-1">
          <CardHeader className="p-4 border-b border-slate-800">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Saluran Proyek (Channels)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-1">
            {channels.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveChannel(c.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeChannel === c.id
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{c.label}</span>
                </span>
                <span className="text-[10px] opacity-70">{c.count}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Chat Stream */}
        <Card className="border-slate-800 bg-slate-900/90 md:col-span-3 flex flex-col h-[500px]">
          <CardHeader className="p-4 border-b border-slate-800 flex flex-row items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-indigo-400" />
              <CardTitle className="text-sm font-bold text-white">{activeChannel}</CardTitle>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Users className="w-3.5 h-3.5" />
              <span>4 Vendor Terhubung di Channel ini</span>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {channelMessages.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-12">
                Belum ada percakapan di channel ini. Mulai instruksi koordinasi pertama Anda!
              </div>
            ) : (
              channelMessages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-400 flex-shrink-0">
                    {msg.senderName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{msg.senderName}</span>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                        {msg.senderRole}
                      </Badge>
                      <span className="text-[10px] text-slate-500 ml-auto">{msg.timestamp}</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>

          <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2 flex-shrink-0">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={`Ketik pesan koordinasi di ${activeChannel}...`}
              className="flex-1 bg-slate-900 border-slate-800 text-xs"
            />
            <Button
              size="sm"
              onClick={handleSend}
              className="bg-indigo-600 hover:bg-indigo-500 font-bold px-4 gap-1 h-9"
            >
              <span>Kirim</span>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
