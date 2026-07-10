"use client";

import React, { useState, Suspense, lazy } from "react";
import { ModuleId } from "@/types";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { BottomNav } from "@/components/shared/bottom-nav";
import { OnboardingTour } from "@/components/shared/onboarding-tour";
import { useApp } from "@/lib/context";
import { SkeletonDashboard } from "@/components/shared/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const DashboardView = lazy(() => import("@/components/modules/DashboardView").then(m => ({ default: m.DashboardView })));
const Stage2MonopolyView = lazy(() => import("@/components/modules/Stage2MonopolyView").then(m => ({ default: m.Stage2MonopolyView })));
const MarketLeaderRoadmapView = lazy(() => import("@/components/modules/MarketLeaderRoadmapView").then(m => ({ default: m.MarketLeaderRoadmapView })));
const ImprovementsHubView = lazy(() => import("@/components/modules/ImprovementsHubView").then(m => ({ default: m.ImprovementsHubView })));
const WaNativeView = lazy(() => import("@/components/modules/WaNativeView").then(m => ({ default: m.WaNativeView })));
const CrmView = lazy(() => import("@/components/modules/CrmView").then(m => ({ default: m.CrmView })));
const ProjectView = lazy(() => import("@/components/modules/ProjectView").then(m => ({ default: m.ProjectView })));
const QuotationView = lazy(() => import("@/components/modules/QuotationView").then(m => ({ default: m.QuotationView })));
const BudgetView = lazy(() => import("@/components/modules/BudgetView").then(m => ({ default: m.BudgetView })));
const RundownView = lazy(() => import("@/components/modules/RundownView").then(m => ({ default: m.RundownView })));
const AiView = lazy(() => import("@/components/modules/AiView").then(m => ({ default: m.AiView })));
const MarketplaceView = lazy(() => import("@/components/modules/MarketplaceView").then(m => ({ default: m.MarketplaceView })));
const InventoryView = lazy(() => import("@/components/modules/InventoryView").then(m => ({ default: m.InventoryView })));
const ApprovalView = lazy(() => import("@/components/modules/ApprovalView").then(m => ({ default: m.ApprovalView })));
const ChatView = lazy(() => import("@/components/modules/ChatView").then(m => ({ default: m.ChatView })));
const FilesView = lazy(() => import("@/components/modules/FilesView").then(m => ({ default: m.FilesView })));
const StaffView = lazy(() => import("@/components/modules/StaffView").then(m => ({ default: m.StaffView })));
const GuestView = lazy(() => import("@/components/modules/GuestView").then(m => ({ default: m.GuestView })));
const WebsiteView = lazy(() => import("@/components/modules/WebsiteView").then(m => ({ default: m.WebsiteView })));
const InvitationsView = lazy(() => import("@/components/modules/InvitationsView").then(m => ({ default: m.InvitationsView })));
const WorkflowView = lazy(() => import("@/components/modules/WorkflowView").then(m => ({ default: m.WorkflowView })));
const DesignStudioView = lazy(() => import("@/components/modules/DesignStudioView").then(m => ({ default: m.DesignStudioView })));
const SchedulingView = lazy(() => import("@/components/modules/SchedulingView").then(m => ({ default: m.SchedulingView })));
const AnalyticsView = lazy(() => import("@/components/modules/AnalyticsView").then(m => ({ default: m.AnalyticsView })));
const AccountingView = lazy(() => import("@/components/modules/AccountingView").then(m => ({ default: m.AccountingView })));
const GiftRegistryView = lazy(() => import("@/components/modules/GiftRegistryView").then(m => ({ default: m.GiftRegistryView })));
const EmailView = lazy(() => import("@/components/modules/EmailView").then(m => ({ default: m.EmailView })));
const VideoCallView = lazy(() => import("@/components/modules/VideoCallView").then(m => ({ default: m.VideoCallView })));

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeIn" as const } },
};

function ModuleFallback() {
  return <SkeletonDashboard />;
}

export default function Home() {
  const [activeModule, setActiveModule] = useState<ModuleId>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { toastMessage, loading } = useApp();

  const renderModule = () => {
    const mod = (
      <Suspense fallback={<ModuleFallback />}>
        {(() => {
          switch (activeModule) {
            case "dashboard": return <DashboardView onNavigate={setActiveModule} />;
            case "monopoly": return <Stage2MonopolyView />;
            case "roadmap": return <MarketLeaderRoadmapView />;
            case "improvements": return <ImprovementsHubView onNavigate={setActiveModule} />;
            case "wanative": return <WaNativeView />;
            case "crm": return <CrmView />;
            case "project": return <ProjectView />;
            case "quotation": return <QuotationView />;
            case "budget": return <BudgetView />;
            case "rundown": return <RundownView />;
            case "ai": return <AiView />;
            case "marketplace": return <MarketplaceView />;
            case "inventory": return <InventoryView />;
            case "approval": return <ApprovalView />;
            case "chat": return <ChatView />;
            case "files": return <FilesView />;
            case "staff": return <StaffView />;
            case "guests": return <GuestView />;
            case "website": return <WebsiteView />;
            case "invitations": return <InvitationsView />;
            case "automation": return <WorkflowView />;
            case "designstudio": return <DesignStudioView />;
            case "scheduling": return <SchedulingView />;
            case "analytics": return <AnalyticsView />;
            case "accounting": return <AccountingView />;
            case "giftregistry": return <GiftRegistryView />;
            case "email": return <EmailView />;
            case "videocall": return <VideoCallView />;
            default: return <DashboardView onNavigate={setActiveModule} />;
          }
        })()}
      </Suspense>
    );
    return mod;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          activeModule={activeModule}
          onNavigate={setActiveModule}
          onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-background scrollbar-thin">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <SkeletonDashboard />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {renderModule()}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>

      <BottomNav
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        onOpenSidebar={() => setMobileSidebarOpen(true)}
      />

      <OnboardingTour />

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 bg-card border border-border/60 shadow-2xl shadow-black/20 text-foreground px-5 py-3.5 rounded-2xl flex items-center gap-3 text-sm font-semibold max-w-sm backdrop-blur-xl"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
