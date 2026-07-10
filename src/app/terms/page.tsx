import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/"><Button variant="ghost" size="sm" className="gap-2 mb-8"><ArrowLeft className="w-4 h-4" /> Beranda</Button></Link>
        <h1 className="text-3xl font-bold mb-6">Syarat & Ketentuan</h1>
        <div className="space-y-4 text-slate-400 leading-relaxed text-sm">
          <p>Dengan menggunakan layanan EventOS, Anda menyetujui syarat dan ketentuan berikut.</p>
          <h2 className="text-white font-semibold text-base">Akun</h2>
          <p>Anda bertanggung jawab menjaga kerahasiaan kredensial akun dan semua aktivitas yang terjadi di akun Anda.</p>
          <h2 className="text-white font-semibold text-base">Layanan</h2>
          <p>EventOS menyediakan platform manajemen event. Kami berhak memperbarui atau mengubah layanan dengan pemberitahuan sebelumnya.</p>
          <h2 className="text-white font-semibold text-base">Batasan Tanggung Jawab</h2>
          <p>EventOS tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari penggunaan layanan kami.</p>
        </div>
      </div>
    </div>
  );
}
