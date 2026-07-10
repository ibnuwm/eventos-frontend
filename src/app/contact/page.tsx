import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/"><Button variant="ghost" size="sm" className="gap-2 mb-8"><ArrowLeft className="w-4 h-4" /> Beranda</Button></Link>
        <h1 className="text-3xl font-bold mb-4">Kontak</h1>
        <p className="text-slate-400 leading-relaxed mb-6">
          Punya pertanyaan atau butuh bantuan? Hubungi kami melalui saluran berikut:
        </p>
        <div className="space-y-3 text-slate-400">
          <p><strong className="text-white">Email:</strong> hello@eventos.id</p>
          <p><strong className="text-white">WhatsApp:</strong> +62 812-1111-2222</p>
          <p><strong className="text-white">Jam Operasional:</strong> Senin - Jumat, 09:00 - 18:00 WIB</p>
        </div>
      </div>
    </div>
  );
}
