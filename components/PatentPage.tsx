"use client";

import { useState } from "react";
import { Plus, ArrowLeft, FileText, Pencil, Trash2 } from "lucide-react";
import { patents as mockPatents, type Patent } from "@/lib/mockData";
import {
  IP_TYPES,
  IP_TYPE_BADGE,
  PATENT_DOC_TYPES,
  type IpType,
} from "@/lib/lookups";
import PatentFormModal from "@/components/PatentFormModal";
import AttachmentField from "@/components/AttachmentField";

function TypeBadge({ type }: { type: IpType }) {
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-0.5 text-xs font-semibold ${IP_TYPE_BADGE[type]}`}
    >
      {type}
    </span>
  );
}

const filters: ("전체" | IpType)[] = ["전체", ...IP_TYPES];

export default function PatentPage() {
  const [filter, setFilter] = useState<"전체" | IpType>("전체");
  const [selected, setSelected] = useState<Patent | null>(null);
  const [list, setList] = useState<Patent[]>(mockPatents);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Patent | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const visible =
    filter === "전체" ? list : list.filter((p) => p.type === filter);

  const countRegistered = list.filter(
    (p) => p.type === "등록" || p.type === "등록-기술이전"
  ).length;
  const countApplied = list.filter(
    (p) => p.type === "출원" || p.type === "분할 출원"
  ).length;
  const countCertified = list.filter((p) => p.type === "인증").length;

  const handleSubmit = (p: Patent) => {
    if (editTarget) {
      setList((prev) => prev.map((x) => (x.id === p.id ? p : x)));
      setSelected((cur) => (cur && cur.id === p.id ? p : cur));
      showToast("수정되었습니다.");
    } else {
      setList((prev) => [p, ...prev]);
      showToast("등록되었습니다.");
    }
  };

  const handleDelete = (p: Patent) => {
    if (!confirm("삭제하시겠습니까?")) return;
    setList((prev) => prev.filter((x) => x.id !== p.id));
    setSelected(null);
    showToast("삭제되었습니다.");
  };

  const openRegister = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (p: Patent) => {
    setEditTarget(p);
    setModalOpen(true);
  };

  return (
    <div className="space-y-5 p-4 sm:p-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-gray-900 px-5 py-3 text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            특허관리
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            회사 지식재산권 등록·출원·인증 현황을 관리합니다
          </p>
        </div>
        <button
          onClick={openRegister}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-600"
        >
          <Plus size={16} />
          특허 등록
        </button>
      </div>

      {modalOpen && (
        <PatentFormModal
          initial={editTarget ?? undefined}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {selected ? (
        <PatentDetail
          patent={selected}
          onBack={() => setSelected(null)}
          onEdit={() => openEdit(selected)}
          onDelete={() => handleDelete(selected)}
        />
      ) : (
        <>
          {/* 요약 카드 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "등록", value: countRegistered },
              { label: "출원", value: countApplied },
              { label: "인증", value: countCertified },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-gray-100 bg-white p-4"
              >
                <p className="text-xs text-gray-500">{m.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {m.value}건
                </p>
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
                    {[
                      "순번",
                      "지식재산권 종류",
                      "지식재산권명",
                      "등록(출원)번호",
                      "관리자",
                      "첨부",
                      "비고",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {visible.map((p, i) => (
                    <tr
                      key={p.id}
                      onClick={() => setSelected(p)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <TypeBadge type={p.type} />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {p.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {p.number}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {p.manager}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <FileText size={14} />
                          {p.docs.length}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {p.note || "-"}
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
  onEdit,
  onDelete,
}: {
  patent: Patent;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200"
        >
          <ArrowLeft size={16} />
          목록으로
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            <Pencil size={15} />
            수정
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-100"
          >
            <Trash2 size={15} />
            삭제
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-gray-900">{patent.name}</h2>
        <TypeBadge type={patent.type} />
      </div>

      {/* 기본정보 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="지식재산권 종류" value={patent.type} />
          <Field label="등록(출원)번호" value={patent.number} />
          <Field label="관리자" value={patent.manager} />
          <Field label="비고" value={patent.note || "-"} />
        </div>
      </div>

      {/* 첨부 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          관련 문서 ({patent.docs.length})
        </h3>
        <AttachmentField
          files={patent.docs}
          onChange={() => {}}
          docTypes={PATENT_DOC_TYPES}
          editable={false}
        />
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
