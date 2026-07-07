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
  | "monopoly";

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

export interface StaffCrew {
  id: string;
  name: string;
  role: "Lead Coordinator" | "Stage Manager" | "Usher Lead" | "Sound Technician";
  assignedEventTitle: string;
  checkInTime?: string;
  location: string;
  status: "checked_in" | "on_way" | "standby";
}
