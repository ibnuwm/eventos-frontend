"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import {
  Lead,
  Project,
  Vendor,
  QuotationItem,
  RundownItem,
  ChatMessage,
  InventoryItem,
  StaffCrew,
} from "@/types";
import {
  initialLeads,
  initialProjects,
  initialVendors,
  initialQuotationItems,
  initialRundown,
  initialMessages,
  initialInventory,
  initialStaff,
} from "@/lib/mock-data";
import {
  fetchLeads as apiFetchLeads,
  updateLeadStatus as apiUpdateLeadStatus,
  fetchProjects as apiFetchProjects,
  toggleTask as apiToggleTask,
  fetchQuotations as apiFetchQuotations,
  toggleQuoteItem as apiToggleQuoteItem,
  addQuoteItem as apiAddQuoteItem,
  fetchRundownItems as apiFetchRundown,
  addRundownItem as apiAddRundownItem,
  fetchMessages as apiFetchMessages,
  sendMessage as apiSendMessage,
  fetchInventoryItems as apiFetchInventory,
  fetchStaffCrews as apiFetchStaff,
  fetchTenantInfo as apiFetchTenantInfo,
} from "@/lib/api";

interface AppContextType {
  leads: Lead[];
  projects: Project[];
  vendors: Vendor[];
  quotationItems: QuotationItem[];
  rundown: RundownItem[];
  messages: ChatMessage[];
  inventory: InventoryItem[];
  staff: StaffCrew[];
  toastMessage: string | null;
  loading: boolean;
  subscriptionTier: string | null;
  showToast: (msg: string) => void;
  toggleTask: (projectId: string, taskId: string) => void;
  toggleQuoteItem: (itemId: string) => void;
  addQuoteItem: (item: Omit<QuotationItem, "id">) => void;
  addRundownItem: (item: Omit<RundownItem, "id">) => void;
  sendMessage: (text: string, channel: string) => void;
  updateLeadStatus: (leadId: string, status: Lead["status"]) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function mapApiLead(item: any): Lead {
  return {
    id: item.id,
    name: item.name,
    whatsapp: item.whatsapp,
    email: item.email || "",
    eventDate: item.event_date || undefined,
    paxCount: Number(item.pax_count),
    budgetEstimation: Number(item.budget_estimation),
    status: item.status,
    notes: item.notes || undefined,
    createdAt: item.created_at?.split("T")[0] || "",
  };
}

function mapApiProject(item: any): Project {
  return {
    id: item.id,
    title: item.title,
    clientName: item.client_name,
    eventDate: item.event_date,
    venueName: item.venue_name || "",
    contractValue: Number(item.contract_value),
    vendorCost: Number(item.vendor_cost),
    operationalCost: Number(item.operational_cost),
    paymentStatus: item.payment_status,
    daysRemaining: Number(item.days_remaining),
    progressPercentage: Number(item.progress_percentage),
    tasks: (item.tasks || []).map((t: any) => ({
      id: t.id,
      division: t.division,
      title: t.title,
      dueDate: t.due_date,
      isCompleted: Boolean(t.is_completed),
      assignedVendorName: t.assigned_vendor_name || undefined,
    })),
  };
}

function mapApiQuoteItem(item: any): QuotationItem {
  return {
    id: item.id,
    category: item.category,
    title: item.title,
    vendorName: item.vendor_name,
    price: Number(item.price),
    isOptional: Boolean(item.is_optional),
    isSelected: Boolean(item.is_selected),
  };
}

function mapApiRundownItem(item: any): RundownItem {
  return {
    id: item.id,
    timeSlot: item.time_slot,
    durationMinutes: Number(item.duration_minutes),
    activityTitle: item.activity_title,
    divisionPic: item.division_pic,
    notes: item.notes || undefined,
  };
}

function mapApiMessage(item: any): ChatMessage {
  return {
    id: item.id,
    channel: item.channel,
    senderName: item.sender_name,
    senderRole: item.sender_role,
    text: item.text,
    timestamp: item.created_at
      ? new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " WIB"
      : "",
  };
}

function mapApiInventory(item: any): InventoryItem {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    totalStock: Number(item.total_stock),
    bookedForDate: item.booked_for_date,
    allocatedQty: Number(item.allocated_qty),
    conflictingProject: item.conflicting_project || undefined,
    hasConflict: Boolean(item.has_conflict),
  };
}

function mapApiStaff(item: any): StaffCrew {
  return {
    id: item.id,
    name: item.name,
    role: item.role,
    assignedEventTitle: item.assigned_event_title,
    checkInTime: item.check_in_time || undefined,
    location: item.location,
    status: item.status,
  };
}

function mapApiVendor(item: any): Vendor {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    picName: item.pic_name,
    whatsapp: item.whatsapp,
    rating: Number(item.rating),
    slaPunctuality: Number(item.sla_punctuality),
    startingPrice: Number(item.starting_price),
    area: item.area,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [rundown, setRundown] = useState<RundownItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [staff, setStaff] = useState<StaffCrew[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);

    try {
      const [leadsRes, projRes, quoteRes, rundownRes, msgRes, invRes, staffRes, tenantRes] = await Promise.all([
        apiFetchLeads(),
        apiFetchProjects(),
        apiFetchQuotations(),
        apiFetchRundown(),
        apiFetchMessages(),
        apiFetchInventory(),
        apiFetchStaff(),
        apiFetchTenantInfo(),
      ]);

      if (tenantRes?.data?.subscription_tier) {
        setSubscriptionTier(tenantRes.data.subscription_tier);
      }

      if (leadsRes?.data) setLeads(leadsRes.data.map(mapApiLead));
      else setLeads(initialLeads as Lead[]);

      if (projRes?.data) setProjects(projRes.data.map(mapApiProject));
      else setProjects(initialProjects as Project[]);

      if (quoteRes?.items) setQuotationItems(quoteRes.items.map(mapApiQuoteItem));
      else setQuotationItems(initialQuotationItems as QuotationItem[]);

      if (rundownRes?.data) setRundown(rundownRes.data.map(mapApiRundownItem));
      else setRundown(initialRundown as RundownItem[]);

      if (msgRes?.data) setMessages(msgRes.data.map(mapApiMessage));
      else setMessages(initialMessages as ChatMessage[]);

      if (invRes?.data) setInventory(invRes.data.map(mapApiInventory));
      else setInventory(initialInventory as InventoryItem[]);

      if (staffRes?.data) setStaff(staffRes.data.map(mapApiStaff));
      else setStaff(initialStaff as StaffCrew[]);

      setVendors(initialVendors as Vendor[]);
    } catch {
      setLeads(initialLeads as Lead[]);
      setProjects(initialProjects as Project[]);
      setQuotationItems(initialQuotationItems as QuotationItem[]);
      setRundown(initialRundown as RundownItem[]);
      setMessages(initialMessages as ChatMessage[]);
      setInventory(initialInventory as InventoryItem[]);
      setStaff(initialStaff as StaffCrew[]);
      setVendors(initialVendors as Vendor[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const toggleTask = useCallback(async (projectId: string, taskId: string) => {
    const res = await apiToggleTask(taskId);
    if (res?.data) {
      setProjects((prev) =>
        prev.map((proj) => {
          if (proj.id !== res.data.project_id) return proj;
          const updatedTasks = proj.tasks.map((t) =>
            t.id === taskId ? { ...t, isCompleted: res.data.task.is_completed } : t
          );
          return { ...proj, tasks: updatedTasks, progressPercentage: res.data.progress_percentage };
        })
      );
    } else {
      setProjects((prev) =>
        prev.map((proj) => {
          if (proj.id !== projectId) return proj;
          const updatedTasks = proj.tasks.map((task) =>
            task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
          );
          const completedCount = updatedTasks.filter((t) => t.isCompleted).length;
          const progressPercentage = Math.round((completedCount / updatedTasks.length) * 100);
          return { ...proj, tasks: updatedTasks, progressPercentage };
        })
      );
    }
    showToast("Status checklist Proyek berhasil diperbarui");
  }, [showToast]);

  const toggleQuoteItem = useCallback(async (itemId: string) => {
    const res = await apiToggleQuoteItem(itemId);
    if (res?.data) {
      setQuotationItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, isSelected: res.data.is_selected } : item
        )
      );
    } else {
      setQuotationItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, isSelected: !item.isSelected } : item
        )
      );
    }
    showToast("Kalkulasi Quotation diperbarui secara real-time");
  }, [showToast]);

  const addQuoteItem = useCallback(async (item: Omit<QuotationItem, "id">) => {
    const newItem: QuotationItem = { ...item, id: `q-${Date.now()}` };

    const res = await apiAddQuoteItem({
      quotation_id: "quote-1",
      category: item.category,
      title: item.title,
      vendor_name: item.vendorName,
      price: item.price,
      is_optional: item.isOptional,
      is_selected: item.isSelected,
    });

    if (res?.data) {
      setQuotationItems((prev) => [...prev, mapApiQuoteItem(res.data)]);
    } else {
      setQuotationItems((prev) => [...prev, newItem]);
    }
    showToast("Item baru ditambahkan ke Quotation");
  }, [showToast]);

  const addRundownItem = useCallback(async (item: Omit<RundownItem, "id">) => {
    const newItem: RundownItem = { ...item, id: `r-${Date.now()}` };

    const res = await apiAddRundownItem({
      project_id: "proj-1",
      time_slot: item.timeSlot,
      duration_minutes: item.durationMinutes,
      activity_title: item.activityTitle,
      division_pic: item.divisionPic,
      notes: item.notes,
    });

    if (res?.data) {
      setRundown((prev) => [...prev, mapApiRundownItem(res.data)]);
    } else {
      setRundown((prev) => [...prev, newItem]);
    }
    showToast("Blok kegiatan baru ditambahkan ke Rundown");
  }, [showToast]);

  const sendMessage = useCallback(async (text: string, channel: string) => {
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      channel,
      senderName: "Anda (Lead WO)",
      senderRole: "Lead WO",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " WIB",
    };

    const res = await apiSendMessage({
      project_id: "proj-1",
      channel,
      sender_name: "Anda (Lead WO)",
      sender_role: "Lead WO",
      text,
    });

    if (res?.data) {
      setMessages((prev) => [...prev, mapApiMessage(res.data)]);
    } else {
      setMessages((prev) => [...prev, newMsg]);
    }
    showToast("Pesan terkirim ke channel " + channel);
  }, [showToast]);

  const updateLeadStatus = useCallback(async (leadId: string, status: Lead["status"]) => {
    const res = await apiUpdateLeadStatus(leadId, status);
    if (res?.data) {
      setLeads((prev) =>
        prev.map((lead) => lead.id === leadId ? mapApiLead(res.data) : lead)
      );
    } else {
      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, status } : lead))
      );
    }
    showToast(`Pipeline Lead berhasil dipindahkan ke tahap ${status.toUpperCase()}`);
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        leads,
        projects,
        vendors,
        quotationItems,
        rundown,
        messages,
        inventory,
        staff,
        toastMessage,
        loading,
        subscriptionTier,
        showToast,
        toggleTask,
        toggleQuoteItem,
        addQuoteItem,
        addRundownItem,
        sendMessage,
        updateLeadStatus,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
