import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/"><Button variant="ghost" size="sm" className="gap-2 mb-8"><ArrowLeft className="w-4 h-4" /> Beranda</Button></Link>
        <h1 className="text-3xl font-bold mb-6">Pusat Bantuan</h1>
        <div className="space-y-6">
          {[
            { q: "Bagaimana cara memulai?", a: "Daftar akun gratis, lengkapi profil, dan Anda siap mengelola event pertama." },
            { q: "Apa saja metode pembayaran?", a: "Kami mendukung QRIS, transfer bank, dan Midtrans untuk berbagai metode pembayaran." },
            { q: "Bagaimana cara mengundang vendor?", a: "Gunakan fitur Marketplace untuk mencari vendor, atau undang langsung via email/WhatsApp." },
            { q: "Apakah data saya aman?", a: "Ya, kami menggunakan enkripsi SSL dan server tersertifikasi. Data Anda sepenuhnya milik Anda." },
          ].map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold text-white mb-1">{item.q}</h3>
              <p className="text-sm text-slate-400">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
