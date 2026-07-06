"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import type { Patent } from "@/lib/types";
import { useLookups } from "@/lib/useLookups";
import { badgeClass } from "@/lib/lookups";
import PatentFormModal from "@/components/PatentFormModal";
import AttachmentField from "@/components/AttachmentField";

export default function PatentPage() {
  const [patents, setPatents] = useState<Patent[]>([]);
  const [selected, setSelected] = useState<Patent | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Patent | null>(null);
  const [toast, setToast] = useState("");

  const { lookups } = useLookups();
  const ipTypes = lookups.ip_type ?? [];
  const patentDocTypes = (lookups.patent_doc_type ?? []).map((l) => l.label);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/patents");
      if (!res.ok) return;
      setPatents(await res.json());
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const labelOf = (code: string) =>
    ipTypes.find((t) => t.code === code)?.label ?? code;
  const colorOf = (code: string) =>
    ipTypes.find((t) => t.code === code)?.color;

  const TypeBadge = ({ code }: { code: string }) => (
    <span
      className={`${badgeClass(
        colorOf(code)
      )} inline-flex rounded-md px-2.5 py-0.5 text-xs font-semibold`}
    >
      {labelOf(code)}
    </span>
  );

  const visible =
    filter === "all"
      ? patents
      : patents.filter((p) => p.ipTypeCode === filter);

  const countRegistered = patents.filter((p) =>
    ["REGISTERED", "TRANSFERRED"].includes(p.ipTypeCode)
  ).length;
  const countApplied = patents.filter((p) =>
    ["APPLIED", "DIVISIONAL"].includes(p.ipTypeCode)
  ).length;
  const countCertified = patents.filter(
    (p) => p.ipTypeCode === "CERTIFIED"
  ).length;

  const openRegister = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (p: Patent) => {
    setEditing(p);
    setModalOpen(true);
  };

  const handleSubmit = async (payload: {
    ipTypeCode: string;
    name: string;
    number: string | null;
    manager: string | null;
    note: string | null;
  }) => {
    try {
      const res = editing
        ? await fetch(`/api/patents/${editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/patents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      if (!res.ok) {
        showToast("저장에 실패했습니다.");
        return;
      }
      await load();
      setModalOpen(false);
      if (editing) {
        const updated = await res.json();
        setSelected((cur) => (cur && cur.id === updated.id ? updated : cur));
      }
      showToast(editing ? "수정되었습니다." : "등록되었습니다.");
    } catch {
      showToast("저장에 실패했습니다.");
    }
  };

  const handleDelete = async (p: Patent) => {
    if (!confirm("삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/patents/${p.id}`, { method: "DELETE" });
      if (!res.ok) {
        showToast("삭제에 실패했습니다.");
        return;
      }
      await load();
      setSelected(null);
      showToast("삭제되었습니다.");
    } catch {
      showToast("삭제에 실패했습니다.");
    }
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
          initial={editing ?? undefined}
          ipTypes={ipTypes}
          docTypes={patentDocTypes}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {selected ? (
        <PatentDetail
          patent={selected}
          TypeBadge={TypeBadge}
          labelOf={labelOf}
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
            {[{ code: "all", label: "전체" }, ...ipTypes].map((f) => (
              <button
                key={f.code}
                onClick={() => setFilter(f.code)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                  filter === f.code
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {f.label}
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
                        <TypeBadge code={p.ipTypeCode} />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {p.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {p.number || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {p.manager || "-"}
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
  TypeBadge,
  labelOf,
  onBack,
  onEdit,
  onDelete,
}: {
  patent: Patent;
  TypeBadge: (props: { code: string }) => React.ReactElement;
  labelOf: (code: string) => string;
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
        <TypeBadge code={patent.ipTypeCode} />
      </div>

      {/* 기본정보 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="지식재산권 종류" value={labelOf(patent.ipTypeCode)} />
          <Field label="등록(출원)번호" value={patent.number || "-"} />
          <Field label="관리자" value={patent.manager || "-"} />
          <Field label="비고" value={patent.note || "-"} />
        </div>
      </div>

      {/* 첨부 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">관련 문서</h3>
        <AttachmentField
          files={[]}
          onChange={() => {}}
          docTypes={[]}
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
