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

export default function AppShell() {
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 데스크탑 기본 열림, 모바일 닫힘 (SSR은 닫힘으로 안전 시작)
  useEffect(() => {
    if (window.innerWidth >= 1024) setSidebarOpen(true);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar
        currentPage={page}
        onNavigate={setPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
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
          {page === "hr" && <PersonalInfoPage />}
          {page === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}
