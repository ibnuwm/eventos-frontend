import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/"><Button variant="ghost" size="sm" className="gap-2 mb-8"><ArrowLeft className="w-4 h-4" /> Beranda</Button></Link>
        <h1 className="text-3xl font-bold mb-4">Keamanan</h1>
        <div className="space-y-4 text-slate-400 leading-relaxed">
          <p>EventOS mengutamakan keamanan data Anda dengan standar industri:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Enkripsi SSL/TLS untuk seluruh transmisi data</li>
            <li>Server tersertifikasi di data center Indonesia</li>
            <li>Autentikasi dua faktor (2FA) untuk akun admin</li>
            <li>Audit keamanan rutin oleh pihak ketiga</li>
            <li>Backup data harian dengan retensi 90 hari</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
