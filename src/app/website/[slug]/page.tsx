"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, MapPin, Heart, Clock, CheckCircle2, Send } from "lucide-react";
import * as svc from "@/lib/mock-service";

export default function WeddingWebsitePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({ name: "", guestCount: 1, menuChoice: "", notes: "" });
  const [rsvpDone, setRsvpDone] = useState(false);
  const [showRsvp, setShowRsvp] = useState(false);

  useEffect(() => {
    svc.fetchWebsiteBySlug(slug)
      .then((res) => { if (res?.data) setSite(res.data); else setError(true); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleRsvp = async (status: string) => {
    setRsvpDone(true);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Heart className="w-12 h-12 text-rose-400 animate-pulse mx-auto mb-4" />
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    </div>
  );

  if (error || !site) return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Heart className="w-16 h-16 text-rose-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Website Tidak Ditemukan</h1>
        <p className="text-muted-foreground">Link undangan mungkin tidak valid.</p>
      </div>
    </div>
  );

  const daysLeft = Math.ceil((new Date(site.event_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Heart className="w-8 h-8 text-rose-400 mx-auto mb-4" />
          <p className="text-sm text-rose-400 font-medium uppercase tracking-widest mb-2">The Wedding of</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-2 font-serif">
            {site.couple_name}
          </h1>
          <div className="w-20 h-0.5 bg-rose-300 mx-auto my-6" />
          <p className="text-muted-foreground">{new Date(site.event_date).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </motion.div>

        {site.countdown_enabled && daysLeft > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-6 py-3 rounded-full">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">{daysLeft} hari lagi</span>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-rose-100 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-400" /> Acara
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-rose-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{new Date(site.event_date).toLocaleDateString("id-ID", { weekday: "long", dateStyle: "long" })}</p>
                <p className="text-sm text-muted-foreground">Tempat: {site.venue_name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-rose-400 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">{site.venue_address}</p>
                {site.google_maps_link && (
                  <a href={site.google_maps_link} target="_blank" className="text-sm text-rose-500 hover:underline mt-1 inline-block">Buka Google Maps →</a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {site.love_story && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-rose-100 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" /> Our Story
            </h2>
            <p className="text-muted-foreground leading-relaxed">{site.love_story}</p>
          </motion.div>
        )}

        {site.rsvp_enabled && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-rose-100 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-rose-400" /> Konfirmasi Kehadiran
            </h2>
            {rsvpDone ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">Terima kasih! Konfirmasi Anda telah diterima.</p>
              </div>
            ) : !showRsvp ? (
              <button
                onClick={() => setShowRsvp(true)}
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold transition-colors"
              >Konfirmasi Kehadiran</button>
            ) : (
              <div className="space-y-3">
                <input
                  value={rsvpForm.name}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                  placeholder="Nama Anda"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm"
                />
                <input
                  type="number"
                  min={1}
                  value={rsvpForm.guestCount}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, guestCount: parseInt(e.target.value) || 1 })}
                  placeholder="Jumlah yang hadir"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm"
                />
                <div className="flex gap-2">
                  <button onClick={() => setShowRsvp(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium">Batal</button>
                  <button onClick={() => handleRsvp("confirmed")} className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium">Hadir</button>
                  <button onClick={() => handleRsvp("declined")} className="flex-1 py-2.5 rounded-xl bg-red-400 hover:bg-red-500 text-white text-sm font-medium">Tidak Hadir</button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center text-sm text-muted-foreground pt-4 pb-12">
          <Heart className="w-4 h-4 inline-block text-rose-300 mr-1" />
          Made with love — EventOS Wedding
        </motion.div>
      </div>
    </div>
  );
}
