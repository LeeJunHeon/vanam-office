"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DashboardPage from "@/components/DashboardPage";
import PatentPage from "@/components/PatentPage";
import AssetPage from "@/components/AssetPage";
import PersonalInfoPage from "@/components/PersonalInfoPage";
import SettingsPage from "@/components/SettingsPage";

type Page = "dashboard" | "patent" | "asset" | "hr" | "settings";

const pageTitle: Record<Page, string> = {
  dashboard: "대시보드",
  patent: "지식재산권",
  asset: "장비관리대장",
  hr: "인사정보카드",
  settings: "설정",
};

export default function AppShell({ canViewHr = false }: { canViewHr?: boolean }) {
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 로드 시 열린 상태(애니메이션 없음), 모바일이면 닫기
  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar
        currentPage={page}
        onNavigate={setPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        canViewHr={canViewHr}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={pageTitle[page]}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {page === "dashboard" && <DashboardPage onNavigate={setPage} />}
          {page === "patent" && <PatentPage />}
          {page === "asset" && <AssetPage />}
          {page === "hr" && canViewHr && <PersonalInfoPage />}
          {page === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}
