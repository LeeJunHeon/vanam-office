"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PatentPage from "@/components/PatentPage";
import AssetPage from "@/components/AssetPage";
import HrPage from "@/components/HrPage";

type Page = "patent" | "asset" | "hr";

const pageTitle: Record<Page, string> = {
  patent: "특허관리",
  asset: "비품·자산 관리",
  hr: "인사관리",
};

export default function Home() {
  const [page, setPage] = useState<Page>("patent");
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

        {page === "patent" && <PatentPage />}
        {page === "asset" && <AssetPage />}
        {page === "hr" && <HrPage />}
      </main>
    </div>
  );
}
