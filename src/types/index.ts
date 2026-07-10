export type ModuleId =
  | "dashboard"
  | "crm"
  | "project"
  | "quotation"
  | "budget"
  | "rundown"
  | "chat"
  | "files"
  | "approval"
  | "ai"
  | "marketplace"
  | "inventory"
  | "staff"
  | "wanative"
  | "improvements"
  | "roadmap"
  | "monopoly"
  | "guests"
  | "website"
  | "invitations"
  | "automation"
  | "designstudio"
  | "scheduling"
  | "analytics"
  | "accounting"
  | "giftregistry"
  | "email"
  | "videocall";

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  eventDate?: string;
  paxCount: number;
  budgetEstimation: number;
  status: "new" | "contacted" | "quotation_sent" | "negotiation" | "won" | "lost";
  notes?: string;
  createdAt: string;
}

export interface ProjectTask {
  id: string;
  division: "Photography" | "Decoration" | "Catering" | "Venue" | "Sound & MC";
  title: string;
  dueDate: string;
  isCompleted: boolean;
  assignedVendorName?: string;
}

export interface Project {
  id: string;
  title: string;
  clientName: string;
  eventDate: string;
  venueName: string;
  contractValue: number;
  vendorCost: number;
  operationalCost: number;
  paymentStatus: "booking_fee" | "dp_30" | "dp_80" | "fully_paid";
  daysRemaining: number;
  progressPercentage: number;
  tasks: ProjectTask[];
}

export interface Vendor {
  id: string;
  name: string;
  category: "Photography" | "Decoration" | "Catering" | "Sound & Lighting" | "MC & Entertainment";
  picName: string;
  whatsapp: string;
  rating: number;
  slaPunctuality: number; // e.g. 99.2%
  startingPrice: number;
  area: string;
  isBooked?: boolean;
}

export interface QuotationItem {
  id: string;
  category: string;
  title: string;
  vendorName: string;
  price: number;
  isOptional?: boolean;
  isSelected: boolean;
}

export interface RundownItem {
  id: string;
  timeSlot: string;
  durationMinutes: number;
  activityTitle: string;
  divisionPic: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  channel: string; // e.g. "#dekorasi-layout"
  senderName: string;
  senderRole: "Lead WO" | "Vendor Photo" | "Vendor Decor" | "Client";
  text: string;
  timestamp: string;
}

export interface FileAsset {
  id: string;
  name: string;
  folder: "/Contracts" | "/Invoices" | "/Moodboards" | "/CAD_Layouts" | "/Rundowns";
  size: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "Furniture" | "Lighting" | "Floral" | "Sound";
  totalStock: number;
  bookedForDate: string;
  allocatedQty: number;
  conflictingProject?: string;
  hasConflict: boolean;
}

export interface Guest {
  id: string;
  projectId: string;
  name: string;
  whatsapp?: string;
  category: "VIP" | "Keluarga" | "Umum";
  guestCount: number;
  rsvpStatus: "pending" | "confirmed" | "declined";
  menuChoice?: string;
  notes?: string;
  tableNumber?: string;
  token?: string;
  createdAt: string;
}

export interface WebsiteTemplate {
  id: string;
  projectId: string;
  templateStyle: "classic" | "modern" | "rustic" | "minimal" | "adat";
  coupleName: string;
  eventDate: string;
  venueName: string;
  venueAddress: string;
  googleMapsLink?: string;
  coverImage?: string;
  galleryImages: string[];
  loveStory?: string;
  countdownEnabled: boolean;
  rsvpEnabled: boolean;
  galleryEnabled: boolean;
  streamingLink?: string;
  customDomain?: string;
  slug: string;
  isPublished: boolean;
}

export interface DigitalInvitation {
  id: string;
  projectId: string;
  templateStyle: "classic" | "modern" | "rustic" | "minimal" | "adat";
  coupleName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  coverImage?: string;
  googleMapsLink?: string;
  guestNames: string[];
  senderName: string;
  message?: string;
  status: "draft" | "sent" | "opened";
  sentAt?: string;
}

export interface WorkflowRule {
  id: string;
  name: string;
  trigger: "lead_created" | "lead_won" | "payment_received" | "task_completed" | "date_approaching";
  action: "send_wa" | "assign_task" | "update_status" | "send_email" | "create_project";
  actionConfig: Record<string, string>;
  isActive: boolean;
  projectId?: string;
}

export interface DesignBoard {
  id: string;
  projectId: string;
  title: string;
  style: string;
  colorPalette: string[];
  images: string[];
  notes?: string;
  isShared: boolean;
  createdAt: string;
}

export interface BookingSlot {
  id: string;
  vendorId: string;
  date: string;
  startTime: string;
  endTime: string;
  clientName?: string;
  status: "available" | "booked" | "pending";
}

export interface RevenueMonth {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

export interface LeadFunnelStage {
  stage: string;
  count: number;
  value: number;
}

export interface VendorBenchmark {
  vendorId: string;
  name: string;
  category: string;
  rating: number;
  sla: number;
  projectCount: number;
  avgContractValue: number;
  onTimeDelivery: number;
}

export interface Transaction {
  id: string;
  projectId: string;
  date: string;
  description: string;
  category: "income" | "expense" | "tax" | "transfer";
  type: "client_payment" | "vendor_payment" | "operational" | "tax_ppn" | "tax_pph" | "other";
  amount: number;
  taxAmount?: number;
  notes?: string;
  reference?: string;
}

export interface GiftRegistry {
  id: string;
  projectId: string;
  coupleName: string;
  type: "cash" | "product" | "trip";
  targetAmount: number;
  collectedAmount: number;
  isActive: boolean;
  qrisLink?: string;
  bankAccount?: string;
  message?: string;
  createdAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: "reminder" | "invoice" | "followup" | "thankyou" | "custom";
}

export interface MeetingLink {
  id: string;
  projectId: string;
  title: string;
  platform: "zoom" | "meet" | "wa_video";
  url: string;
  date: string;
  startTime: string;
  duration: number;
  participants: string[];
  notes?: string;
}

export interface StaffCrew {
  id: string;
  name: string;
  role: "Lead Coordinator" | "Stage Manager" | "Usher Lead" | "Sound Technician";
  assignedEventTitle: string;
  checkInTime?: string;
  location: string;
  status: "checked_in" | "on_way" | "standby";
}
