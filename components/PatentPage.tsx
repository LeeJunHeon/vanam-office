"use client";

import { useState } from "react";
import {
  Plus,
  ArrowLeft,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { patents as mockPatents, type Patent, type PatentStatus } from "@/lib/mockData";
import PatentFormModal from "@/components/PatentFormModal";

const statusBadge: Record<PatentStatus, string> = {
  등록: "bg-emerald-50 text-emerald-700",
  심사중: "bg-amber-50 text-amber-700",
  출원: "bg-blue-50 text-blue-700",
  포기: "bg-gray-100 text-gray-600",
};

function StatusBadge({ status }: { status: PatentStatus }) {
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-0.5 text-xs font-semibold ${statusBadge[status]}`}
    >
      {status}
    </span>
  );
}

const filters: ("전체" | PatentStatus)[] = [
  "전체",
  "출원",
  "심사중",
  "등록",
  "포기",
];

export default function PatentPage() {
  const [filter, setFilter] = useState<"전체" | PatentStatus>("전체");
  const [selected, setSelected] = useState<Patent | null>(null);
  const [list, setList] = useState<Patent[]>(mockPatents);
  const [modalOpen, setModalOpen] = useState(false);

  const visible =
    filter === "전체"
      ? list
      : list.filter((p) => p.status === filter);

  return (
    <div className="space-y-5 p-4 sm:p-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            특허관리
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            회사 보유 특허 출원·등록 현황을 관리합니다
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-600"
        >
          <Plus size={16} />
          특허 등록
        </button>
      </div>

      {modalOpen && (
        <PatentFormModal
          onClose={() => setModalOpen(false)}
          onSubmit={(p) => setList((prev) => [p, ...prev])}
        />
      )}

      {selected ? (
        <PatentDetail patent={selected} onBack={() => setSelected(null)} />
      ) : (
        <>
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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      발명의 명칭
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      상태
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      출원번호
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      첨부
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {visible.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setSelected(p)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {p.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {p.applicationNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex items-center gap-3 text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <FileText size={14} />
                            {p.docs.length}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <ImageIcon size={14} />
                            {p.photos}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PatentDetail({
  patent,
  onBack,
}: {
  patent: Patent;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200"
      >
        <ArrowLeft size={16} />
        목록으로
      </button>

      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-gray-900">{patent.title}</h2>
        <StatusBadge status={patent.status} />
      </div>

      {/* 기본정보 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="출원번호" value={patent.applicationNumber} />
          <Field
            label="등록번호"
            value={patent.registrationNumber ?? "-"}
          />
          <Field label="출원일" value={patent.applicationDate} />
          <Field
            label="등록일"
            value={patent.registrationDate ?? "-"}
          />
          <Field
            label="출원국·발명자"
            value={`${patent.country} · ${patent.inventors}`}
          />
          <Field label="관련 제품" value={patent.relatedProduct} />
        </div>
      </div>

      {/* 첨부 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">관련 문서</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {patent.docs.map((d) => (
            <span
              key={d.name}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700"
            >
              <FileText size={14} className="text-gray-400" />
              {d.name}
              <span className="text-gray-400">{d.size}</span>
            </span>
          ))}
          <button className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs text-gray-400 hover:border-gray-400 hover:text-gray-500">
            <Plus size={14} />
            문서 추가 · PDF·이미지
          </button>
        </div>

        <h3 className="mt-6 text-sm font-semibold text-gray-900">도면·사진</h3>
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {Array.from({ length: patent.photos }).map((_, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-xl bg-gray-100"
            >
              <ImageIcon size={20} className="text-gray-400" />
            </div>
          ))}
          <button className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500">
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm text-gray-900">{value}</p>
    </div>
  );
}
