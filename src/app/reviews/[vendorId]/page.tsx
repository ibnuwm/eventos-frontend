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
import { fetchVendorReviews, getReviewAverage, submitReview } from "@/lib/api";

export default function VendorReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.vendorId as string;

  const [reviews, setReviews] = useState<any[]>([]);
  const [averageData, setAverageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(0);
  const [formComment, setFormComment] = useState("");
  const [formPhoto, setFormPhoto] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (!vendorId) return;
    Promise.all([
      fetchVendorReviews(vendorId),
      getReviewAverage(vendorId),
    ]).then(([reviewsRes, avgRes]) => {
      if (reviewsRes?.data) setReviews(reviewsRes.data);
      else if (reviewsRes?.reviews) setReviews(reviewsRes.reviews);
      else if (Array.isArray(reviewsRes)) setReviews(reviewsRes);
      setAverageData(avgRes?.data || avgRes);
      setLoading(false);
    }).catch(() => {
      setError("Gagal memuat ulasan");
      setLoading(false);
    });
  }, [vendorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formRating || !formComment) return;
    setSubmitting(true);
    try {
      const res = await submitReview({
        vendor_id: vendorId,
        reviewer_name: formName,
        rating: formRating,
        comment: formComment,
        photo_url: formPhoto || undefined,
      });
      if (res?.data || res?.review) {
        setSubmitSuccess(true);
        setFormName("");
        setFormRating(0);
        setFormComment("");
        setFormPhoto("");
        setTimeout(() => setSubmitSuccess(false), 3000);
        const newReview = res?.data || res?.review;
        if (newReview) setReviews((prev) => [newReview, ...prev]);
      }
    } catch { }
    setSubmitting(false);
  };

  const handleWishlistToggle = async () => {
    setWishlistLoading(true);
    try {
      const { toggleWishlist } = await import("@/lib/api");
      const res = await toggleWishlist(vendorId);
      if (res?.in_wishlist !== undefined) setInWishlist(res.in_wishlist);
      else setInWishlist((prev) => !prev);
    } catch { }
    setWishlistLoading(false);
  };

  const avgRating = averageData?.average_rating || averageData?.average || 0;
  const totalReviews = averageData?.total_reviews || averageData?.count || reviews.length;
  const distribution = averageData?.distribution || averageData?.rating_distribution || {};

  const renderStars = (rating: number, size = "w-4 h-4") => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= full) stars.push(<Star key={i} className={cn(size, "fill-amber-400 text-amber-400")} />);
      else if (i === full + 1 && half) stars.push(<StarHalf key={i} className={cn(size, "fill-amber-400 text-amber-400")} />);
      else stars.push(<Star key={i} className={cn(size, "text-slate-600")} />);
    }
    return stars;
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
          <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Back */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className="gap-2"
          >
            {wishlistLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Star className={cn("w-4 h-4", inWishlist && "fill-amber-400 text-amber-400")} />
            )}
            {inWishlist ? "Disimpan" : "Simpan"}
          </Button>
        </div>

        {/* Average Rating */}
        <div className="flex flex-col sm:flex-row items-center gap-8 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex flex-col items-center">
            <div className="text-5xl font-extrabold text-white">{avgRating.toFixed(1)}</div>
            <div className="flex items-center gap-0.5 mt-2">{renderStars(avgRating, "w-5 h-5")}</div>
            <div className="text-xs text-slate-400 mt-1">{totalReviews} ulasan</div>
          </div>
          <div className="flex-1 w-full space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star] || 0;
              const max = Math.max(...[1, 2, 3, 4, 5].map((s) => distribution[s] || 0), 1);
              const pct = (count / max) * 100;
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-4 text-slate-400">{star}</span>
                  <Star className="w-3 h-3 text-amber-400" />
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-right text-slate-500">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Ulasan</h2>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 gap-2" onClick={() => setShowForm(!showForm)}>
              <MessageSquare className="w-4 h-4" /> Tulis Ulasan
            </Button>
          </div>

          {/* Submit Form */}
          {showForm && (
            <Card className="border-slate-800 bg-slate-900/60">
              <CardContent className="p-6">
                {submitSuccess && (
                  <div className="mb-4 flex items-center gap-2 text-emerald-400 text-sm">
                    <CheckCircle2 className="w-4 h-4" /> Ulasan berhasil dikirim!
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Nama</label>
                    <Input
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Nama Anda"
                      className="bg-slate-950 border-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setFormRating(star)}>
                          <Star className={cn("w-6 h-6", star <= formRating ? "fill-amber-400 text-amber-400" : "text-slate-600")} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Komentar</label>
                    <textarea
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      placeholder="Bagikan pengalaman Anda..."
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">URL Foto (opsional)</label>
                    <Input
                      value={formPhoto}
                      onChange={(e) => setFormPhoto(e.target.value)}
                      placeholder="https://..."
                      className="bg-slate-950 border-slate-800"
                    />
                  </div>
                  <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-500 gap-2">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
                    Kirim Ulasan
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Review Cards */}
          {reviews.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-8">Belum ada ulasan</p>
          )}
          {reviews.map((review: any, idx: number) => (
            <Card key={review.id || idx} className="border-slate-800 bg-slate-900/60">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
                      {(review.reviewer_name || "A").charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{review.reviewer_name}</div>
                      <div className="text-[10px] text-slate-500">{review.created_at || review.date || ""}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">{renderStars(review.rating)}</div>
                </div>
                {review.comment && (
                  <p className="text-sm text-slate-300 leading-relaxed">{review.comment}</p>
                )}
                {review.photo_url && (
                  <img src={review.photo_url} alt="Review" className="w-full max-h-48 object-cover rounded-xl" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
