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
  const { toastMessage } = useApp();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar activeModule={activeModule} onSelectModule={setActiveModule} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar activeModule={activeModule} />

        <main className="flex-1 overflow-y-auto p-6 bg-slate-950/90">
          <div className="max-w-7xl mx-auto">
            {activeModule === "dashboard" && <DashboardView onNavigate={setActiveModule} />}
            {activeModule === "monopoly" && <Stage2MonopolyView />}
            {activeModule === "roadmap" && <MarketLeaderRoadmapView />}
            {activeModule === "improvements" && <ImprovementsHubView onNavigate={setActiveModule} />}
            {activeModule === "wanative" && <WaNativeView />}
            {activeModule === "crm" && <CrmView />}
            {activeModule === "project" && <ProjectView />}
            {activeModule === "quotation" && <QuotationView />}
            {activeModule === "budget" && <BudgetView />}
            {activeModule === "rundown" && <RundownView />}
            {activeModule === "ai" && <AiView />}
            {activeModule === "marketplace" && <MarketplaceView />}
            {activeModule === "inventory" && <InventoryView />}
            {activeModule === "approval" && <ApprovalView />}
            {activeModule === "chat" && <ChatView />}
            {activeModule === "files" && <FilesView />}
            {activeModule === "staff" && <StaffView />}
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
