"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Patent } from "@/lib/types";
import type { LookupItem } from "@/lib/useLookups";
import type { AttachFile } from "@/lib/mockData";
import AttachmentField from "@/components/AttachmentField";

interface PatentFormModalProps {
  initial?: Patent;
  ipTypes: LookupItem[];
  docTypes: string[];
  onClose: () => void;
  onSubmit: (p: {
    ipTypeCode: string;
    name: string;
    number: string | null;
    manager: string | null;
    note: string | null;
  }) => void;
}

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200";
const labelCls = "mb-1 block text-xs font-medium text-gray-600";

export default function PatentFormModal({
  initial,
  ipTypes,
  docTypes,
  onClose,
  onSubmit,
}: PatentFormModalProps) {
  const [ipTypeCode, setIpTypeCode] = useState(
    initial?.ipTypeCode ?? ipTypes[0]?.code ?? ""
  );
  const [name, setName] = useState(initial?.name ?? "");
  const [number, setNumber] = useState(initial?.number ?? "");
  const [manager, setManager] = useState(initial?.manager ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  // 첨부는 로컬 표시용(저장엔 사용 안 함)
  const [docs, setDocs] = useState<AttachFile[]>([]);

  const submit = () => {
    if (!name.trim() || !ipTypeCode) return;
    onSubmit({
      ipTypeCode,
      name: name.trim(),
      number: number.trim() || null,
      manager: manager.trim() || null,
      note: note.trim() || null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {initial ? "특허 수정" : "특허 등록"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>지식재산권 종류</label>
            <select
              className={inputCls}
              value={ipTypeCode}
              onChange={(e) => setIpTypeCode(e.target.value)}
            >
              {ipTypes.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>지식재산권명 *</label>
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>등록(출원)번호</label>
            <input
              className={inputCls}
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>관리자</label>
            <input
              className={inputCls}
              value={manager}
              onChange={(e) => setManager(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>비고</label>
            <textarea
              className={inputCls}
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* 첨부 파일 (브라우저 메모리만, 저장엔 미사용) */}
        <div className="mt-4">
          <label className={labelCls}>첨부 파일</label>
          <AttachmentField
            files={docs}
            onChange={setDocs}
            docTypes={docTypes}
            editable
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200"
          >
            취소
          </button>
          <button
            onClick={submit}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-600"
          >
            {initial ? "수정" : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
}
