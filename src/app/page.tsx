"use client";

import React, { useState } from "react";
import { ModuleId } from "@/types";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useApp } from "@/lib/context";

// Module Views
import { DashboardView } from "@/components/modules/DashboardView";
import { Stage2MonopolyView } from "@/components/modules/Stage2MonopolyView";
import { MarketLeaderRoadmapView } from "@/components/modules/MarketLeaderRoadmapView";
import { ImprovementsHubView } from "@/components/modules/ImprovementsHubView";
import { WaNativeView } from "@/components/modules/WaNativeView";
import { CrmView } from "@/components/modules/CrmView";
import { ProjectView } from "@/components/modules/ProjectView";
import { QuotationView } from "@/components/modules/QuotationView";
import { BudgetView } from "@/components/modules/BudgetView";
import { RundownView } from "@/components/modules/RundownView";
import { AiView } from "@/components/modules/AiView";
import { MarketplaceView } from "@/components/modules/MarketplaceView";
import { InventoryView } from "@/components/modules/InventoryView";
import { ApprovalView } from "@/components/modules/ApprovalView";
import { ChatView } from "@/components/modules/ChatView";
import { FilesView } from "@/components/modules/FilesView";
import { StaffView } from "@/components/modules/StaffView";

export default function Home() {
  const [activeModule, setActiveModule] = useState<ModuleId>("dashboard");
  const { toastMessage, loading } = useApp();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar activeModule={activeModule} onSelectModule={setActiveModule} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar activeModule={activeModule} />

        <main className="flex-1 overflow-y-auto p-6 bg-slate-950/90">
          <div className="max-w-7xl mx-auto">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  Memuat data dari server...
                </div>
              </div>
            )}
            {!loading && activeModule === "dashboard" && <DashboardView onNavigate={setActiveModule} />}
            {!loading && activeModule === "monopoly" && <Stage2MonopolyView />}
            {!loading && activeModule === "roadmap" && <MarketLeaderRoadmapView />}
            {!loading && activeModule === "improvements" && <ImprovementsHubView onNavigate={setActiveModule} />}
            {!loading && activeModule === "wanative" && <WaNativeView />}
            {!loading && activeModule === "crm" && <CrmView />}
            {!loading && activeModule === "project" && <ProjectView />}
            {!loading && activeModule === "quotation" && <QuotationView />}
            {!loading && activeModule === "budget" && <BudgetView />}
            {!loading && activeModule === "rundown" && <RundownView />}
            {!loading && activeModule === "ai" && <AiView />}
            {!loading && activeModule === "marketplace" && <MarketplaceView />}
            {!loading && activeModule === "inventory" && <InventoryView />}
            {!loading && activeModule === "approval" && <ApprovalView />}
            {!loading && activeModule === "chat" && <ChatView />}
            {!loading && activeModule === "files" && <FilesView />}
            {!loading && activeModule === "staff" && <StaffView />}
          </div>
        </main>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-slate-900 border-l-4 border-indigo-500 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold max-w-md">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
