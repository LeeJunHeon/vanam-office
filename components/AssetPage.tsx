"use client";

import { useState } from "react";
import { Plus, FileText, Image as ImageIcon } from "lucide-react";
import { assetTxs as mockAssetTxs, type AssetTx, type AssetTxType } from "@/lib/mockData";
import AssetFormModal from "@/components/AssetFormModal";

const typeBadge: Record<AssetTxType, string> = {
  입고: "bg-emerald-50 text-emerald-700",
  출고: "bg-blue-50 text-blue-700",
  폐기: "bg-gray-100 text-gray-600",
};

function TypeBadge({ type }: { type: AssetTxType }) {
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-0.5 text-xs font-semibold ${typeBadge[type]}`}
    >
      {type}
    </span>
  );
}

const metrics = [
  { label: "등록 품목", value: "128" },
  { label: "이번 달 입고", value: "17건" },
  { label: "이번 달 출고·폐기", value: "9건" },
];

const filters: ("전체" | AssetTxType)[] = ["전체", "입고", "출고", "폐기"];

export default function AssetPage() {
  const [filter, setFilter] = useState<"전체" | AssetTxType>("전체");
  const [list, setList] = useState<AssetTx[]>(mockAssetTxs);
  const [modalOpen, setModalOpen] = useState(false);

  const visible =
    filter === "전체"
      ? list
      : list.filter((t) => t.type === filter);

  return (
    <div className="space-y-5 p-4 sm:p-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            비품·자산 관리
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            회사 구매 물품·소모품 입출 내역을 관리합니다
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-600"
        >
          <Plus size={16} />
          입출 등록
        </button>
      </div>

      {modalOpen && (
        <AssetFormModal
          onClose={() => setModalOpen(false)}
          onSubmit={(t) => setList((prev) => [t, ...prev])}
        />
      )}

      {/* 메트릭 카드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-2xl border border-gray-100 bg-white p-4"
          >
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{m.value}</p>
          </div>
        ))}
      </div>

      {/* 필터칩 */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold ${
              filter === f
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["품목", "구분", "수량", "거래처", "거래일", "첨부"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {visible.map((t) => (
                <tr key={t.id} className="cursor-pointer hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {t.itemName}
                    <span className="ml-2 text-xs text-gray-400">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <TypeBadge type={t.type} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {t.quantity}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {t.partner}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{t.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex items-center gap-3 text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <FileText size={14} />
                        {t.docs}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ImageIcon size={14} />
                        {t.photos}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
