const DB_PREFIX = "eventos_";

function dbGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(DB_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function dbSet<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DB_PREFIX + key, JSON.stringify(data));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

function delay(ms = 200) {
  return new Promise((r) => setTimeout(r, ms));
}

// ============================================================================
// SEED DATA (mirrors backend seeders)
// ============================================================================
const SEED = {
  leads: [
    { id: "lead-1", name: "Chikita Meidy & Reza", whatsapp: "0812-8899-1234", email: "chikita@gmail.com", event_date: "2026-10-12", pax_count: 800, budget_estimation: 180000000, status: "new", notes: "Adat Minang modern, request pelaminan marun emas.", created_at: "2026-07-07" },
    { id: "lead-2", name: "PT Maju Jaya Group (Gala Dinner)", whatsapp: "0811-2233-4455", email: "hrd@majujaya.co.id", event_date: "2026-08-28", pax_count: 350, budget_estimation: 95000000, status: "quotation_sent", notes: "Ballroom Hotel Bintang 5, live band jazz, stage LED P3.", created_at: "2026-07-05" },
    { id: "lead-3", name: "Raditya Dika & Anissa", whatsapp: "0813-9988-7766", email: "raditya@event.id", event_date: "2026-11-20", pax_count: 500, budget_estimation: 150000000, status: "negotiation", notes: "Intimate concept outdoor garden, photobooth 360.", created_at: "2026-07-02" },
  ],
  projects: [
    {
      id: "proj-1", title: "Royal Wedding Anisa & Budi", client_name: "Anisa Rahma & Budi Santoso", event_date: "2026-08-14",
      venue_name: "Grand Hotel Ballroom Jakarta", contract_value: 180000000, vendor_cost: 110000000, operational_cost: 18000000,
      payment_status: "dp_80", days_remaining: 38, progress_percentage: 75,
      tasks: [
        { id: "t-1", division: "Photography", title: "Pre-Wedding Concept & Execution di Bali", due_date: "2026-05-10", is_completed: true, assigned_vendor_name: "Lumiere Photography" },
        { id: "t-2", division: "Decoration", title: "Final Approval Sketsa 3D Pelaminan 15m", due_date: "2026-06-15", is_completed: true, assigned_vendor_name: "Grand Rose Decor" },
        { id: "t-3", division: "Catering", title: "Food Testing Bersama Keluarga VIP (10 Pax)", due_date: "2026-06-25", is_completed: true, assigned_vendor_name: "Gourmet Catering" },
        { id: "t-4", division: "Sound & MC", title: "Technical Meeting & Penentuan Daftar Lagu Request", due_date: "2026-07-20", is_completed: false, assigned_vendor_name: "ProSound Entertainment" },
        { id: "t-5", division: "Photography", title: "Briefing Tim D-Day & Cek Backup Memory Cards", due_date: "2026-08-07", is_completed: false, assigned_vendor_name: "Lumiere Photography" },
      ],
    },
    {
      id: "proj-2", title: "Intimate Garden Wedding Clara & Dave", client_name: "Clara Gopa & Dave Putra", event_date: "2026-11-10",
      venue_name: "Pine Hill Bandung", contract_value: 135000000, vendor_cost: 85000000, operational_cost: 12000000,
      payment_status: "dp_30", days_remaining: 126, progress_percentage: 30,
      tasks: [
        { id: "t-6", division: "Venue", title: "Pembayaran Booking Fee Venue Pine Hill", due_date: "2026-06-01", is_completed: true },
        { id: "t-7", division: "Decoration", title: "Penyusunan Moodboard Rustic Botanical", due_date: "2026-07-15", is_completed: false },
      ],
    },
  ],
  vendors: [
    { id: "v-1", name: "Lumiere Photography Indonesia", category: "Photography", pic_name: "Mas Rio", whatsapp: "0812-1111-2222", rating: 4.9, sla_punctuality: 99.2, starting_price: 18000000, area: "Jabodetabek & Bali" },
    { id: "v-2", name: "Grand Rose Decoration", category: "Decoration", pic_name: "Mba Siska", whatsapp: "0812-3333-4444", rating: 4.8, sla_punctuality: 97.5, starting_price: 40000000, area: "Jabodetabek & Bandung" },
    { id: "v-3", name: "ProSound Audio & LED Screen", category: "Sound & Lighting", pic_name: "Pak Anton", whatsapp: "0812-5555-6666", rating: 4.7, sla_punctuality: 98.0, starting_price: 12000000, area: "Seluruh Jawa" },
    { id: "v-4", name: "Chef Gourmet Catering Service", category: "Catering", pic_name: "Ibu Indah", whatsapp: "0812-7777-8888", rating: 4.9, sla_punctuality: 100.0, starting_price: 85000, area: "Jakarta & Sekitarnya" },
    { id: "v-5", name: "Elite Florist & Styling", category: "Decoration", pic_name: "Bunga", whatsapp: "0812-9999-0000", rating: 4.6, sla_punctuality: 96.0, starting_price: 25000000, area: "Jabodetabek" },
    { id: "v-6", name: "DJ Kenzie Entertainment", category: "MC & Entertainment", pic_name: "Kenzie", whatsapp: "0813-4444-5555", rating: 4.8, sla_punctuality: 97.0, starting_price: 8000000, area: "Seluruh Indonesia" },
  ],
  quotation_items: [
    { id: "q-1", category: "Venue & Catering", title: "Ballroom Bintang 5 & Buffet 800 Pax", vendor_name: "Grand Hotel & Chef Gourmet", price: 95000000, is_selected: true },
    { id: "q-2", category: "Decoration", title: "Dekorasi Pelaminan Custom 15m & Lorong Masuk", vendor_name: "Grand Rose Decor", price: 40000000, is_selected: true },
    { id: "q-3", category: "Documentation", title: "Paket Foto & Video Sinematik (3 Cam + Drone)", vendor_name: "Lumiere Photography", price: 18000000, is_selected: true },
    { id: "q-4", category: "Entertainment", title: "MC Profesional & Acoustic Jazz Band", vendor_name: "ProSound Entertainment", price: 12000000, is_selected: true },
    { id: "q-5", category: "Add-On", title: "Upgrade Multimedia LED Screen P3 3x4 Meter", vendor_name: "ProVisual Indonesia", price: 15000000, is_optional: true, is_selected: false },
  ],
  rundown_items: [
    { id: "r-1", time_slot: "05.00 - 07.30", duration_minutes: 150, activity_title: "Persiapan Makeup & Hairdo Pengantin Wanita & Pria", division_pic: "Divisi MUA & Usher Lead" },
    { id: "r-2", time_slot: "07.30 - 08.30", duration_minutes: 60, activity_title: "Sesi Foto Morning Preparation & First Look Pengantin", division_pic: "Lumiere Photography Team" },
    { id: "r-3", time_slot: "08.30 - 09.30", duration_minutes: 60, activity_title: "Pengondisian Tamu VIP Akad Nikah & Cek Mikrofon Penghulu", division_pic: "ProSound & Usher Lead" },
    { id: "r-4", time_slot: "09.30 - 11.00", duration_minutes: 90, activity_title: "Prosesi Akad Nikah, Ijab Kabul, & Sungkeman Keluarga", division_pic: "MC Penghulu & Video Cam" },
    { id: "r-5", time_slot: "11.30 - 14.30", duration_minutes: 180, activity_title: "Grand Entrance Resepsi, First Dance, & Makan Siang Bersama", division_pic: "Acoustic Band & Catering" },
  ],
  messages: [
    { id: "m-1", channel: "#dekorasi-layout", sender_name: "Mba Rina", sender_role: "Lead WO", text: "Halo tim Grand Rose, untuk penempatan standing flower di lorong pintu utama mohon digeser 50cm ke kanan agar jalur kursi roda aman ya.", created_at: "2026-07-09T10:15:00Z" },
    { id: "m-2", channel: "#dekorasi-layout", sender_name: "Mba Siska", sender_role: "Vendor Decor", text: "Siap Mba Rina! Sudah dicatat di sketsa revisi v3. Besok saat loading jam 04.00 pagi tim langsung sesuaikan.", created_at: "2026-07-09T10:18:00Z" },
    { id: "m-3", channel: "#foto-video", sender_name: "Mas Rio", sender_role: "Vendor Photo", text: "Mohon konfirmasi saat Akad apakah lighting panggung bisa diredupkan sedikit jadi 4000K agar skin tone pengantin natural?", created_at: "2026-07-09T11:05:00Z" },
  ],
  inventory: [
    { id: "inv-1", name: "Kursi Tiffany Emas Premium", category: "Furniture", total_stock: 500, booked_for_date: "2026-08-14", allocated_qty: 550, conflicting_project: "Royal Wedding vs Gala Dinner PT Maju Jaya", has_conflict: true },
    { id: "inv-2", name: "Lampu Par LED 54W RGBW", category: "Lighting", total_stock: 40, booked_for_date: "2026-08-14", allocated_qty: 32, has_conflict: false },
    { id: "inv-3", name: "Standing Flower Acrylic 1.5m", category: "Floral", total_stock: 24, booked_for_date: "2026-08-14", allocated_qty: 20, has_conflict: false },
  ],
  staff: [
    { id: "st-1", name: "Dimas Anggara", role: "Stage Manager", assigned_event_title: "Royal Wedding Anisa & Budi", check_in_time: "04.15 WIB (On Time)", location: "Grand Hotel Ballroom", status: "checked_in" },
    { id: "st-2", name: "Sinta Maharani", role: "Usher Lead", assigned_event_title: "Royal Wedding Anisa & Budi", check_in_time: "05.00 WIB (On Time)", location: "Grand Hotel Lobby", status: "checked_in" },
    { id: "st-3", name: "Bagus Putra", role: "Sound Technician", assigned_event_title: "Royal Wedding Anisa & Budi", location: "Grand Hotel Loading Dock", status: "on_way" },
  ],
  approvals: [
    { id: "a-1", type: "Quotation", title: "Quotation Royal Wedding — Grand Ballroom Package", client_name: "Anisa Rahma & Budi Santoso", status: "pending", created_at: "2026-07-07" },
    { id: "a-2", type: "Rundown", title: "Rundown Hari H — Akad & Resepsi", client_name: "Anisa Rahma & Budi Santoso", status: "pending", created_at: "2026-07-06" },
    { id: "a-3", type: "Layout", title: "3D Denah Meja & Panggung VIP", client_name: "Anisa Rahma & Budi Santoso", status: "approved", created_at: "2026-07-05" },
  ],
  files: [
    { id: "f-1", name: "Kontrak_WO_Royal_Wedding_v3.pdf", folder: "/Contracts", size: "2.4 MB", uploaded_by: "Anisa", uploaded_at: "2026-07-01" },
    { id: "f-2", name: "Invoice_DP_80_Royal.pdf", folder: "/Invoices", size: "1.1 MB", uploaded_by: "Bendahara", uploaded_at: "2026-07-02" },
    { id: "f-3", name: "Moodboard_Rustic_Botanical.jpg", folder: "/Moodboards", size: "8.7 MB", uploaded_by: "Mba Rina", uploaded_at: "2026-06-28" },
    { id: "f-4", name: "CAD_Layout_Pelaminan_v5.dwg", folder: "/CAD_Layouts", size: "4.3 MB", uploaded_by: "Grand Rose", uploaded_at: "2026-06-25" },
    { id: "f-5", name: "Rundown_Acara_H-1.pdf", folder: "/Rundowns", size: "0.8 MB", uploaded_by: "Stage Manager", uploaded_at: "2026-07-05" },
  ],
  guests: [
    { id: "g-1", tenant_id: "t-1", project_id: "proj-1", name: "Ibu Sari Dewi", whatsapp: "0812-1111-0001", category: "Keluarga", guest_count: 3, rsvp_status: "confirmed", menu_choice: "Nasi Box Premium", notes: "Alergi seafood", table_number: "VIP-1", token: "demo-rsvp-ibu-sari", created_at: "2026-07-07" },
    { id: "g-2", tenant_id: "t-1", project_id: "proj-1", name: "Pak Budi Hartono", whatsapp: "0812-1111-0002", category: "VIP", guest_count: 2, rsvp_status: "pending", table_number: "VIP-2", token: "demo-rsvp-pak-budi", created_at: "2026-07-07" },
    { id: "g-3", tenant_id: "t-1", project_id: "proj-1", name: "Mba Rina (MUA)", whatsapp: "0812-1111-0004", category: "VIP", guest_count: 1, rsvp_status: "confirmed", menu_choice: "Vegetarian", notes: "Pintu masuk belakang", table_number: "VIP-1", token: "demo-rsvp-mba-rina", created_at: "2026-07-06" },
    { id: "g-4", tenant_id: "t-1", project_id: "proj-1", name: "Keluarga Besar Santoso", whatsapp: "0812-1111-0005", category: "Keluarga", guest_count: 5, rsvp_status: "pending", table_number: "A-1", created_at: "2026-07-06" },
    { id: "g-5", tenant_id: "t-1", project_id: "proj-1", name: "Teman Kantor Anisa", category: "Umum", guest_count: 8, rsvp_status: "pending", notes: "Sebaris di belakang", created_at: "2026-07-05" },
    { id: "g-6", tenant_id: "t-1", project_id: "proj-2", name: "Teman Kantor Clara", whatsapp: "0812-1111-0003", category: "Umum", guest_count: 1, rsvp_status: "declined", notes: "Tidak bisa hadir, ada acara keluarga", token: "demo-rsvp-teman-clara", created_at: "2026-07-07" },
  ],
  websites: [
    { id: "ws-1", project_id: "proj-1", template_style: "modern", couple_name: "Anisa & Budi", event_date: "2026-08-14", venue_name: "Grand Hotel Ballroom Jakarta", venue_address: "Jl. MH Thamrin No.1, Jakarta Pusat", google_maps_link: "https://maps.google.com/?q=Grand+Hotel+Jakarta", gallery_images: ["/images/gallery-1.jpg", "/images/gallery-2.jpg"], love_story: "Pertemuan pertama di acara seminar event tahun 2021...", countdown_enabled: true, rsvp_enabled: true, gallery_enabled: true, slug: "anisa-budi", is_published: false },
    { id: "ws-2", project_id: "proj-2", template_style: "rustic", couple_name: "Clara & Dave", event_date: "2026-11-10", venue_name: "Pine Hill Bandung", venue_address: "Jl. Raya Lembang No. 110, Bandung Barat", countdown_enabled: true, rsvp_enabled: true, gallery_enabled: false, slug: "clara-dave", is_published: true },
  ],
  invitations: [
    { id: "inv-1", project_id: "proj-1", template_style: "modern", couple_name: "Anisa & Budi", event_date: "2026-08-14", event_time: "09.00 WIB - Selesai", venue_name: "Grand Hotel Ballroom Jakarta", venue_address: "Jl. MH Thamrin No.1, Jakarta Pusat", google_maps_link: "https://maps.google.com/?q=Grand+Hotel+Jakarta", guest_names: ["Ibu Sari Dewi", "Pak Budi Hartono", "Mba Rina"], sender_name: "Anisa Rahma", message: "Mohon doa restu dan kehadirannya ya!", status: "sent", sent_at: "2026-07-25" },
    { id: "inv-2", project_id: "proj-1", template_style: "modern", couple_name: "Anisa & Budi", event_date: "2026-08-14", event_time: "09.00 WIB - Selesai", venue_name: "Grand Hotel Ballroom Jakarta", venue_address: "Jl. MH Thamrin No.1, Jakarta Pusat", guest_names: ["Keluarga Besar Santoso"], sender_name: "Anisa Rahma", message: "Mohon doa restu! 🙏", status: "draft" },
  ],
  wa_messages: [
    { id: "w-1", contact: "Lumiere Photography", text: "Halo, untuk sesi foto prewedding mohon dikonfirmasi jam nya ya", time: "10:30", direction: "out" },
    { id: "w-2", contact: "Grand Rose Decor", text: "Baik, untuk sketsa 3D pelaminan sudah disetujui klien", time: "11:15", direction: "in" },
    { id: "w-3", contact: "ProSound", text: "Mohon ceklist peralatan sound untuk acara 14 Agustus", time: "13:00", direction: "out" },
  ],
  workflows: [
    { id: "wf-1", name: "Konfirmasi Lead Baru", trigger: "lead_created", action: "send_wa", action_config: { contact: "lead", template: "Halo {name}, terima kasih telah menghubungi EventOS!" }, is_active: true },
    { id: "wf-2", name: "Buat Proyek dari Lead Won", trigger: "lead_won", action: "create_project", action_config: { template_id: "default" }, is_active: true },
    { id: "wf-3", name: "Kirim Pengingat Pembayaran", trigger: "date_approaching", action: "send_wa", action_config: { days_before: "7", template: "Yth. {name}, pembayaran akan jatuh tempo dalam 7 hari." }, is_active: false },
  ],
  design_boards: [
    { id: "db-1", project_id: "proj-1", title: "Moodboard Royal Wedding", style: "Modern Elegan", color_palette: ["#C9A96E", "#2C1810", "#F5F0E8", "#8B7355", "#D4C5A0"], images: ["/moodboard/royal-1.jpg", "/moodboard/royal-2.jpg"], notes: "Gold & ivory theme with wooden accents", is_shared: true, created_at: "2026-07-01" },
    { id: "db-2", project_id: "proj-2", title: "Rustic Garden Concept", style: "Rustic Natural", color_palette: ["#5B7B5E", "#D4A574", "#F5EDE0", "#8B5E3C", "#A8C5A0"], images: ["/moodboard/rustic-1.jpg"], notes: "Earthy tones with botanical elements", is_shared: false, created_at: "2026-07-05" },
  ],
  booking_slots: [
    { id: "bs-1", vendor_id: "v-1", date: "2026-07-15", start_time: "09:00", end_time: "10:00", status: "available" },
    { id: "bs-2", vendor_id: "v-1", date: "2026-07-15", start_time: "10:00", end_time: "11:00", status: "booked", client_name: "Chikita Meidy" },
    { id: "bs-3", vendor_id: "v-1", date: "2026-07-15", start_time: "13:00", end_time: "14:00", status: "available" },
    { id: "bs-4", vendor_id: "v-2", date: "2026-07-16", start_time: "10:00", end_time: "11:00", status: "available" },
    { id: "bs-5", vendor_id: "v-2", date: "2026-07-16", start_time: "11:00", end_time: "12:00", status: "pending", client_name: "Raditya Dika" },
  ],
  kpi_data: {
    revenue: [
      { month: "Feb", revenue: 145000000, cost: 95000000, profit: 50000000 },
      { month: "Mar", revenue: 210000000, cost: 135000000, profit: 75000000 },
      { month: "Apr", revenue: 170000000, cost: 110000000, profit: 60000000 },
      { month: "Mei", revenue: 280000000, cost: 170000000, profit: 110000000 },
      { month: "Jun", revenue: 195000000, cost: 120000000, profit: 75000000 },
      { month: "Jul", revenue: 320000000, cost: 195000000, profit: 125000000 },
    ],
    lead_funnel: [
      { stage: "Lead Baru", count: 8, value: 950000000 },
      { stage: "Dihubungi", count: 6, value: 780000000 },
      { stage: "Quotation", count: 4, value: 520000000 },
      { stage: "Negosiasi", count: 3, value: 410000000 },
      { stage: "Won", count: 2, value: 315000000 },
    ],
    vendor_benchmarks: [
      { vendor_id: "v-1", name: "Lumiere Photography", category: "Photography", rating: 4.9, sla: 99.2, project_count: 24, avg_contract_value: 18500000, on_time_delivery: 98 },
      { vendor_id: "v-2", name: "Grand Rose Decor", category: "Decoration", rating: 4.8, sla: 97.5, project_count: 18, avg_contract_value: 42000000, on_time_delivery: 95 },
      { vendor_id: "v-3", name: "ProSound Audio", category: "Sound & Lighting", rating: 4.7, sla: 98.0, project_count: 31, avg_contract_value: 13500000, on_time_delivery: 96 },
      { vendor_id: "v-4", name: "Chef Gourmet Catering", category: "Catering", rating: 4.9, sla: 100.0, project_count: 15, avg_contract_value: 55000000, on_time_delivery: 100 },
    ],
  },
  transactions: [
    { id: "tr-1", project_id: "proj-1", date: "2026-06-01", description: "DP 30% - Royal Wedding Anisa & Budi", category: "income", type: "client_payment", amount: 54000000, tax_amount: 5400000, reference: "INV-2026-001" },
    { id: "tr-2", project_id: "proj-1", date: "2026-06-10", description: "Pembayaran DP Lumiere Photography", category: "expense", type: "vendor_payment", amount: 5400000, notes: "DP 30% Lumiere" },
    { id: "tr-3", project_id: "proj-1", date: "2026-06-15", description: "Pembayaran DP Grand Rose Decor", category: "expense", type: "vendor_payment", amount: 12000000, notes: "DP 30% Grand Rose" },
    { id: "tr-4", project_id: "proj-1", date: "2026-07-01", description: "DP 80% - Royal Wedding", category: "income", type: "client_payment", amount: 90000000, tax_amount: 9000000, reference: "INV-2026-002" },
    { id: "tr-5", project_id: "proj-1", date: "2026-07-05", description: "Operasional - Sewa Sound System Tambahan", category: "expense", type: "operational", amount: 3500000 },
    { id: "tr-6", project_id: "proj-2", date: "2026-06-20", description: "Booking Fee - Intimate Garden Wedding", category: "income", type: "client_payment", amount: 13500000, tax_amount: 1350000, reference: "INV-2026-003" },
    { id: "tr-7", project_id: "proj-2", date: "2026-07-08", description: "Setoran PPN Masa Juni", category: "expense", type: "tax_ppn", amount: 5400000, notes: "PPN 11%" },
  ],
  gift_registries: [
    { id: "gr-1", project_id: "proj-1", couple_name: "Anisa & Budi", type: "cash", target_amount: 50000000, collected_amount: 18500000, is_active: true, qris_link: "https://qr.is/eventos/anisa-budi", bank_account: "BCA 1234567890 a.n. Anisa Rahma", message: "Doa & restu Anda adalah hadiah terbaik. Namun jika ingin memberi tanda cinta, silakan :)", created_at: "2026-07-01" },
    { id: "gr-2", project_id: "proj-2", couple_name: "Clara & Dave", type: "cash", target_amount: 30000000, collected_amount: 5000000, is_active: true, qris_link: "https://qr.is/eventos/clara-dave", bank_account: "Mandiri 9876543210 a.n. Clara Gopa", created_at: "2026-07-05" },
  ],
  email_templates: [
    { id: "et-1", name: "Follow-up Lead Baru", subject: "Terima kasih telah menghubungi {company}", body: "Halo {name},\n\nTerima kasih telah menghubungi {company}. Kami akan segera menghubungi Anda dalam 1x24 jam.\n\nSalam hangat,\n{company}", category: "followup" },
    { id: "et-2", name: "Invoice Pembayaran", subject: "Invoice Pembayaran - {project}", body: "Yth. {name},\n\nBersama ini kami kirimkan invoice untuk proyek {project} sebesar {amount}.\n\nSilakan melakukan pembayaran sebelum {due_date}.\n\nTerima kasih,\n{company}", category: "invoice" },
    { id: "et-3", name: "Thank You Note", subject: "Terima kasih {name}!", body: "Halo {name},\n\nTerima kasih telah mempercayakan acara spesial Anda kepada {company}. Kami senang bisa menjadi bagian dari hari bahagia Anda!\n\nSalam hangat,\n{company}", category: "thankyou" },
  ],
  meetings: [
    { id: "mt-1", project_id: "proj-1", title: "Kickoff Meeting Royal Wedding", platform: "zoom", url: "https://zoom.us/j/123456789", date: "2026-07-20", start_time: "10:00", duration: 60, participants: ["Anisa Rahma", "Budi Santoso", "Mba Rina (WO)", "Mas Rio (Lumiere)"], notes: "Membahas rundown akhir & konfirmasi vendor" },
    { id: "mt-2", project_id: "proj-1", title: "Food Tasting Session", platform: "wa_video", url: "https://wa.me/628121111000", date: "2026-07-25", start_time: "14:00", duration: 30, participants: ["Anisa", "Chef Gourmet"], notes: "Finalisasi menu prasmanan" },
  ],
};

export function seedDatabase() {
  for (const [key, data] of Object.entries(SEED)) {
    if (!localStorage.getItem(DB_PREFIX + key)) {
      dbSet(key, data);
    }
  }
}

export function resetDatabase() {
  for (const key of Object.keys(SEED)) {
    localStorage.removeItem(DB_PREFIX + key);
  }
  seedDatabase();
}

// ============================================================================
// LEADS
// ============================================================================
export async function fetchLeads() {
  await delay(150);
  return { data: dbGet("leads", SEED.leads) };
}

export async function createLead(data: any) {
  await delay(100);
  const leads = dbGet<any[]>("leads", SEED.leads);
  const newLead = { id: uid(), ...data, created_at: new Date().toISOString().split("T")[0], status: "new" };
  leads.push(newLead);
  dbSet("leads", leads);
  return { status: "success", data: newLead };
}

export async function updateLeadStatus(leadId: string, status: string) {
  await delay(100);
  const leads = dbGet<any[]>("leads", SEED.leads);
  const idx = leads.findIndex((l: any) => l.id === leadId);
  if (idx === -1) return { status: "error", message: "Lead not found" };
  leads[idx].status = status;
  dbSet("leads", leads);
  return { status: "success", data: leads[idx] };
}

export async function deleteLead(leadId: string) {
  await delay(100);
  const leads = dbGet<any[]>("leads", SEED.leads);
  dbSet("leads", leads.filter((l: any) => l.id !== leadId));
  return { status: "success" };
}

// ============================================================================
// PROJECTS
// ============================================================================
export async function fetchProjects() {
  await delay(150);
  return { data: dbGet("projects", SEED.projects) };
}

export async function toggleTask(taskId: string) {
  await delay(100);
  const projects = dbGet<any[]>("projects", SEED.projects);
  for (const proj of projects) {
    const taskIdx = proj.tasks.findIndex((t: any) => t.id === taskId);
    if (taskIdx !== -1) {
      proj.tasks[taskIdx].is_completed = !proj.tasks[taskIdx].is_completed;
      const completed = proj.tasks.filter((t: any) => t.is_completed).length;
      proj.progress_percentage = Math.round((completed / proj.tasks.length) * 100);
      dbSet("projects", projects);
      return { data: { project_id: proj.id, task: proj.tasks[taskIdx], progress_percentage: proj.progress_percentage } };
    }
  }
  return { status: "error", message: "Task not found" };
}

// ============================================================================
// VENDORS
// ============================================================================
export async function fetchVendors() {
  await delay(150);
  return { data: dbGet("vendors", SEED.vendors) };
}

export async function bookVendor(vendorId: string) {
  await delay(100);
  const vendors = dbGet<any[]>("vendors", SEED.vendors);
  const v = vendors.find((x: any) => x.id === vendorId);
  if (v) v.is_booked = true;
  dbSet("vendors", vendors);
  return { status: "success", data: v };
}

// ============================================================================
// QUOTATIONS
// ============================================================================
export async function fetchQuotations() {
  await delay(150);
  return { items: dbGet("quotation_items", SEED.quotation_items) };
}

export async function toggleQuoteItem(itemId: string) {
  await delay(100);
  const items = dbGet<any[]>("quotation_items", SEED.quotation_items);
  const item = items.find((i: any) => i.id === itemId);
  if (item) item.is_selected = !item.is_selected;
  dbSet("quotation_items", items);
  return { data: item };
}

export async function addQuoteItem(data: any) {
  await delay(100);
  const items = dbGet<any[]>("quotation_items", SEED.quotation_items);
  const newItem = { id: uid(), ...data };
  items.push(newItem);
  dbSet("quotation_items", items);
  return { data: newItem };
}

export async function deleteQuoteItem(itemId: string) {
  await delay(100);
  const items = dbGet<any[]>("quotation_items", SEED.quotation_items);
  dbSet("quotation_items", items.filter((i: any) => i.id !== itemId));
  return { status: "success" };
}

export async function lockQuotation(id: string) {
  await delay(200);
  return { status: "success", data: { id, locked: true } };
}

export async function exportQuotation(id: string) {
  await delay(300);
  return { status: "success", data: { html: "<html><body><h1>Quotation " + id + "</h1></body></html>" } };
}

export async function sendQuotationWa(id: string) {
  await delay(200);
  window.open(`https://wa.me/?text=${encodeURIComponent(`Quotation ${id} telah dikirim. Lihat detail di dashboard EventOS.`)}`, "_blank");
  return { status: "success" };
}

// ============================================================================
// RUNDOWN
// ============================================================================
export async function fetchRundownItems() {
  await delay(150);
  return { data: dbGet("rundown_items", SEED.rundown_items) };
}

export async function addRundownItem(data: any) {
  await delay(100);
  const items = dbGet<any[]>("rundown_items", SEED.rundown_items);
  const newItem = { id: uid(), ...data };
  items.push(newItem);
  dbSet("rundown_items", items);
  return { data: newItem };
}

// ============================================================================
// CHAT
// ============================================================================
export async function fetchMessages() {
  await delay(150);
  return { data: dbGet("messages", SEED.messages) };
}

export async function sendMessage(data: any) {
  await delay(100);
  const msgs = dbGet<any[]>("messages", SEED.messages);
  const newMsg = { id: uid(), ...data, created_at: new Date().toISOString() };
  msgs.push(newMsg);
  dbSet("messages", msgs);
  return { data: newMsg };
}

// ============================================================================
// INVENTORY
// ============================================================================
export async function fetchInventory() {
  await delay(150);
  return { data: dbGet("inventory", SEED.inventory) };
}

export async function resolveConflict(invId: string) {
  await delay(100);
  const items = dbGet<any[]>("inventory", SEED.inventory);
  const item = items.find((i: any) => i.id === invId);
  if (item) item.has_conflict = false;
  dbSet("inventory", items);
  return { status: "success", data: item };
}

// ============================================================================
// STAFF
// ============================================================================
export async function fetchStaff() {
  await delay(150);
  return { data: dbGet("staff", SEED.staff) };
}

// ============================================================================
// FILES
// ============================================================================
export async function fetchFiles() {
  await delay(150);
  return { data: dbGet("files", SEED.files) };
}

export async function uploadFile(file: any) {
  await delay(300);
  const files = dbGet<any[]>("files", SEED.files);
  const newFile = { id: uid(), name: file.name, folder: file.folder || "/Invoices", size: file.size || "0 B", uploaded_by: "Anda", uploaded_at: new Date().toISOString().split("T")[0] };
  files.unshift(newFile);
  dbSet("files", files);
  return { status: "success", data: newFile };
}

export async function deleteFile(fileId: string) {
  await delay(100);
  const files = dbGet<any[]>("files", SEED.files);
  dbSet("files", files.filter((f: any) => f.id !== fileId));
  return { status: "success" };
}

// ============================================================================
// APPROVALS
// ============================================================================
export async function fetchApprovals() {
  await delay(150);
  return { data: dbGet("approvals", SEED.approvals) };
}

export async function approveApproval(id: string) {
  await delay(200);
  const approvals = dbGet<any[]>("approvals", SEED.approvals);
  const a = approvals.find((x: any) => x.id === id);
  if (a) a.status = "approved";
  dbSet("approvals", approvals);
  return { status: "success", data: a };
}

export async function generateApprovalLink(id: string) {
  await delay(100);
  const link = `https://eventos.id/portal/${id}`;
  await navigator.clipboard.writeText(link);
  return { status: "success", data: { link } };
}

// ============================================================================
// GUESTS
// ============================================================================
export async function fetchGuests(projectId = "proj-1") {
  await delay(150);
  const all = dbGet<any[]>("guests", SEED.guests);
  const data = projectId ? all.filter((g: any) => g.project_id === projectId) : all;
  return { data };
}

export async function addGuest(data: any) {
  await delay(100);
  const guests = dbGet<any[]>("guests", SEED.guests);
  const token = uid() + uid();
  const newGuest = {
    id: uid(), tenant_id: "t-1", project_id: data.project_id || "proj-1",
    name: data.name, whatsapp: data.whatsapp || null,
    category: data.category || "Umum", guest_count: Number(data.guest_count) || 1,
    rsvp_status: "pending", menu_choice: data.menu_choice || null,
    notes: data.notes || null, table_number: data.table_number || null,
    token, created_at: new Date().toISOString().split("T")[0],
  };
  guests.push(newGuest);
  dbSet("guests", guests);
  return { status: "success", data: newGuest };
}

export async function importGuests(data: any[]) {
  await delay(200);
  const guests = dbGet<any[]>("guests", SEED.guests);
  const imported: any[] = [];
  for (const g of data) {
    const newG = {
      id: uid(), tenant_id: "t-1", project_id: g.project_id || "proj-1",
      name: g.name, whatsapp: g.whatsapp || null,
      category: g.category || "Umum", guest_count: Number(g.guest_count) || 1,
      rsvp_status: "pending", menu_choice: null,
      notes: g.notes || null, table_number: null,
      token: uid() + uid(), created_at: new Date().toISOString().split("T")[0],
    };
    guests.push(newG);
    imported.push(newG);
  }
  dbSet("guests", guests);
  return { status: "success", data: imported };
}

export async function updateGuestStatus(guestId: string, status: string) {
  await delay(100);
  const guests = dbGet<any[]>("guests", SEED.guests);
  const g = guests.find((x: any) => x.id === guestId);
  if (g) g.rsvp_status = status;
  dbSet("guests", guests);
  return { status: "success", data: g };
}

export async function updateGuest(guestId: string, data: any) {
  await delay(100);
  const guests = dbGet<any[]>("guests", SEED.guests);
  const idx = guests.findIndex((x: any) => x.id === guestId);
  if (idx === -1) return { status: "error", message: "Guest not found" };
  guests[idx] = { ...guests[idx], ...data };
  dbSet("guests", guests);
  return { status: "success", data: guests[idx] };
}

export async function deleteGuest(guestId: string) {
  await delay(100);
  const guests = dbGet<any[]>("guests", SEED.guests);
  dbSet("guests", guests.filter((g: any) => g.id !== guestId));
  return { status: "success" };
}

export async function sendWaBlast(projectId: string, message: string) {
  await delay(300);
  const guests = dbGet<any[]>("guests", SEED.guests);
  const projectGuests = guests.filter((g: any) => g.project_id === projectId && g.whatsapp);
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  return { status: "success", data: { count: projectGuests.length } };
}

export async function generateQrCheckin(guestId: string) {
  await delay(100);
  const guests = dbGet<any[]>("guests", SEED.guests);
  const g = guests.find((x: any) => x.id === guestId);
  const token = g?.token || uid();
  return { status: "success", data: { qrToken: token, url: `http://localhost:3000/rsvp/${token}` } };
}

// ============================================================================
// WEBSITE BUILDER
// ============================================================================
export async function fetchWebsites(projectId = "proj-1") {
  await delay(150);
  const all = dbGet<any[]>("websites", SEED.websites);
  return { data: all.filter((w: any) => w.project_id === projectId) };
}

export async function fetchWebsiteBySlug(slug: string) {
  await delay(100);
  const all = dbGet<any[]>("websites", SEED.websites);
  return { data: all.find((w: any) => w.slug === slug) || null };
}

export async function saveWebsite(data: any) {
  await delay(200);
  const websites = dbGet<any[]>("websites", SEED.websites);
  const existing = websites.findIndex((w: any) => w.project_id === data.project_id);
  if (existing >= 0) {
    websites[existing] = { ...websites[existing], ...data };
    dbSet("websites", websites);
    return { status: "success", data: websites[existing] };
  }
  const newWs = { id: uid(), project_id: data.project_id, ...data, is_published: false };
  websites.push(newWs);
  dbSet("websites", websites);
  return { status: "success", data: newWs };
}

export async function publishWebsite(projectId: string) {
  await delay(200);
  const websites = dbGet<any[]>("websites", SEED.websites);
  const w = websites.find((x: any) => x.project_id === projectId);
  if (w) w.is_published = true;
  dbSet("websites", websites);
  return { status: "success", data: w };
}

// ============================================================================
// DIGITAL INVITATIONS
// ============================================================================
export async function fetchInvitations(projectId = "proj-1") {
  await delay(150);
  const all = dbGet<any[]>("invitations", SEED.invitations);
  return { data: all.filter((i: any) => i.project_id === projectId) };
}

export async function createInvitation(data: any) {
  await delay(100);
  const invitations = dbGet<any[]>("invitations", SEED.invitations);
  const newInv = { id: uid(), ...data, status: "draft" };
  invitations.push(newInv);
  dbSet("invitations", invitations);
  return { status: "success", data: newInv };
}

export async function sendInvitation(invId: string) {
  await delay(200);
  const invitations = dbGet<any[]>("invitations", SEED.invitations);
  const inv = invitations.find((x: any) => x.id === invId);
  if (inv) { inv.status = "sent"; inv.sent_at = new Date().toISOString().split("T")[0]; }
  dbSet("invitations", invitations);
  return { status: "success", data: inv };
}

// ============================================================================
// WORKFLOW AUTOMATION
// ============================================================================
export async function fetchWorkflows() {
  await delay(150);
  return { data: dbGet("workflows", SEED.workflows) };
}

export async function toggleWorkflow(wfId: string) {
  await delay(100);
  const workflows = dbGet<any[]>("workflows", SEED.workflows);
  const wf = workflows.find((x: any) => x.id === wfId);
  if (wf) wf.is_active = !wf.is_active;
  dbSet("workflows", workflows);
  return { status: "success", data: wf };
}

export async function createWorkflow(data: any) {
  await delay(100);
  const workflows = dbGet<any[]>("workflows", SEED.workflows);
  const newWf = { id: uid(), ...data, is_active: true };
  workflows.push(newWf);
  dbSet("workflows", workflows);
  return { status: "success", data: newWf };
}

// ============================================================================
// DESIGN STUDIO / MOODBOARDS
// ============================================================================
export async function fetchDesignBoards(projectId = "proj-1") {
  await delay(150);
  const all = dbGet<any[]>("design_boards", SEED.design_boards);
  return { data: all.filter((b: any) => b.project_id === projectId) };
}

export async function createDesignBoard(data: any) {
  await delay(100);
  const boards = dbGet<any[]>("design_boards", SEED.design_boards);
  const newBoard = { id: uid(), ...data, is_shared: false, created_at: new Date().toISOString().split("T")[0] };
  boards.push(newBoard);
  dbSet("design_boards", boards);
  return { status: "success", data: newBoard };
}

export async function toggleShareBoard(boardId: string) {
  await delay(100);
  const boards = dbGet<any[]>("design_boards", SEED.design_boards);
  const b = boards.find((x: any) => x.id === boardId);
  if (b) b.is_shared = !b.is_shared;
  dbSet("design_boards", boards);
  return { status: "success", data: b };
}

// ============================================================================
// BOOKING SLOTS
// ============================================================================
export async function fetchBookingSlots() {
  await delay(150);
  return { data: dbGet("booking_slots", SEED.booking_slots) };
}

export async function createBookingSlot(data: any) {
  await delay(100);
  const slots = dbGet<any[]>("booking_slots", SEED.booking_slots);
  const newSlot = { id: uid(), ...data, status: "available" };
  slots.push(newSlot);
  dbSet("booking_slots", slots);
  return { status: "success", data: newSlot };
}

export async function bookSlot(slotId: string, clientName: string) {
  await delay(100);
  const slots = dbGet<any[]>("booking_slots", SEED.booking_slots);
  const slot = slots.find((x: any) => x.id === slotId);
  if (slot) { slot.status = "booked"; slot.client_name = clientName; }
  dbSet("booking_slots", slots);
  return { status: "success", data: slot };
}

// ============================================================================
// ANALYTICS
// ============================================================================
export async function fetchAnalyticsData() {
  await delay(200);
  const projects = dbGet<any[]>("projects", SEED.projects);
  const leads = dbGet<any[]>("leads", SEED.leads);
  const kpi = SEED.kpi_data;
  return {
    data: {
      revenue_data: kpi.revenue,
      lead_funnel: kpi.lead_funnel,
      vendor_benchmarks: kpi.vendor_benchmarks,
      total_revenue: kpi.revenue.reduce((s: number, m: any) => s + m.revenue, 0),
      total_profit: kpi.revenue.reduce((s: number, m: any) => s + m.profit, 0),
      avg_margin: kpi.revenue.length > 0
        ? (kpi.revenue.reduce((s: number, m: any) => s + (m.profit / m.revenue * 100), 0) / kpi.revenue.length)
        : 0,
    },
  };
}

// ============================================================================
// ACCOUNTING
// ============================================================================
export async function fetchTransactions(projectId?: string) {
  await delay(150);
  const all = dbGet<any[]>("transactions", SEED.transactions);
  return { data: projectId ? all.filter((t: any) => t.project_id === projectId) : all };
}

export async function addTransaction(data: any) {
  await delay(100);
  const txns = dbGet<any[]>("transactions", SEED.transactions);
  const newTx = { id: uid(), ...data, date: data.date || new Date().toISOString().split("T")[0] };
  txns.push(newTx);
  dbSet("transactions", txns);
  return { status: "success", data: newTx };
}

export async function generatePnlReport(projectId?: string) {
  await delay(300);
  const txns = dbGet<any[]>("transactions", SEED.transactions);
  const filtered = projectId ? txns.filter((t: any) => t.project_id === projectId) : txns;
  const income = filtered.filter((t: any) => t.category === "income").reduce((s: number, t: any) => s + t.amount, 0);
  const expense = filtered.filter((t: any) => t.category === "expense").reduce((s: number, t: any) => s + t.amount, 0);
  const taxTotal = filtered.reduce((s: number, t: any) => s + (t.tax_amount || 0), 0);
  return { status: "success", data: { income, expense, tax_total: taxTotal, net_profit: income - expense - taxTotal } };
}

// ============================================================================
// GIFT REGISTRY
// ============================================================================
export async function fetchGiftRegistries(projectId = "proj-1") {
  await delay(150);
  const all = dbGet<any[]>("gift_registries", SEED.gift_registries);
  return { data: all.filter((g: any) => g.project_id === projectId) };
}

export async function createGiftRegistry(data: any) {
  await delay(100);
  const registries = dbGet<any[]>("gift_registries", SEED.gift_registries);
  const newGr = { id: uid(), ...data, collected_amount: 0, is_active: true, created_at: new Date().toISOString().split("T")[0] };
  registries.push(newGr);
  dbSet("gift_registries", registries);
  return { status: "success", data: newGr };
}

// ============================================================================
// EMAIL
// ============================================================================
export async function fetchEmailTemplates() {
  await delay(150);
  return { data: dbGet("email_templates", SEED.email_templates) };
}

export async function createEmailTemplate(data: any) {
  await delay(100);
  const tmpl = dbGet<any[]>("email_templates", SEED.email_templates);
  const newTmpl = { id: uid(), ...data };
  tmpl.push(newTmpl);
  dbSet("email_templates", tmpl);
  return { status: "success", data: newTmpl };
}

// ============================================================================
// VIDEO CALL / MEETINGS
// ============================================================================
export async function fetchMeetings(projectId = "proj-1") {
  await delay(150);
  const all = dbGet<any[]>("meetings", SEED.meetings);
  return { data: all.filter((m: any) => m.project_id === projectId) };
}

export async function createMeeting(data: any) {
  await delay(100);
  const meetings = dbGet<any[]>("meetings", SEED.meetings);
  const newMt = { id: uid(), ...data };
  meetings.push(newMt);
  dbSet("meetings", meetings);
  return { status: "success", data: newMt };
}

// ============================================================================
// WA / ANALYTICS
// ============================================================================
export async function fetchWaMessages() {
  await delay(150);
  return { data: dbGet("wa_messages", SEED.wa_messages) };
}

export async function sendWaMessage(contact: string, text: string) {
  await delay(100);
  const msgs = dbGet<any[]>("wa_messages", SEED.wa_messages);
  const newMsg = { id: uid(), contact, text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), direction: "out" };
  msgs.push(newMsg);
  dbSet("wa_messages", msgs);
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  return { status: "success", data: newMsg };
}

// ============================================================================
// DASHBOARD / KPI
// ============================================================================
export async function fetchDashboardData() {
  await delay(200);
  const leads = dbGet<any[]>("leads", SEED.leads);
  const projects = dbGet<any[]>("projects", SEED.projects);
  const vendors = dbGet<any[]>("vendors", SEED.vendors);
  return {
    data: {
      total_leads: leads.length,
      total_projects: projects.length,
      total_vendors: vendors.length,
      active_projects: projects.filter((p: any) => p.payment_status !== "fully_paid").length,
      revenue_data: SEED.kpi_data.revenue,
    },
  };
}

// ============================================================================
// TENANT INFO
// ============================================================================
export async function fetchTenantInfo() {
  await delay(100);
  return { data: { subscription_tier: "pro", company_name: "EventOS Demo" } };
}

// ============================================================================
// EXPORT
// ============================================================================
export function exportAsPdf(title: string, content: string) {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`
    <html><head><title>${title}</title>
    <style>body{font-family:Arial,sans-serif;padding:40px;line-height:1.6}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px;text-align:left}</style>
    </head><body>${content}</body></html>
  `);
  win.document.close();
  setTimeout(() => win.print(), 500);
}

export function generatePdfContent(title: string, items: any[], columns: string[]) {
  const rows = items.map((item) =>
    `<tr>${columns.map((col) => `<td>${item[col] ?? ""}</td>`).join("")}</tr>`
  ).join("");
  return `<h1>${title}</h1><table><thead><tr>${columns.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table>`;
}
