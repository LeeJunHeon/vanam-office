"use client";

import { useEffect, useState } from "react";
import { Award, Package, IdCard } from "lucide-react";
import { api } from "@/lib/api";

type Summary = { patents: number; assets: number; personalInfo: number };

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetch(api("/api/portal-summary"))
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setSummary(d);
      })
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: "지식재산권",
      value: summary?.patents,
      icon: Award,
      iconBg: "bg-blue-50",
      iconFg: "text-blue-600",
    },
    {
      label: "장비관리대장",
      value: summary?.assets,
      icon: Package,
      iconBg: "bg-emerald-50",
      iconFg: "text-emerald-600",
    },
    {
      label: "인사정보카드",
      value: summary?.personalInfo,
      icon: IdCard,
      iconBg: "bg-violet-50",
      iconFg: "text-violet-600",
    },
  ];

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">대시보드</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          경영지원 현황을 한눈에 확인합니다
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">{c.label}</p>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.iconBg}`}
                >
                  <Icon size={18} className={c.iconFg} />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-gray-900">
                {c.value ?? "-"}
                <span className="ml-1 text-base font-medium text-gray-400">
                  건
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
