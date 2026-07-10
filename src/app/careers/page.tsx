import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/"><Button variant="ghost" size="sm" className="gap-2 mb-8"><ArrowLeft className="w-4 h-4" /> Beranda</Button></Link>
        <h1 className="text-3xl font-bold mb-4">Karir</h1>
        <p className="text-slate-400 leading-relaxed mb-6">
          Bergabunglah dengan tim EventOS dan bantu merevolusi industri event Indonesia.
        </p>
        <div className="space-y-4">
          {[
            { pos: "Full-Stack Developer", loc: "Remote / Jakarta" },
            { pos: "UI/UX Designer", loc: "Jakarta" },
            { pos: "Marketing Lead", loc: "Jakarta" },
          ].map((job, i) => (
            <div key={i} className="border border-slate-800 rounded-xl p-4">
              <h3 className="font-semibold text-white">{job.pos}</h3>
              <p className="text-sm text-slate-400">{job.loc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-6">Kirim CV ke karir@eventos.id</p>
      </div>
    </div>
  );
}
