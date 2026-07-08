"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Sparkles, Users, CheckCircle2 } from "lucide-react";

const posts: Record<string, any> = {
  "tips-memilih-wedding-organizer": {
    title: "7 Tips Memilih Wedding Organizer Terbaik di Jakarta 2026",
    date: "5 Juli 2026",
    category: "Wedding Tips",
    content: `Memilih Wedding Organizer (WO) adalah keputusan krusial dalam perencanaan pernikahan. Berikut 7 tips yang bisa membantu Anda:

1. Cek Portofolio — Pastikan WO memiliki portofolio yang sesuai dengan konsep pernikahan impian Anda. Lihat hasil dokumentasi, dekorasi, dan koordinasi acara sebelumnya.

2. Baca Testimoni — Cari review dari klien sebelumnya. Platform seperti EventOS menyediakan rating vendor yang transparan, termasuk skor SLA punctuality.

3. Bandingkan Paket — Jangan langsung ambil paket termahal atau termurah. Bandingkan detail layanan yang ditawarkan. Gunakan fitur quotation builder untuk simulasi harga interaktif.

4. Cek Ketersediaan — Pastikan tanggal pernikahan Anda tidak bentrok dengan acara lain. Gunakan fitur inventory conflict detection untuk cek double booking.

5. Kenali Tim — Tanyakan siapa yang akan menjadi PIC di hari H. Vendor yang baik memiliki tim yang solid dengan pembagian peran yang jelas.

6. Kontrak Jelas — Pastikan ada kontrak tertulis yang mencakup detail layanan, jadwal pembayaran, dan kebijakan reschedule.

7. Gunakan Platform Digital — Manfaatkan platform seperti EventOS untuk manage leads, quotation, project task, rundown, dan invoice dalam satu dashboard.`,
  },
  "cara-membuat-quotation-event-profesional": {
    title: "Cara Membuat Quotation Event Profesional yang Disukai Klien",
    date: "28 Juni 2026",
    category: "Bisnis Event",
    content: `Quotation adalah senjata utama Anda untuk memenangkan hati klien. Berikut panduan membuat quotation yang efektif:

1. Gunakan Template Profesional — Quotation yang rapi dan terstruktur meningkatkan kepercayaan klien. EventOS menyediakan quotation builder dengan drag-drop modul interaktif.

2. Detailkan Setiap Item — Jangan hanya tulis "Dekorasi Rp 40jt". Rincikan komponen: pelaminan, lighting, florist, dsb. Client lebih percaya ketika tahu apa yang mereka bayar.

3. Tawarkan Opsi — Beri klien pilihan paket atau add-on. Fitur interaktif di EventOS memungkinkan klien mencentang sendiri item yang diinginkan.

4. Sertakan Termin Pembayaran — Cantumkan jadwal pembayaran (DP 30%, Termin 50%, Pelunasan 20%). Sistem auto-accounting EventOS akan generate invoice otomatis saat quotation disetujui.

5. Kirim via WhatsApp — Gunakan fitur Kirim Link WA untuk mengirim quotation langsung ke klien. Lebih cepat dan praktis daripada email.

6. Export PDF Profesional — Untuk keperluan formal, gunakan fitur Export PDF yang menghasilkan dokumen resmi siap cetak.`,
  },
  "vendor-management-tips": {
    title: "Tips Manajemen Vendor Event: Dari Kontrak hingga Evaluasi",
    date: "15 Juni 2026",
    category: "Manajemen",
    content: `Mengelola banyak vendor untuk satu event bisa jadi tantangan. Berikut sistem yang bisa Anda terapkan:

1. Database Vendor Terpusat — Simpan semua data vendor (kontak, harga, NPWP, rekening) dalam satu tempat. EventOS menyediakan database vendor dengan rating SLA dan performa.

2. Tracking SLA — Untuk setiap vendor, lacak ketepatan waktu loading dan kualitas kerja. Skor SLA punctuality membantu Anda memilih vendor terbaik untuk proyek selanjutnya.

3. Komunikasi Terstruktur — Gunakan channel chat per divisi (misal: #dekorasi, #katering, #foto-video) untuk menghindari miskomunikasi.

4. Timeline & Task — Assign task ke masing-masing vendor dengan due date yang jelas. Fitur project management EventOS memudahkan tracking progress.

5. Evaluasi Pasca-Event — Setelah event selesai, beri rating dan review untuk vendor. Data ini berguna untuk proyek mendatang.`,
  },
  "ai-untuk-event-organizer": {
    title: "AI untuk Event Organizer: Cara Kerja AI Copilot di EventOS",
    date: "1 Juni 2026",
    category: "Teknologi",
    content: `Artificial Intelligence bukan hanya untuk tech company. Event Organizer juga bisa memanfaatkan AI untuk efisiensi kerja:

1. Generate Rundown Otomatis — Cukup input detail event (jumlah tamu, venue, jenis acara), AI Copilot akan generate draft rundown menit-per-menit dalam hitungan detik.

2. Analisa Vendor — AI dapat menganalisa performa vendor berdasarkan data historis SLA, rating, dan ulasan untuk merekomendasikan vendor terbaik.

3. Knowledge Base Kontrak — Upload kontrak dan dokumen ke knowledge base. Tanyakan "Apa aturan denda keterlambatan?" dan AI akan menjawab berdasarkan dokumen yang ada.

4. Draft Quotation — AI bisa membantu menyusun draft quotation awal berdasarkan budget dan kebutuhan klien.

5. Surge Pricing — AI menganalisa kalender dan data cuaca BMKG untuk merekomendasikan harga optimal di musim ramai.`,
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = posts[slug];

  if (!post) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="border-slate-800 bg-slate-900 max-w-md"><CardContent className="p-8 text-center space-y-3"><h2 className="text-lg font-bold text-white">Artikel Tidak Ditemukan</h2><a href="/blog"><Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" /> Kembali ke Blog</Button></a></CardContent></Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <a href="/blog"><Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="w-4 h-4" /> Kembali ke Blog</Button></a>
        <div className="space-y-3">
          <div className="flex items-center gap-2"><Badge variant="info" className="text-[10px]">{post.category}</Badge><span className="text-xs text-slate-500">{post.date}</span></div>
          <h1 className="text-2xl font-bold text-white">{post.title}</h1>
        </div>
        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {post.content}
          </CardContent>
        </Card>
        <div className="text-center text-xs text-slate-500 pb-8">EventOS.id Blog &copy; 2026</div>
      </div>
    </div>
  );
}
