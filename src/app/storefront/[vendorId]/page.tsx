"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchStorefrontVendor, fetchVendorReviews, submitReview, createStorefrontLead } from "@/lib/api";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Clock, MapPin, Phone, CheckCircle2, ArrowLeft, Briefcase, Building, MessageCircle, Send, Shield, Heart, Sparkles, Quote, ThumbsUp, Users, Award } from "lucide-react";
import { motion } from "framer-motion";

interface VendorDetail {
  id: string; name: string; category: string; pic_name: string;
  whatsapp: string; rating: number; sla_punctuality: number;
  starting_price: number; area: string; npwp: string | null;
  bank_account_info: string | null; total_projects_handled: number;
}

interface Review {
  id: string; reviewer_name: string; rating: number; comment: string;
  created_at: string;
}

export default function VendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.vendorId as string;
  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", whatsapp: "", message: "" });
  const [reviewForm, setReviewForm] = useState({ reviewer_name: "", rating: 5, comment: "" });
  const [leadSent, setLeadSent] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);

  useEffect(() => {
    if (!vendorId) return;
    Promise.all([
      fetchStorefrontVendor(vendorId),
      fetchVendorReviews(vendorId),
    ]).then(([vendorRes, reviewRes]) => {
      setLoading(false);
      if (vendorRes?.status === "success" && vendorRes?.data) {
        setVendor(vendorRes.data);
      } else {
        setError(vendorRes?.message || "Vendor tidak ditemukan");
      }
      if (reviewRes?.data) setReviews(reviewRes.data);
    });
  }, [vendorId]);

  const handleLeadSubmit = async () => {
    await createStorefrontLead({ vendor_id: vendorId, ...leadForm });
    setLeadSent(true);
    setShowLeadForm(false);
  };

  const handleReviewSubmit = async () => {
    await submitReview({ vendor_id: vendorId, ...reviewForm });
    setReviewSent(true);
    setReviewForm({ reviewer_name: "", rating: 5, comment: "" });
  };

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : vendor?.rating || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Memuat detail vendor...
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="border-red-800 bg-slate-900 max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-lg font-bold text-white">Vendor Tidak Ditemukan</h2>
            <p className="text-sm text-slate-400">{error}</p>
            <Button variant="outline" className="gap-2" onClick={() => router.push("/storefront")}>
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Button variant="outline" size="sm" className="gap-2 border-slate-700" onClick={() => router.push("/storefront")}>
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/30 border border-slate-700/60 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/30">
              {vendor.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/30">{vendor.category}</Badge>
                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Verified
                </Badge>
              </div>
              <h1 className="text-xl font-bold text-white">{vendor.name}</h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <MapPin className="w-3.5 h-3.5" /> {vendor.area}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-5 h-5 fill-amber-400" />
              <span className="text-lg">{vendor.rating}</span>
              <span className="text-xs text-slate-500 font-normal">({reviews.length} review)</span>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 gap-2"
              onClick={() => window.open(`https://wa.me/${vendor.whatsapp.replace(/[^0-9]/g, "")}`, "_blank")}
            >
              <Phone className="w-4 h-4" /> Chat WA
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-slate-700 bg-slate-800/40">
            <CardContent className="p-4 flex items-center gap-3">
              <Award className="w-8 h-8 text-emerald-400" />
              <div>
                <div className="text-xs text-slate-400">SLA Ketepatan</div>
                <div className="text-lg font-extrabold text-emerald-400">{vendor.sla_punctuality}%</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-700 bg-slate-800/40">
            <CardContent className="p-4 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-indigo-400" />
              <div>
                <div className="text-xs text-slate-400">Proyek Ditangani</div>
                <div className="text-lg font-extrabold text-white">{vendor.total_projects_handled}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-700 bg-slate-800/40">
            <CardContent className="p-4 flex items-center gap-3">
              <Building className="w-8 h-8 text-amber-400" />
              <div>
                <div className="text-xs text-slate-400">Mulai dari</div>
                <div className="text-lg font-extrabold text-emerald-400">{formatRupiah(vendor.starting_price)}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-700 bg-slate-800/40">
              <CardHeader className="pb-3 border-b border-slate-700/60">
                <CardTitle className="text-sm font-bold text-white">Informasi Vendor</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">PIC</span>
                  <span className="font-semibold text-white">{vendor.pic_name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Kategori</span>
                  <span className="font-semibold text-white">{vendor.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Area Layanan</span>
                  <span className="font-semibold text-white">{vendor.area}</span>
                </div>
                {vendor.npwp && (
                  <div className="flex justify-between py-2 border-b border-slate-700/50">
                    <span className="text-slate-400">NPWP</span>
                    <span className="font-semibold text-white">{vendor.npwp}</span>
                  </div>
                )}
                {vendor.bank_account_info && (
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Info Rekening</span>
                    <span className="font-semibold text-white">{vendor.bank_account_info}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/40">
              <CardHeader className="pb-3 border-b border-slate-700/60">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-indigo-400" /> Review & Rating
                  </CardTitle>
                  <Badge className="bg-indigo-500/15 text-indigo-400">{reviews.length} review</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-900/60 rounded-xl">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-400">{avgRating.toFixed(1)}</div>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{reviews.length} review</div>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter((r) => r.rating === star).length;
                      const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="text-slate-400 w-3">{star}</span>
                          <Star className="w-3 h-3 text-amber-400" />
                          <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-slate-500 w-4">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="p-3 rounded-xl bg-slate-900/40 border border-slate-700/40">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-white">{review.reviewer_name}</span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{review.comment}</p>
                    <p className="text-[10px] text-slate-600 mt-1">{review.created_at}</p>
                  </div>
                ))}

                {!reviewSent && (
                  <details className="group">
                    <summary className="text-xs text-indigo-400 cursor-pointer hover:text-indigo-300 font-medium">Tulis Review</summary>
                    <div className="mt-3 space-y-2">
                      <Input
                        value={reviewForm.reviewer_name}
                        onChange={(e) => setReviewForm({ ...reviewForm, reviewer_name: e.target.value })}
                        placeholder="Nama Anda"
                        className="bg-slate-900 border-slate-700 text-sm"
                      />
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button key={s} onClick={() => setReviewForm({ ...reviewForm, rating: s })}>
                            <Star className={`w-5 h-5 ${s <= reviewForm.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="Tulis pengalaman Anda..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm resize-none h-20 text-slate-100"
                      />
                      <Button size="sm" onClick={handleReviewSubmit}>
                        <Send className="w-3.5 h-3.5 mr-1.5" /> Kirim Review
                      </Button>
                    </div>
                  </details>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/5">
              <CardContent className="p-5 space-y-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> Tertarik dengan vendor ini?
                </h3>
                <p className="text-xs text-slate-400">Isi form di bawah, dan kami akan bantu hubungkan Anda.</p>
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 gap-2" onClick={() => setShowLeadForm(true)}>
                  <Send className="w-4 h-4" /> Kirim Permintaan
                </Button>
                <Button variant="outline" className="w-full border-slate-600 gap-2" onClick={() => window.open(`https://wa.me/${vendor.whatsapp.replace(/[^0-9]/g, "")}`, "_blank")}>
                  <Phone className="w-4 h-4 text-emerald-400" /> Hubungi WA Langsung
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/40">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-bold text-sm text-white">Layanan</h3>
                <div className="flex flex-wrap gap-1.5">
                  {["Konsultasi Gratis", "Survey Lokasi", "Custom Package", "Garansi SLA"].map((s) => (
                    <Badge key={s} className="bg-slate-700 text-slate-300 border-slate-600 text-[10px]">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center text-xs text-slate-600 pb-8">
          EventOS.id — Marketplace Vendor Event Terpercaya
        </div>
      </div>

      {showLeadForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowLeadForm(false)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            {leadSent ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="font-bold text-white text-lg mb-1">Permintaan Terkirim!</h3>
                <p className="text-sm text-slate-400">Vendor akan menghubungi Anda segera.</p>
                <Button className="mt-4" onClick={() => setShowLeadForm(false)}>Tutup</Button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-white text-lg mb-4">Kirim Permintaan ke {vendor.name}</h3>
                <div className="space-y-3">
                  <Input
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    placeholder="Nama Anda"
                    className="bg-slate-800 border-slate-600"
                  />
                  <Input
                    value={leadForm.whatsapp}
                    onChange={(e) => setLeadForm({ ...leadForm, whatsapp: e.target.value })}
                    placeholder="No. WhatsApp"
                    className="bg-slate-800 border-slate-600"
                  />
                  <textarea
                    value={leadForm.message}
                    onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                    placeholder="Pesan (contoh: Saya tertarik dengan paket foto/video)"
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm resize-none h-24 text-slate-100"
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 border-slate-600" onClick={() => setShowLeadForm(false)}>Batal</Button>
                    <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600" onClick={handleLeadSubmit}>
                      <Send className="w-4 h-4 mr-1.5" /> Kirim
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
