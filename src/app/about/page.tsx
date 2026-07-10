import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/"><Button variant="ghost" size="sm" className="gap-2 mb-8"><ArrowLeft className="w-4 h-4" /> Beranda</Button></Link>
        <h1 className="text-3xl font-bold mb-4">Tentang EventOS</h1>
        <p className="text-slate-400 leading-relaxed mb-4">
          EventOS adalah sistem operasi event & wedding all-in-one untuk WO/EO di Indonesia. Kami membantu ribuan
          penyelenggara event mengelola CRM, vendor, proyek, tim, dan pembayaran dalam satu platform.
        </p>
        <p className="text-slate-400 leading-relaxed">
          Didirikan dengan misi mendigitalisasi industri event Indonesia, EventOS terus berinovasi
          menghadirkan fitur-fitur canggih seperti AI Copilot, escrow digital, dan marketplace vendor.
        </p>
      </div>
    </div>
  );
}
