"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, User, QrCode, XCircle, Loader2 } from "lucide-react";
import { checkinTicket } from "@/lib/api";

export default function CheckinPage() {
  const params = useParams();
  const token = params.token as string;
  const [status, setStatus] = useState<"loading" | "success" | "error" | "scan">("scan");
  const [guestData, setGuestData] = useState<any>(null);

  const handleCheckin = async () => {
    setStatus("loading");
    try {
      const res = await checkinTicket(token);
      if (res?.status === "success") {
        setGuestData(res.data);
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm">
        {status === "scan" && (
          <div className="text-center bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-emerald-100 dark:border-gray-700 p-8">
            <QrCode className="w-24 h-24 text-emerald-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Check-in Tamu</h1>
            <p className="text-sm text-muted-foreground mb-6">Scan QR code atau klik tombol di bawah untuk check-in</p>
            <button
              onClick={handleCheckin}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-colors"
            >Konfirmasi Check-in</button>
          </div>
        )}

        {status === "loading" && (
          <div className="text-center bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-emerald-100 dark:border-gray-700 p-8">
            <Loader2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Memvalidasi...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-emerald-100 dark:border-gray-700 p-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
              <CheckCircle2 className="w-24 h-24 text-emerald-500 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Check-in Berhasil!</h1>
            <p className="text-muted-foreground mb-4">Selamat menikmati acara!</p>
            {guestData && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                <p className="font-semibold text-gray-800 dark:text-gray-200">{guestData.guest_name || guestData.name || "Tamu"}</p>
                <p className="text-sm text-muted-foreground">Meja {guestData.table_number || "-"}</p>
              </div>
            )}
          </div>
        )}

        {status === "error" && (
          <div className="text-center bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-red-100 dark:border-gray-700 p-8">
            <XCircle className="w-24 h-24 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-red-500 mb-2">QR Code Tidak Valid</h1>
            <p className="text-sm text-muted-foreground mb-6">QR code sudah digunakan atau tidak terdaftar.</p>
            <button
              onClick={() => setStatus("scan")}
              className="w-full py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors"
            >Coba Lagi</button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
