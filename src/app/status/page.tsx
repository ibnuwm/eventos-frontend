import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/"><Button variant="ghost" size="sm" className="gap-2 mb-8"><ArrowLeft className="w-4 h-4" /> Beranda</Button></Link>
        <h1 className="text-3xl font-bold mb-6">Status Layanan</h1>
        <div className="space-y-3">
          {[
            { name: "Dashboard", status: "Operasional" },
            { name: "API", status: "Operasional" },
            { name: "Marketplace", status: "Operasional" },
            { name: "Payment Gateway", status: "Operasional" },
          ].map((s, i) => (
            <div key={i} className="border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm text-white">{s.name}</span>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
