"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DashboardPage from "@/components/DashboardPage";
import PatentPage from "@/components/PatentPage";
import AssetPage from "@/components/AssetPage";
import PersonalInfoPage from "@/components/PersonalInfoPage";
import SettingsPage from "@/components/SettingsPage";
import { DEFAULT_PAGE, canAccessPage, menuLabel, type Page } from "@/lib/menus";
import {
  readPageParam,
  sendLauncherUsage,
  writePageParam,
} from "@/lib/launcher";

export default function AppShell({ canViewHr = false }: { canViewHr?: boolean }) {
  const [page, setPage] = useState<Page>(DEFAULT_PAGE);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 로드 시 열린 상태(애니메이션 없음), 모바일이면 닫기
  // ?page=<메뉴키> 딥링크: 아는 키이고 권한이 있으면 그 화면으로 연다 (사용 기록 X)
  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
    const initial = readPageParam();
    if (initial && canAccessPage(initial, { canViewHr })) setPage(initial);
    // 마운트 시 1회만 (canViewHr 는 서버 게이트에서 정해지는 고정 prop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 주소의 page 파라미터를 현재 화면과 맞춤 (replaceState)
  useEffect(() => {
    writePageParam(page);
  }, [page]);

  // 사용자 조작으로 화면을 바꾸는 유일한 경로 — 여기서만 포털에 사용 기록
  const navigate = useCallback(
    (next: Page) => {
      if (next === page) return;
      setPage(next);
      if (canAccessPage(next, { canViewHr })) sendLauncherUsage(next);
    },
    [page, canViewHr],
  );

  return (
    <div className="flex h-screen">
      <Sidebar
        currentPage={page}
        onNavigate={navigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        canViewHr={canViewHr}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={menuLabel(page)}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {page === "dashboard" && <DashboardPage onNavigate={navigate} />}
          {page === "patent" && <PatentPage />}
          {page === "asset" && <AssetPage />}
          {page === "hr" && canViewHr && <PersonalInfoPage />}
          {page === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}
