# Vendor Event OS (EventOS.id) - Next.js 15 Frontend Application
**Sistem Operasi Bisnis Event & Wedding Management Berbasis Cloud SaaS & AI**

Aplikasi frontend ini dibangun menggunakan standar **Best Practice Modern Frontend Engineering**:
- **Framework:** Next.js 15 (App Router) dengan TypeScript
- **UI Library & Styling:** React 19 + Tailwind CSS + shadcn/ui Design System
- **Icons:** Lucide React
- **State Management:** React Context API dengan interaktivitas penuh secara real-time
- **Arsitektur Modular:** Pemisahan tegas antar komponen UI dasar (`src/components/ui/`), tata letak (`src/components/layout/`), dan modul fungsional bisnis (`src/components/modules/`).

---

## 📂 Struktur Direktori Proyek

```
vendor-event-os/
├── src/
│   ├── app/
│   │   ├── globals.css         # Tema Dark Mode & CSS Variables standar shadcn/ui
│   │   ├── layout.tsx          # Root Layout Next.js dengan konfig Font & Context Provider
│   │   └── page.tsx            # Main SPA Router yang menampung 15 Modul Sistem
│   ├── components/
│   │   ├── layout/             # Komponen Struktur Utama
│   │   │   ├── sidebar.tsx     # Sidebar Navigasi dengan lencana status real-time
│   │   │   └── topbar.tsx      # Header Bar dengan indikator koneksi Webhook WhatsApp API
│   │   ├── modules/            # 13 Komponen Modul Fungsional Event OS
│   │   │   ├── DashboardView.tsx   # Dasbor KPI Eksekutif & Shortcut Modul
│   │   │   ├── CrmView.tsx         # Modul 1: CRM Lead & WhatsApp Follow-Up Pipeline
│   │   │   ├── ProjectView.tsx     # Modul 2 & 7: ClickUp Task Management & Timeline
│   │   │   ├── QuotationView.tsx   # Modul 4: Drag & Drop Quotation Builder
│   │   │   ├── BudgetView.tsx      # Modul 6: Realtime Budget & Margin Engine
│   │   │   ├── RundownView.tsx     # Modul 8: Rundown Builder dengan Auto-Time Shifting
│   │   │   ├── AiView.tsx          # Modul 12: Generative AI Assistant (Event Copilot) ✨
│   │   │   ├── MarketplaceView.tsx # Modul 3 & 13: Vendor Database & B2B Marketplace
│   │   │   ├── InventoryView.tsx   # Modul 14: Asset Conflict Detection Engine
│   │   │   ├── ApprovalView.tsx    # Modul 11: Client Digital Approval Portal (Mobile View)
│   │   │   ├── ChatView.tsx        # Modul 9: Vendor Chat & Communication Hub (Slack Style)
│   │   │   ├── FilesView.tsx       # Modul 10: Cloud File Repository (S3 Compatible)
│   │   │   └── StaffView.tsx       # Modul 15: Staff & Crew Rostering Management
│   │   └── ui/                 # Reusable Atomic UI Components (shadcn/ui style)
│   │       ├── badge.tsx       # Lencana status warna dinamis
│   │       ├── button.tsx      # Komponen tombol dengan varian & ukuran modular
│   │       ├── card.tsx        # Container kartu antarmuka berlapis kaca (glassmorphism)
│   │       └── input.tsx       # Input form berdesain modern
│   ├── lib/
│   │   ├── context.tsx         # Global State Engine & Interaksi Lintas Modul
│   │   ├── mock-data.ts        # Data awal industri event Indonesia (Royal Wedding Anisa & Budi)
│   │   └── utils.ts            # Helper kelas Tailwind (cn) & formatter mata uang Rupiah
│   └── types/
│       └── index.ts            # Definisi ketat TypeScript untuk seluruh entitas sistem
├── next.config.mjs             # Konfigurasi Next.js 15
├── tailwind.config.ts          # Konfigurasi Tailwind CSS Dark Theme
└── package.json                # Dependensi proyek
```

---

## 🌟 Fitur Unggulan Interaktif yang Bisa Dicoba

1. **Simulasi WhatsApp Follow-up (Modul 1):**  
   Buka menu **Modul 1: CRM & Pipeline**, klik tombol **"Follow-Up WA"** pada salah satu prospek untuk memicu pengiriman pesan otomatis melalui WhatsApp API.
2. **Hitung Laba Real-time & Alarm Margin (Modul 6):**  
   Buka menu **Modul 6: Realtime Budget**, ubah nilai angka pada kolom *Pembayaran Klien* atau *Tagihan Vendor B2B*. Perhatikan bagaimana indikator warna berubah otomatis menjadi hijau (Sehat $\ge 20\%$), kuning, atau merah (Kritis $< 10\%$).
3. **Generative AI Event Copilot (Modul 12):**  
   Buka menu **Modul 12: AI Assistant ✨**, klik salah satu chip pertanyaan interaktif (misalnya *"Buat rundown wedding jam 7 pagi"*). AI Copilot akan langsung membalas dengan draf rundown profesional yang disinkronkan ke Modul 8.
4. **Predictive Conflict Detection (Modul 14):**  
   Buka menu **Modul 14: Asset Conflict**, lihat bagaimana sistem memberikan peringatan merah otomatis (*Red Alert Banner*) untuk barang yang mengalami bentrok tanggal peminjaman (Kursi Tiffany Emas).
5. **Client Portal E-Signature (Modul 11):**  
   Buka menu **Modul 11: Client Portal**, coba klik tombol **"Approve"** pada spesifikasi Layout 3D atau Rundown untuk merasakan pengalaman pengesahan nirkontak via HP klien.

---

## 🚀 Menjalankan Aplikasi Secara Lokal / VPS

Jika Anda ingin menjalankan atau mengembangkan kode ini lebih lanjut di terminal server / komputer lokal:

```bash
# Masuk ke direktori aplikasi
cd vendor-event-os

# Pastikan dependensi terinstal
npm install

# Jalankan server pengembangan mode dev
npm run dev
# Aplikasi dapat diakses di http://localhost:3000

# Untuk membangun paket produksi yang siap di-deploy ke Docker/VPS Nginx
npm run build
npm run start
```
