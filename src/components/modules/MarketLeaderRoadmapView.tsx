"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle2, Zap, Shield, Map, Smartphone, Wifi, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const moats = [
  { icon: Shield, title: "Smart Escrow & Split Payment", desc: "Dana HPP terkunci di Escrow, cair otomatis saat loading selesai.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: Wifi, title: "Offline-First Field PWA", desc: "Kru di basement tanpa sinyal tetap bisa checklist via IndexedDB.", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Map, title: "Interactive 2D/3D Floorplan", desc: "Kanvas interaktif drag-drop meja & panggung di web.", color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: Zap, title: "AI Surge Pricing & Weather Guard", desc: "Rekomendasi harga di tanggal cantik & proteksi tenda hujan.", color: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: Smartphone, title: "Auto Technical Rider PDF", desc: "Draf otomatis daya listrik kVA & jam malam hotel.", color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { icon: ShoppingBag, title: "B2B Supply Chain Pooling", desc: "Belanja grosir gabungan untuk diskon distributor 30%.", color: "text-pink-400", bg: "bg-pink-500/10" },
];

export function MarketLeaderRoadmapView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-500/10 via-purple-500/10 to-background border border-brand-500/20 p-6">
        <Badge className="mb-2 bg-brand-500/20 text-brand-300 border-brand-500/30 font-bold"><Crown className="w-3 h-3 mr-1" /> Category King</Badge>
        <h2 className="text-2xl font-bold text-foreground font-display">Stage 1 Category King Roadmap</h2>
        <p className="text-sm text-muted-foreground mt-1">6 fitur market leader untuk memonopoli pasar event & wedding Indonesia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ y: -4 }}
              className="glass-card rounded-xl p-5 border-border/60 group"
            >
              <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="font-bold text-foreground font-display">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{item.desc}</p>
              <div className="mt-3">
                <Badge variant="secondary" className="text-xs">Status: <span className="text-emerald-400">Active</span></Badge>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
