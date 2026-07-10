import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/"><Button variant="ghost" size="sm" className="gap-2 mb-8"><ArrowLeft className="w-4 h-4" /> Beranda</Button></Link>
        <h1 className="text-3xl font-bold mb-6">Kebijakan Privasi</h1>
        <div className="space-y-4 text-slate-400 leading-relaxed text-sm">
          <p>Kami menghargai privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.</p>
          <h2 className="text-white font-semibold text-base">Data yang Dikumpulkan</h2>
          <p>Kami mengumpulkan data yang Anda berikan: nama, email, nomor WhatsApp, informasi perusahaan, dan data event.</p>
          <h2 className="text-white font-semibold text-base">Penggunaan Data</h2>
          <p>Data digunakan untuk menjalankan layanan, meningkatkan pengalaman, dan komunikasi terkait layanan.</p>
          <h2 className="text-white font-semibold text-base">Perlindungan Data</h2>
          <p>Kami menerapkan enkripsi SSL, akses terbatas, dan audit keamanan rutin untuk melindungi data Anda.</p>
        </div>
      </div>
    </div>
  );
}
