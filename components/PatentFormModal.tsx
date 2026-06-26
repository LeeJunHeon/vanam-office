"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Patent, AttachFile } from "@/lib/mockData";
import { IP_TYPES, PATENT_DOC_TYPES, type IpType } from "@/lib/lookups";
import AttachmentField from "@/components/AttachmentField";

interface PatentFormModalProps {
  initial?: Patent;
  onClose: () => void;
  onSubmit: (patent: Patent) => void;
}

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200";
const labelCls = "mb-1 block text-xs font-medium text-gray-600";

export default function PatentFormModal({
  initial,
  onClose,
  onSubmit,
}: PatentFormModalProps) {
  const [type, setType] = useState<IpType>(initial?.type ?? "출원");
  const [name, setName] = useState(initial?.name ?? "");
  const [number, setNumber] = useState(initial?.number ?? "");
  const [manager, setManager] = useState(initial?.manager ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [docs, setDocs] = useState<AttachFile[]>(initial?.docs ?? []);

  const submit = () => {
    if (!name.trim()) return;
    const patent: Patent = {
      id: initial?.id ?? `IP-${Date.now()}`,
      type,
      name: name.trim(),
      number: number.trim(),
      manager: manager.trim(),
      note: note.trim(),
      docs,
    };
    onSubmit(patent);
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
              value={type}
              onChange={(e) => setType(e.target.value as IpType)}
            >
              {IP_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
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

        {/* 첨부 파일 (브라우저 메모리만) */}
        <div className="mt-4">
          <label className={labelCls}>첨부 파일</label>
          <AttachmentField
            files={docs}
            onChange={setDocs}
            docTypes={PATENT_DOC_TYPES}
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
