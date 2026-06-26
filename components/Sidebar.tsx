"use client";

import {
  Award,
  Package,
  IdCard,
  ExternalLink,
  Briefcase,
  LogOut,
} from "lucide-react";

type Page = "patent" | "asset" | "hr";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems: {
  key: Page;
  label: string;
  icon: typeof Award;
  external?: boolean;
}[] = [
  { key: "patent", label: "특허관리", icon: Award },
  { key: "asset", label: "비품·자산 관리", icon: Package },
  { key: "hr", label: "인사관리", icon: IdCard, external: true },
];

export default function Sidebar({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-100 bg-white transition-transform lg:static lg:translate-x-0`}
      >
        {/* 로고 */}
        <div className="border-b border-gray-100 px-5 py-5">
          <a
            href="https://vanam.synology.me"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
              <Briefcase size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">경영지원</h1>
              <p className="text-[11px] text-gray-400">Management Support</p>
            </div>
          </a>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item.key);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                  active
                    ? "bg-blue-50 font-semibold text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={18} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.external && (
                  <ExternalLink size={13} className="text-gray-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* 사용자 블록 */}
        <div className="border-t border-gray-100 px-3 py-4">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
              이
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">이준헌</p>
              <p className="text-[11px] text-gray-400">관리자</p>
            </div>
            <LogOut size={16} className="text-gray-400" />
          </div>
        </div>
      </aside>
    </>
  );
}
