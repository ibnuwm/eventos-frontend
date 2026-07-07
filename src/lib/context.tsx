"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
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
  showToast: (msg: string) => void;
  toggleTask: (projectId: string, taskId: string) => void;
  toggleQuoteItem: (itemId: string) => void;
  addQuoteItem: (item: Omit<QuotationItem, "id">) => void;
  addRundownItem: (item: Omit<RundownItem, "id">) => void;
  sendMessage: (text: string, channel: string) => void;
  updateLeadStatus: (leadId: string, status: Lead["status"]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [vendors] = useState<Vendor[]>(initialVendors);
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>(initialQuotationItems);
  const [rundown, setRundown] = useState<RundownItem[]>(initialRundown);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inventory] = useState<InventoryItem[]>(initialInventory);
  const [staff] = useState<StaffCrew[]>(initialStaff);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const toggleTask = (projectId: string, taskId: string) => {
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
    showToast("🔄 Status checklist Proyek berhasil diperbarui");
  };

  const toggleQuoteItem = (itemId: string) => {
    setQuotationItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isSelected: !item.isSelected } : item
      )
    );
    showToast("💰 Kalkulasi Quotation diperbarui secara real-time");
  };

  const addQuoteItem = (item: Omit<QuotationItem, "id">) => {
    const newItem: QuotationItem = {
      ...item,
      id: `q-${Date.now()}`,
    };
    setQuotationItems((prev) => [...prev, newItem]);
    showToast("➕ Item baru ditambahkan ke Quotation");
  };

  const addRundownItem = (item: Omit<RundownItem, "id">) => {
    const newItem: RundownItem = {
      ...item,
      id: `r-${Date.now()}`,
    };
    setRundown((prev) => [...prev, newItem]);
    showToast("⏱️ Blok kegiatan baru ditambahkan ke Rundown");
  };

  const sendMessage = (text: string, channel: string) => {
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      channel,
      senderName: "Anda (Lead WO)",
      senderRole: "Lead WO",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " WIB",
    };
    setMessages((prev) => [...prev, newMsg]);
    showToast("💬 Pesan terkirim ke channel " + channel);
  };

  const updateLeadStatus = (leadId: string, status: Lead["status"]) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, status } : lead))
    );
    showToast(`📈 Pipeline Lead berhasil dipindahkan ke tahap ${status.toUpperCase()}`);
  };

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
        showToast,
        toggleTask,
        toggleQuoteItem,
        addQuoteItem,
        addRundownItem,
        sendMessage,
        updateLeadStatus,
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
