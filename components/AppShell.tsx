"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import DashboardPage from "@/components/DashboardPage";
import PatentPage from "@/components/PatentPage";
import AssetPage from "@/components/AssetPage";
import PersonalInfoPage from "@/components/PersonalInfoPage";

type Page = "dashboard" | "patent" | "asset" | "hr";

const pageTitle: Record<Page, string> = {
  dashboard: "대시보드",
  patent: "지식재산권",
  asset: "장비관리대장",
  hr: "인사정보카드",
};

export default function AppShell() {
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar
        currentPage={page}
        onNavigate={setPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        {/* 모바일 상단바 */}
        <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
            aria-label="메뉴 열기"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-bold text-gray-900">
            {pageTitle[page]}
          </span>
        </div>

        {page === "dashboard" && <DashboardPage />}
        {page === "patent" && <PatentPage />}
        {page === "asset" && <AssetPage />}
        {page === "hr" && <PersonalInfoPage />}
      </main>
    </div>
  );
}
