"use client";

import { useEffect, useState } from "react";
import { Award, Package, IdCard, TrendingUp, Coins, Clock } from "lucide-react";
import { api } from "@/lib/api";

type Page = "dashboard" | "patent" | "asset" | "hr";
type RecentItem = { type: string; name: string; sub?: string | null; date: string };
type Summary = {
  patents: number;
  assets: number;
  personalInfo: number;
  ipDist: { registered: number; applied: number; certified: number; rejected: number };
  assetDist: { general: number; research: number; totalPrice: number };
  recent: RecentItem[];
};

export default function DashboardPage({
  onNavigate,
}: {
  onNavigate: (page: Page) => void;
}) {
  const [s, setS] = useState<Summary | null>(null);

  useEffect(() => {
    fetch(api("/api/portal-summary"))
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setS(d);
      })
      .catch(() => {});
  }, []);

  const won = (n?: number) => `${(n ?? 0).toLocaleString()}원`;
  const fmtDate = (iso: string) => (iso ? iso.slice(0, 10) : "");

  const countCards = [
    { label: "지식재산권", value: s?.patents, icon: Award, iconBg: "bg-blue-50", iconFg: "text-blue-600", page: "patent" as Page },
    { label: "장비관리대장", value: s?.assets, icon: Package, iconBg: "bg-emerald-50", iconFg: "text-emerald-600", page: "asset" as Page },
    { label: "인사정보카드", value: s?.personalInfo, icon: IdCard, iconBg: "bg-violet-50", iconFg: "text-violet-600", page: "hr" as Page },
  ];

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">대시보드</h1>
        <p className="mt-0.5 text-sm text-gray-500">경영지원 현황을 한눈에 확인합니다</p>
      </div>

      {/* 상단 카운트 (클릭 시 탭 이동) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {countCards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.label}
              onClick={() => onNavigate(c.page)}
              className="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">{c.label}</p>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.iconBg}`}>
                  <Icon size={18} className={c.iconFg} />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-gray-900">
                {c.value ?? "-"}
                <span className="ml-1 text-base font-medium text-gray-400">건</span>
              </p>
            </button>
          );
        })}
      </div>

      {/* 지재권 분포 + 장비 구분 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <button
          onClick={() => onNavigate("patent")}
          className="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-600" />
            <h2 className="text-sm font-bold text-gray-900">지식재산권 종류별 분포</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "등록", value: s?.ipDist?.registered },
              { label: "출원", value: s?.ipDist?.applied },
              { label: "인증", value: s?.ipDist?.certified },
            ].map((b) => (
              <div key={b.label} className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">{b.value ?? 0}</p>
                <p className="mt-0.5 text-xs text-gray-500">{b.label}</p>
              </div>
            ))}
          </div>
          {(s?.ipDist?.rejected ?? 0) > 0 && (
            <p className="mt-2 text-[11px] text-gray-400">거절 {s?.ipDist?.rejected}건</p>
          )}
        </button>

        <button
          onClick={() => onNavigate("asset")}
          className="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-4 flex items-center gap-2">
            <Coins size={16} className="text-emerald-600" />
            <h2 className="text-sm font-bold text-gray-900">장비 구분별 현황</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {s?.assetDist?.general ?? 0}
                <span className="ml-0.5 text-sm font-medium text-gray-400">대</span>
              </p>
              <p className="mt-0.5 text-xs text-gray-500">일반 (R)</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {s?.assetDist?.research ?? 0}
                <span className="ml-0.5 text-sm font-medium text-gray-400">대</span>
              </p>
              <p className="mt-0.5 text-xs text-gray-500">연구용 (S)</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-2.5">
            <span className="text-xs font-medium text-blue-700">총 구입금액</span>
            <span className="text-sm font-bold text-blue-700">{won(s?.assetDist?.totalPrice)}</span>
          </div>
        </button>
      </div>

      {/* 최근 등록 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Clock size={16} className="text-gray-500" />
          <h2 className="text-sm font-bold text-gray-900">최근 등록</h2>
        </div>
        {!s?.recent || s.recent.length === 0 ? (
          <p className="text-xs text-gray-400">최근 등록된 항목이 없습니다</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {s.recent.map((r, i) => (
              <li key={i} className="flex items-center justify-between py-2.5">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                      r.type === "지재권"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {r.type}
                  </span>
                  <span className="truncate text-sm text-gray-800">
                    {r.name}
                    {r.sub && <span className="ml-1 text-xs text-gray-400">{r.sub}</span>}
                  </span>
                </div>
                <span className="shrink-0 text-xs text-gray-400">{fmtDate(r.date)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
