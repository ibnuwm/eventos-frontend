import {
  Lead,
  Project,
  Vendor,
  QuotationItem,
  RundownItem,
  ChatMessage,
  FileAsset,
  InventoryItem,
  StaffCrew,
} from "@/types";

export const initialLeads: Lead[] = [
  {
    id: "lead-1",
    name: "Chikita Meidy & Reza",
    whatsapp: "0812-8899-1234",
    email: "chikita@gmail.com",
    eventDate: "2026-10-12",
    paxCount: 800,
    budgetEstimation: 180000000,
    status: "new",
    notes: "Adat Minang modern, request pelaminan marun emas.",
    createdAt: "2026-07-07",
  },
  {
    id: "lead-2",
    name: "PT Maju Jaya Group (Gala Dinner)",
    whatsapp: "0811-2233-4455",
    email: "hrd@majujaya.co.id",
    eventDate: "2026-08-28",
    paxCount: 350,
    budgetEstimation: 95000000,
    status: "quotation_sent",
    notes: "Ballroom Hotel Bintang 5, live band jazz, stage LED P3.",
    createdAt: "2026-07-05",
  },
  {
    id: "lead-3",
    name: "Raditya Dika & Anissa",
    whatsapp: "0813-9988-7766",
    email: "raditya@event.id",
    eventDate: "2026-11-20",
    paxCount: 500,
    budgetEstimation: 150000000,
    status: "negotiation",
    notes: "Intimate concept outdoor garden, photobooth 360.",
    createdAt: "2026-07-02",
  },
];

export const initialProjects: Project[] = [
  {
    id: "proj-1",
    title: "Royal Wedding Anisa & Budi",
    clientName: "Anisa Rahma & Budi Santoso",
    eventDate: "2026-08-14",
    venueName: "Grand Hotel Ballroom Jakarta",
    contractValue: 180000000,
    vendorCost: 110000000,
    operationalCost: 18000000,
    paymentStatus: "dp_80",
    daysRemaining: 38,
    progressPercentage: 75,
    tasks: [
      { id: "t-1", division: "Photography", title: "Pre-Wedding Concept & Execution di Bali", dueDate: "2026-05-10", isCompleted: true, assignedVendorName: "Lumiere Photography" },
      { id: "t-2", division: "Decoration", title: "Final Approval Sketsa 3D Pelaminan 15m", dueDate: "2026-06-15", isCompleted: true, assignedVendorName: "Grand Rose Decor" },
      { id: "t-3", division: "Catering", title: "Food Testing Bersama Keluarga VIP (10 Pax)", dueDate: "2026-06-25", isCompleted: true, assignedVendorName: "Gourmet Catering" },
      { id: "t-4", division: "Sound & MC", title: "Technical Meeting & Penentuan Daftar Lagu Request", dueDate: "2026-07-20", isCompleted: false, assignedVendorName: "ProSound Entertainment" },
      { id: "t-5", division: "Photography", title: "Briefing Tim D-Day & Cek Backup Memory Cards", dueDate: "2026-08-07", isCompleted: false, assignedVendorName: "Lumiere Photography" },
    ],
  },
  {
    id: "proj-2",
    title: "Intimate Garden Wedding Clara & Dave",
    clientName: "Clara Gopa & Dave Putra",
    eventDate: "2026-11-10",
    venueName: "Pine Hill Bandung",
    contractValue: 135000000,
    vendorCost: 85000000,
    operationalCost: 12000000,
    paymentStatus: "dp_30",
    daysRemaining: 126,
    progressPercentage: 30,
    tasks: [
      { id: "t-6", division: "Venue", title: "Pembayaran Booking Fee Venue Pine Hill", dueDate: "2026-06-01", isCompleted: true },
      { id: "t-7", division: "Decoration", title: "Penyusunan Moodboard Rustic Botanical", dueDate: "2026-07-15", isCompleted: false },
    ],
  },
];

export const initialVendors: Vendor[] = [
  {
    id: "v-1",
    name: "Lumiere Photography Indonesia",
    category: "Photography",
    picName: "Mas Rio",
    whatsapp: "0812-1111-2222",
    rating: 4.9,
    slaPunctuality: 99.2,
    startingPrice: 18000000,
    area: "Jabodetabek & Bali",
  },
  {
    id: "v-2",
    name: "Grand Rose Decoration",
    category: "Decoration",
    picName: "Mba Siska",
    whatsapp: "0812-3333-4444",
    rating: 4.8,
    slaPunctuality: 97.5,
    startingPrice: 40000000,
    area: "Jabodetabek & Bandung",
  },
  {
    id: "v-3",
    name: "ProSound Audio & LED Screen",
    category: "Sound & Lighting",
    picName: "Pak Anton",
    whatsapp: "0812-5555-6666",
    rating: 4.7,
    slaPunctuality: 98.0,
    startingPrice: 12000000,
    area: "Seluruh Jawa",
  },
  {
    id: "v-4",
    name: "Chef Gourmet Catering Service",
    category: "Catering",
    picName: "Ibu Indah",
    whatsapp: "0812-7777-8888",
    rating: 4.9,
    slaPunctuality: 100.0,
    startingPrice: 85000,
    area: "Jakarta & Sekitarnya",
  },
];

export const initialQuotationItems: QuotationItem[] = [
  { id: "q-1", category: "Venue & Catering", title: "Ballroom Bintang 5 & Buffet 800 Pax", vendorName: "Grand Hotel & Chef Gourmet", price: 95000000, isSelected: true },
  { id: "q-2", category: "Decoration", title: "Dekorasi Pelaminan Custom 15m & Lorong Masuk", vendorName: "Grand Rose Decor", price: 40000000, isSelected: true },
  { id: "q-3", category: "Documentation", title: "Paket Foto & Video Sinematik (3 Cam + Drone)", vendorName: "Lumiere Photography", price: 18000000, isSelected: true },
  { id: "q-4", category: "Entertainment", title: "MC Profesional & Acoustic Jazz Band", vendorName: "ProSound Entertainment", price: 12000000, isSelected: true },
  { id: "q-5", category: "Add-On", title: "Upgrade Multimedia LED Screen P3 3x4 Meter", vendorName: "ProVisual Indonesia", price: 15000000, isOptional: true, isSelected: false },
];

export const initialRundown: RundownItem[] = [
  { id: "r-1", timeSlot: "05.00 - 07.30", durationMinutes: 150, activityTitle: "Persiapan Makeup & Hairdo Pengantin Wanita & Pria", divisionPic: "Divisi MUA & Usher Lead" },
  { id: "r-2", timeSlot: "07.30 - 08.30", durationMinutes: 60, activityTitle: "Sesi Foto Morning Preparation & First Look Pengantin", divisionPic: "Lumiere Photography Team" },
  { id: "r-3", timeSlot: "08.30 - 09.30", durationMinutes: 60, activityTitle: "Pengondisian Tamu VIP Akad Nikah & Cek Mikrofon Penghulu", divisionPic: "ProSound & Usher Lead" },
  { id: "r-4", timeSlot: "09.30 - 11.00", durationMinutes: 90, activityTitle: "Prosesi Akad Nikah, Ijab Kabul, & Sungkeman Keluarga", divisionPic: "MC Penghulu & Video Cam" },
  { id: "r-5", timeSlot: "11.30 - 14.30", durationMinutes: 180, activityTitle: "Grand Entrance Resepsi, First Dance, & Makan Siang Bersama", divisionPic: "Acoustic Band & Catering" },
];

export const initialMessages: ChatMessage[] = [
  { id: "m-1", channel: "#dekorasi-layout", senderName: "Mba Rina", senderRole: "Lead WO", text: "Halo tim Grand Rose, untuk penempatan standing flower di lorong pintu utama mohon digeser 50cm ke kanan agar jalur kursi roda aman ya.", timestamp: "10.15 WIB" },
  { id: "m-2", channel: "#dekorasi-layout", senderName: "Mba Siska", senderRole: "Vendor Decor", text: "Siap Mba Rina! Sudah dicatat di sketsa revisi v3. Besok saat loading jam 04.00 pagi tim langsung sesuaikan.", timestamp: "10.18 WIB" },
  { id: "m-3", channel: "#foto-video", senderName: "Mas Rio", senderRole: "Vendor Photo", text: "Mohon konfirmasi saat Akad apakah lighting panggung bisa diredupkan sedikit jadi 4000K agar skin tone pengantin natural?", timestamp: "11.05 WIB" },
];

export const initialInventory: InventoryItem[] = [
  { id: "inv-1", name: "Kursi Tiffany Emas Premium", category: "Furniture", totalStock: 500, bookedForDate: "2026-08-14", allocatedQty: 550, conflictingProject: "Royal Wedding vs Gala Dinner PT Maju Jaya", hasConflict: true },
  { id: "inv-2", name: "Lampu Par LED 54W RGBW", category: "Lighting", totalStock: 40, bookedForDate: "2026-08-14", allocatedQty: 32, hasConflict: false },
  { id: "inv-3", name: "Standing Flower Acrylic 1.5m", category: "Floral", totalStock: 24, bookedForDate: "2026-08-14", allocatedQty: 20, hasConflict: false },
];

export const initialStaff: StaffCrew[] = [
  { id: "st-1", name: "Dimas Anggara", role: "Stage Manager", assignedEventTitle: "Royal Wedding Anisa & Budi", checkInTime: "04.15 WIB (On Time)", location: "Grand Hotel Ballroom", status: "checked_in" },
  { id: "st-2", name: "Sinta Maharani", role: "Usher Lead", assignedEventTitle: "Royal Wedding Anisa & Budi", checkInTime: "05.00 WIB (On Time)", location: "Grand Hotel Lobby", status: "checked_in" },
  { id: "st-3", name: "Bagus Putra", role: "Sound Technician", assignedEventTitle: "Royal Wedding Anisa & Budi", location: "Grand Hotel Loading Dock", status: "on_way" },
];
