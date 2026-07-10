"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from "react";
import {
  Lead, Project, Vendor, QuotationItem, RundownItem, ChatMessage,
  InventoryItem, StaffCrew, FileAsset, Guest, WebsiteTemplate, DigitalInvitation,
  WorkflowRule, DesignBoard, BookingSlot, Transaction, GiftRegistry,
  EmailTemplate, MeetingLink, RevenueMonth, LeadFunnelStage, VendorBenchmark,
} from "@/types";
import * as svc from "@/lib/mock-service";

export type UserRole = "wo" | "vendor" | "client";

interface AppContextType {
  leads: Lead[]; projects: Project[]; vendors: Vendor[];
  quotationItems: QuotationItem[]; rundown: RundownItem[];
  messages: ChatMessage[]; inventory: InventoryItem[]; staff: StaffCrew[];
  files: FileAsset[]; approvals: any[]; waMessages: any[];
  guests: Guest[]; websites: WebsiteTemplate[]; invitations: DigitalInvitation[];
  workflows: WorkflowRule[]; designBoards: DesignBoard[]; bookingSlots: BookingSlot[];
  analyticsData: { revenue_data: RevenueMonth[]; lead_funnel: LeadFunnelStage[]; vendor_benchmarks: VendorBenchmark[]; total_revenue: number; total_profit: number; avg_margin: number } | null;
  transactions: Transaction[]; giftRegistries: GiftRegistry[];
  emailTemplates: EmailTemplate[]; meetings: MeetingLink[];
  toastMessage: string | null; loading: boolean;
  subscriptionTier: string | null; userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  showToast: (msg: string) => void;
  toggleTask: (projectId: string, taskId: string) => void;
  toggleQuoteItem: (itemId: string) => void;
  addQuoteItem: (item: Omit<QuotationItem, "id">) => void;
  deleteQuoteItem: (itemId: string) => void;
  addRundownItem: (item: Omit<RundownItem, "id">) => void;
  sendMessage: (text: string, channel: string) => void;
  updateLeadStatus: (leadId: string, status: Lead["status"]) => void;
  createLead: (data: any) => Promise<void>;
  deleteLead: (leadId: string) => Promise<void>;
  bookVendor: (vendorId: string) => void;
  lockQuotation: () => Promise<void>;
  exportPdf: (title: string, content: string) => void;
  sendWa: (contact: string, text: string) => void;
  uploadFile: (file: any) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  approveItem: (id: string) => void;
  copyLink: (id: string) => void;
  resolveConflict: (invId: string) => void;
  addGuest: (data: any) => Promise<void>;
  importGuests: (data: any[]) => Promise<void>;
  updateGuestStatus: (guestId: string, status: string) => Promise<void>;
  deleteGuest: (guestId: string) => Promise<void>;
  saveWebsite: (data: any) => Promise<void>;
  publishWebsite: (projectId: string) => Promise<void>;
  createInvitation: (data: any) => Promise<void>;
  sendInvitation: (invId: string) => Promise<void>;
  toggleWorkflow: (wfId: string) => Promise<void>;
  createWorkflow: (data: any) => Promise<void>;
  createDesignBoard: (data: any) => Promise<void>;
  toggleShareBoard: (boardId: string) => Promise<void>;
  createBookingSlot: (data: any) => Promise<void>;
  bookSlot: (slotId: string, clientName: string) => Promise<void>;
  addTransaction: (data: any) => Promise<void>;
  generatePnlReport: (projectId?: string) => Promise<any>;
  createGiftRegistry: (data: any) => Promise<void>;
  createEmailTemplate: (data: any) => Promise<void>;
  createMeeting: (data: any) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [rundown, setRundown] = useState<RundownItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [staff, setStaff] = useState<StaffCrew[]>([]);
  const [files, setFiles] = useState<FileAsset[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [waMessages, setWaMessages] = useState<any[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [websites, setWebsites] = useState<WebsiteTemplate[]>([]);
  const [invitations, setInvitations] = useState<DigitalInvitation[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([]);
  const [designBoards, setDesignBoards] = useState<DesignBoard[]>([]);
  const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>([]);
  const [analyticsData, setAnalyticsData] = useState<{ revenue_data: RevenueMonth[]; lead_funnel: LeadFunnelStage[]; vendor_benchmarks: VendorBenchmark[]; total_revenue: number; total_profit: number; avg_margin: number } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [giftRegistries, setGiftRegistries] = useState<GiftRegistry[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [meetings, setMeetings] = useState<MeetingLink[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>("wo");

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const mapLead = useCallback((i: any): Lead => ({
    id: i.id, name: i.name, whatsapp: i.whatsapp, email: i.email || "",
    eventDate: i.event_date || undefined, paxCount: Number(i.pax_count),
    budgetEstimation: Number(i.budget_estimation), status: i.status,
    notes: i.notes || undefined, createdAt: i.created_at?.split("T")[0] || "",
  }), []);

  const mapProject = useCallback((i: any): Project => ({
    id: i.id, title: i.title, clientName: i.client_name, eventDate: i.event_date,
    venueName: i.venue_name || "", contractValue: Number(i.contract_value),
    vendorCost: Number(i.vendor_cost), operationalCost: Number(i.operational_cost),
    paymentStatus: i.payment_status, daysRemaining: Number(i.days_remaining),
    progressPercentage: Number(i.progress_percentage),
    tasks: (i.tasks || []).map((t: any) => ({
      id: t.id, division: t.division, title: t.title, dueDate: t.due_date,
      isCompleted: Boolean(t.is_completed), assignedVendorName: t.assigned_vendor_name || undefined,
    })),
  }), []);

  const mapVendor = useCallback((i: any): Vendor => ({
    id: i.id, name: i.name, category: i.category, picName: i.pic_name,
    whatsapp: i.whatsapp, rating: Number(i.rating), slaPunctuality: Number(i.sla_punctuality),
    startingPrice: Number(i.starting_price), area: i.area, isBooked: i.is_booked,
  }), []);

  const mapQuote = useCallback((i: any): QuotationItem => ({
    id: i.id, category: i.category, title: i.title, vendorName: i.vendor_name,
    price: Number(i.price), isOptional: Boolean(i.is_optional), isSelected: Boolean(i.is_selected),
  }), []);

  const mapRundown = useCallback((i: any): RundownItem => ({
    id: i.id, timeSlot: i.time_slot, durationMinutes: Number(i.duration_minutes),
    activityTitle: i.activity_title, divisionPic: i.division_pic, notes: i.notes || undefined,
  }), []);

  const mapMessage = useCallback((i: any): ChatMessage => ({
    id: i.id, channel: i.channel, senderName: i.sender_name, senderRole: i.sender_role,
    text: i.text, timestamp: i.created_at ? new Date(i.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " WIB" : "",
  }), []);

  const mapInventory = useCallback((i: any): InventoryItem => ({
    id: i.id, name: i.name, category: i.category, totalStock: Number(i.total_stock),
    bookedForDate: i.booked_for_date, allocatedQty: Number(i.allocated_qty),
    conflictingProject: i.conflicting_project || undefined, hasConflict: Boolean(i.has_conflict),
  }), []);

  const mapStaff = useCallback((i: any): StaffCrew => ({
    id: i.id, name: i.name, role: i.role, assignedEventTitle: i.assigned_event_title,
    checkInTime: i.check_in_time || undefined, location: i.location, status: i.status,
  }), []);

  const mapFile = useCallback((i: any): FileAsset => ({
    id: i.id, name: i.name, folder: i.folder, size: i.size,
    uploadedBy: i.uploaded_by, uploadedAt: i.uploaded_at,
  }), []);

  const mapGuest = useCallback((i: any): Guest => ({
    id: i.id, projectId: i.project_id, name: i.name,
    whatsapp: i.whatsapp || undefined, category: i.category,
    guestCount: Number(i.guest_count), rsvpStatus: i.rsvp_status,
    menuChoice: i.menu_choice || undefined, notes: i.notes || undefined,
    tableNumber: i.table_number || undefined, token: i.token || undefined,
    createdAt: i.created_at,
  }), []);

  const mapWebsite = useCallback((i: any): WebsiteTemplate => ({
    id: i.id, projectId: i.project_id, templateStyle: i.template_style,
    coupleName: i.couple_name, eventDate: i.event_date,
    venueName: i.venue_name, venueAddress: i.venue_address,
    googleMapsLink: i.google_maps_link, coverImage: i.cover_image,
    galleryImages: i.gallery_images || [], loveStory: i.love_story,
    countdownEnabled: Boolean(i.countdown_enabled),
    rsvpEnabled: Boolean(i.rsvp_enabled),
    galleryEnabled: Boolean(i.gallery_enabled),
    streamingLink: i.streaming_link, customDomain: i.custom_domain,
    slug: i.slug, isPublished: Boolean(i.is_published),
  }), []);

  const mapWorkflow = useCallback((i: any): WorkflowRule => ({
    id: i.id, name: i.name, trigger: i.trigger, action: i.action,
    actionConfig: i.action_config || {}, isActive: Boolean(i.is_active),
    projectId: i.project_id || undefined,
  }), []);

  const mapDesignBoard = useCallback((i: any): DesignBoard => ({
    id: i.id, projectId: i.project_id, title: i.title, style: i.style,
    colorPalette: i.color_palette || [], images: i.images || [],
    notes: i.notes || undefined, isShared: Boolean(i.is_shared),
    createdAt: i.created_at,
  }), []);

  const mapBookingSlot = useCallback((i: any): BookingSlot => ({
    id: i.id, vendorId: i.vendor_id, date: i.date,
    startTime: i.start_time, endTime: i.end_time,
    clientName: i.client_name || undefined, status: i.status,
  }), []);

  const mapTransaction = useCallback((i: any): Transaction => ({
    id: i.id, projectId: i.project_id, date: i.date,
    description: i.description, category: i.category, type: i.type,
    amount: Number(i.amount), taxAmount: i.tax_amount ? Number(i.tax_amount) : undefined,
    notes: i.notes || undefined, reference: i.reference || undefined,
  }), []);

  const mapGiftRegistry = useCallback((i: any): GiftRegistry => ({
    id: i.id, projectId: i.project_id, coupleName: i.couple_name,
    type: i.type, targetAmount: Number(i.target_amount),
    collectedAmount: Number(i.collected_amount),
    isActive: Boolean(i.is_active), qrisLink: i.qris_link || undefined,
    bankAccount: i.bank_account || undefined, message: i.message || undefined,
    createdAt: i.created_at,
  }), []);

  const mapMeeting = useCallback((i: any): MeetingLink => ({
    id: i.id, projectId: i.project_id, title: i.title,
    platform: i.platform, url: i.url, date: i.date,
    startTime: i.start_time, duration: Number(i.duration),
    participants: i.participants || [], notes: i.notes || undefined,
  }), []);

  const mapInvitation = useCallback((i: any): DigitalInvitation => ({
    id: i.id, projectId: i.project_id, templateStyle: i.template_style,
    coupleName: i.couple_name, eventDate: i.event_date,
    eventTime: i.event_time, venueName: i.venue_name,
    venueAddress: i.venue_address, coverImage: i.cover_image,
    googleMapsLink: i.google_maps_link, guestNames: i.guest_names || [],
    senderName: i.sender_name, message: i.message,
    status: i.status, sentAt: i.sent_at,
  }), []);

  const mapEmailTemplate = useCallback((t: any): EmailTemplate => ({
    id: t.id, name: t.name, subject: t.subject,
    body: t.body || t.content || "",
    category: (t.category as EmailTemplate["category"]) || "custom",
  }), []);

  const mapAnalyticsData = useCallback((d: any) => ({
    revenue_data: (d.revenue_data || d.revenueData || []).map((m: any) => ({
      month: m.month, revenue: m.revenue, cost: m.cost, profit: m.profit,
    })),
    lead_funnel: (d.lead_funnel || d.leadFunnel || []).map((f: any) => ({
      stage: f.stage, count: f.count, value: f.value,
    })),
    vendor_benchmarks: (d.vendor_benchmarks || d.vendorBenchmarks || []).map((v: any) => ({
      vendorId: v.vendor_id || v.vendorId,
      name: v.name, category: v.category, rating: v.rating, sla: v.sla,
      projectCount: v.project_count || v.projectCount,
      avgContractValue: v.avg_contract_value || v.avgContractValue,
      onTimeDelivery: v.on_time_delivery || v.onTimeDelivery,
    })),
    total_revenue: d.total_revenue ?? d.totalRevenue ?? 0,
    total_profit: d.total_profit ?? d.totalProfit ?? 0,
    avg_margin: d.avg_margin ?? d.avgMargin ?? 0,
  }), []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        leadsRes, projRes, vendRes, quoteRes, rundownRes,
        msgRes, invRes, staffRes, fileRes, apprRes, waRes, tenantRes,
        guestsRes, sitesRes, invitsRes, wfRes, dbRes, bsRes,
        analyticsRes, txnRes, grRes, etRes, mtRes,
      ] = await Promise.all([
        svc.fetchLeads(), svc.fetchProjects(), svc.fetchVendors(),
        svc.fetchQuotations(), svc.fetchRundownItems(), svc.fetchMessages(),
        svc.fetchInventory(), svc.fetchStaff(), svc.fetchFiles(),
        svc.fetchApprovals(), svc.fetchWaMessages(), svc.fetchTenantInfo(),
        svc.fetchGuests(), svc.fetchWebsites(), svc.fetchInvitations(),
        svc.fetchWorkflows(), svc.fetchDesignBoards(), svc.fetchBookingSlots(),
        svc.fetchAnalyticsData(), svc.fetchTransactions(), svc.fetchGiftRegistries(),
        svc.fetchEmailTemplates(), svc.fetchMeetings(),
      ]);
      if (leadsRes?.data) setLeads(leadsRes.data.map(mapLead));
      if (projRes?.data) setProjects(projRes.data.map(mapProject));
      if (vendRes?.data) setVendors(vendRes.data.map(mapVendor));
      if (quoteRes?.items) setQuotationItems(quoteRes.items.map(mapQuote));
      if (rundownRes?.data) setRundown(rundownRes.data.map(mapRundown));
      if (msgRes?.data) setMessages(msgRes.data.map(mapMessage));
      if (invRes?.data) setInventory(invRes.data.map(mapInventory));
      if (staffRes?.data) setStaff(staffRes.data.map(mapStaff));
      if (fileRes?.data) setFiles(fileRes.data.map(mapFile));
      if (apprRes?.data) setApprovals(apprRes.data);
      if (waRes?.data) setWaMessages(waRes.data);
      if (tenantRes?.data?.subscription_tier) setSubscriptionTier(tenantRes.data.subscription_tier);
      if (guestsRes?.data) setGuests(guestsRes.data.map(mapGuest));
      if (sitesRes?.data) setWebsites(sitesRes.data.map(mapWebsite));
      if (invitsRes?.data) setInvitations(invitsRes.data.map(mapInvitation));
      if (wfRes?.data) setWorkflows(wfRes.data.map(mapWorkflow));
      if (dbRes?.data) setDesignBoards(dbRes.data.map(mapDesignBoard));
      if (bsRes?.data) setBookingSlots(bsRes.data.map(mapBookingSlot));
      if (analyticsRes?.data) setAnalyticsData(mapAnalyticsData(analyticsRes.data));
      if (txnRes?.data) setTransactions(txnRes.data.map(mapTransaction));
      if (grRes?.data) setGiftRegistries(grRes.data.map(mapGiftRegistry));
      if (etRes?.data) setEmailTemplates(etRes.data.map(mapEmailTemplate));
      if (mtRes?.data) setMeetings(mtRes.data.map(mapMeeting));
    } catch (e) {
      console.warn("Mock service error:", e);
    }
    setLoading(false);
  }, [mapLead, mapProject, mapVendor, mapQuote, mapRundown, mapMessage, mapInventory, mapStaff, mapFile, mapGuest, mapWebsite, mapInvitation, mapWorkflow, mapDesignBoard, mapBookingSlot, mapTransaction, mapGiftRegistry, mapMeeting, mapEmailTemplate, mapAnalyticsData]);

  useEffect(() => {
    svc.seedDatabase();
    refreshData();
  }, [refreshData]);

  const toggleTask = useCallback(async (projectId: string, taskId: string) => {
    const res = await svc.toggleTask(taskId);
    if (res?.data) {
      setProjects((prev) => prev.map((proj) => {
        if (proj.id !== res.data.project_id) return proj;
        const updatedTasks = proj.tasks.map((t) =>
          t.id === taskId ? { ...t, isCompleted: res.data.task.is_completed } : t
        );
        return { ...proj, tasks: updatedTasks, progressPercentage: res.data.progress_percentage };
      }));
    }
    showToast("Status checklist diperbarui");
  }, [showToast]);

  const toggleQuoteItem = useCallback(async (itemId: string) => {
    const res = await svc.toggleQuoteItem(itemId);
    if (res?.data) setQuotationItems((prev) => prev.map((item) =>
      item.id === itemId ? { ...item, isSelected: res.data.is_selected } : item
    ));
  }, []);

  const addQuoteItem = useCallback(async (item: Omit<QuotationItem, "id">) => {
    const res = await svc.addQuoteItem({
      category: item.category, title: item.title,
      vendor_name: item.vendorName, price: item.price,
      is_optional: item.isOptional, is_selected: item.isSelected,
    });
    if (res?.data) setQuotationItems((prev) => [...prev, mapQuote(res.data)]);
    showToast("Item ditambahkan ke Quotation");
  }, [showToast, mapQuote]);

  const deleteQuoteItem = useCallback(async (itemId: string) => {
    await svc.deleteQuoteItem(itemId);
    setQuotationItems((prev) => prev.filter((i) => i.id !== itemId));
    showToast("Item dihapus dari Quotation");
  }, [showToast]);

  const addRundownItem = useCallback(async (item: Omit<RundownItem, "id">) => {
    const res = await svc.addRundownItem({
      time_slot: item.timeSlot, duration_minutes: item.durationMinutes,
      activity_title: item.activityTitle, division_pic: item.divisionPic, notes: item.notes,
    });
    if (res?.data) setRundown((prev) => [...prev, mapRundown(res.data)]);
    showToast("Kegiatan ditambahkan ke Rundown");
  }, [showToast, mapRundown]);

  const sendMessage = useCallback(async (text: string, channel: string) => {
    const res = await svc.sendMessage({
      channel, sender_name: "Anda (Lead WO)", sender_role: "Lead WO", text,
    });
    if (res?.data) setMessages((prev) => [...prev, mapMessage(res.data)]);
    showToast("Pesan terkirim");
  }, [showToast, mapMessage]);

  const updateLeadStatus = useCallback(async (leadId: string, status: Lead["status"]) => {
    const res = await svc.updateLeadStatus(leadId, status);
    if (res?.data) setLeads((prev) => prev.map((l) =>
      l.id === leadId ? mapLead(res.data) : l
    ));
    showToast(`Lead dipindahkan ke ${status}`);
  }, [showToast, mapLead]);

  const createLead = useCallback(async (data: any) => {
    const res = await svc.createLead(data);
    if (res?.data) setLeads((prev) => [...prev, mapLead(res.data)]);
    showToast("Lead baru ditambahkan");
  }, [showToast, mapLead]);

  const deleteLead = useCallback(async (leadId: string) => {
    await svc.deleteLead(leadId);
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    showToast("Lead dihapus");
  }, [showToast]);

  const bookVendor = useCallback(async (vendorId: string) => {
    await svc.bookVendor(vendorId);
    setVendors((prev) => prev.map((v) => v.id === vendorId ? { ...v, isBooked: true } : v));
    showToast("Vendor berhasil dipesan");
  }, [showToast]);

  const lockQuotation = useCallback(async () => {
    await svc.lockQuotation("quote-1");
    showToast("Quotation terkunci & invoice dibuat");
  }, [showToast]);

  const exportPdf = useCallback((title: string, content: string) => {
    svc.exportAsPdf(title, content);
  }, []);

  const sendWa = useCallback(async (contact: string, text: string) => {
    const res = await svc.sendWaMessage(contact, text);
    if (res?.data) setWaMessages((prev) => [...prev, res.data]);
    showToast("Pesan WA dikirim");
  }, [showToast]);

  const uploadFile = useCallback(async (file: any) => {
    const res = await svc.uploadFile(file);
    if (res?.data) setFiles((prev) => [mapFile(res.data), ...prev]);
    showToast("File berhasil diupload");
  }, [showToast, mapFile]);

  const deleteFile = useCallback(async (fileId: string) => {
    await svc.deleteFile(fileId);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    showToast("File dihapus");
  }, [showToast]);

  const approveItem = useCallback(async (id: string) => {
    const res = await svc.approveApproval(id);
    if (res?.data) setApprovals((prev) => prev.map((a) =>
      a.id === id ? { ...a, status: res.data.status } : a
    ));
    showToast("Disetujui");
  }, [showToast]);

  const copyLink = useCallback(async (id: string) => {
    await svc.generateApprovalLink(id);
    showToast("Link disalin ke clipboard");
  }, [showToast]);

  const resolveConflict = useCallback(async (invId: string) => {
    await svc.resolveConflict(invId);
    setInventory((prev) => prev.map((i) => i.id === invId ? { ...i, hasConflict: false } : i));
    showToast("Konflik resolved");
  }, [showToast]);

  const addGuest = useCallback(async (data: any) => {
    const res = await svc.addGuest(data);
    if (res?.data) setGuests((prev) => [...prev, mapGuest(res.data)]);
    showToast("Tamu ditambahkan");
  }, [showToast, mapGuest]);

  const importGuests = useCallback(async (data: any[]) => {
    const res = await svc.importGuests(data);
    if (res?.data) setGuests((prev) => [...prev, ...res.data.map(mapGuest)]);
    showToast(`${res.data.length} tamu diimpor`);
  }, [showToast, mapGuest]);

  const updateGuestStatus = useCallback(async (guestId: string, status: string) => {
    const res = await svc.updateGuestStatus(guestId, status);
    if (res?.data) setGuests((prev) => prev.map((g) =>
      g.id === guestId ? { ...g, rsvpStatus: res.data.rsvp_status } : g
    ));
    showToast(`Status tamu: ${status}`);
  }, [showToast]);

  const deleteGuest = useCallback(async (guestId: string) => {
    await svc.deleteGuest(guestId);
    setGuests((prev) => prev.filter((g) => g.id !== guestId));
    showToast("Tamu dihapus");
  }, [showToast]);

  const saveWebsite = useCallback(async (data: any) => {
    const res = await svc.saveWebsite(data);
    if (res?.data) {
      setWebsites((prev) => {
        const idx = prev.findIndex((w) => w.projectId === data.project_id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = mapWebsite(res.data);
          return updated;
        }
        return [...prev, mapWebsite(res.data)];
      });
    }
    showToast("Website disimpan");
  }, [showToast, mapWebsite]);

  const publishWebsite = useCallback(async (projectId: string) => {
    await svc.publishWebsite(projectId);
    setWebsites((prev) => prev.map((w) =>
      w.projectId === projectId ? { ...w, isPublished: true } : w
    ));
    showToast("Website dipublikasikan!");
  }, [showToast]);

  const createInvitation = useCallback(async (data: any) => {
    const res = await svc.createInvitation(data);
    if (res?.data) setInvitations((prev) => [...prev, mapInvitation(res.data)]);
    showToast("Undangan digital dibuat");
  }, [showToast, mapInvitation]);

  const sendInvitation = useCallback(async (invId: string) => {
    await svc.sendInvitation(invId);
    setInvitations((prev) => prev.map((i) =>
      i.id === invId ? { ...i, status: "sent" as const, sentAt: new Date().toISOString().split("T")[0] } : i
    ));
    showToast("Undangan dikirim via WhatsApp");
  }, [showToast]);

  const toggleWorkflow = useCallback(async (wfId: string) => {
    const res = await svc.toggleWorkflow(wfId);
    if (res?.data) setWorkflows((prev) => prev.map((w) =>
      w.id === wfId ? { ...w, isActive: res.data.is_active } : w
    ));
    showToast("Status workflow diubah");
  }, [showToast]);

  const createWorkflow = useCallback(async (data: any) => {
    const res = await svc.createWorkflow(data);
    if (res?.data) setWorkflows((prev) => [...prev, mapWorkflow(res.data)]);
    showToast("Workflow baru dibuat");
  }, [showToast, mapWorkflow]);

  const createDesignBoard = useCallback(async (data: any) => {
    const res = await svc.createDesignBoard(data);
    if (res?.data) setDesignBoards((prev) => [...prev, mapDesignBoard(res.data)]);
    showToast("Design board dibuat");
  }, [showToast, mapDesignBoard]);

  const toggleShareBoard = useCallback(async (boardId: string) => {
    const res = await svc.toggleShareBoard(boardId);
    if (res?.data) setDesignBoards((prev) => prev.map((b) =>
      b.id === boardId ? { ...b, isShared: res.data.is_shared } : b
    ));
    showToast("Status sharing diubah");
  }, [showToast]);

  const createBookingSlot = useCallback(async (data: any) => {
    const res = await svc.createBookingSlot(data);
    if (res?.data) setBookingSlots((prev) => [...prev, mapBookingSlot(res.data)]);
    showToast("Slot jadwal dibuat");
  }, [showToast, mapBookingSlot]);

  const bookSlot = useCallback(async (slotId: string, clientName: string) => {
    const res = await svc.bookSlot(slotId, clientName);
    if (res?.data) setBookingSlots((prev) => prev.map((s) =>
      s.id === slotId ? { ...s, status: res.data.status as BookingSlot["status"], clientName: res.data.client_name } : s
    ));
    showToast("Slot berhasil dipesan");
  }, [showToast]);

  const addTransaction = useCallback(async (data: any) => {
    const res = await svc.addTransaction(data);
    if (res?.data) setTransactions((prev) => [...prev, mapTransaction(res.data)]);
    showToast("Transaksi ditambahkan");
  }, [showToast, mapTransaction]);

  const generatePnlReport = useCallback(async (projectId?: string) => {
    return await svc.generatePnlReport(projectId);
  }, []);

  const createGiftRegistry = useCallback(async (data: any) => {
    const res = await svc.createGiftRegistry(data);
    if (res?.data) setGiftRegistries((prev) => [...prev, mapGiftRegistry(res.data)]);
    showToast("Gift registry dibuat");
  }, [showToast, mapGiftRegistry]);

  const createEmailTemplate = useCallback(async (data: any) => {
    const res = await svc.createEmailTemplate(data);
    if (res?.data) setEmailTemplates((prev) => [...prev, res.data]);
    showToast("Template email dibuat");
  }, [showToast]);

  const createMeeting = useCallback(async (data: any) => {
    const res = await svc.createMeeting(data);
    if (res?.data) setMeetings((prev) => [...prev, mapMeeting(res.data)]);
    showToast("Meeting dijadwalkan");
  }, [showToast, mapMeeting]);

  const ctx = useMemo(() => ({
    leads, projects, vendors, quotationItems, rundown, messages, inventory, staff,
    files, approvals, waMessages, guests, websites, invitations,
    workflows, designBoards, bookingSlots, analyticsData,
    transactions, giftRegistries, emailTemplates, meetings,
    toastMessage, loading, subscriptionTier, userRole, setUserRole,
    showToast, toggleTask, toggleQuoteItem, addQuoteItem, deleteQuoteItem,
    addRundownItem, sendMessage, updateLeadStatus, createLead, deleteLead,
    bookVendor, lockQuotation, exportPdf, sendWa, uploadFile, deleteFile,
    approveItem, copyLink, resolveConflict,
    addGuest, importGuests, updateGuestStatus, deleteGuest,
    saveWebsite, publishWebsite, createInvitation, sendInvitation,
    toggleWorkflow, createWorkflow, createDesignBoard, toggleShareBoard,
    createBookingSlot, bookSlot,
    addTransaction, generatePnlReport, createGiftRegistry, createEmailTemplate, createMeeting,
    refreshData,
  }), [
    leads, projects, vendors, quotationItems, rundown, messages, inventory, staff,
    files, approvals, waMessages, guests, websites, invitations, workflows, designBoards, bookingSlots, analyticsData,
    transactions, giftRegistries, emailTemplates, meetings,
    toastMessage, loading, subscriptionTier, userRole,
    showToast, toggleTask, toggleQuoteItem, addQuoteItem, deleteQuoteItem,
    addRundownItem, sendMessage, updateLeadStatus, createLead, deleteLead,
    bookVendor, lockQuotation, exportPdf, sendWa, uploadFile, deleteFile,
    approveItem, copyLink, resolveConflict,
    addGuest, importGuests, updateGuestStatus, deleteGuest,
    saveWebsite, publishWebsite, createInvitation, sendInvitation,
    toggleWorkflow, createWorkflow, createDesignBoard, toggleShareBoard,
    createBookingSlot, bookSlot,
    addTransaction, generatePnlReport, createGiftRegistry, createEmailTemplate, createMeeting,
    refreshData,
  ]);

  return (
    <AppContext.Provider value={ctx}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
