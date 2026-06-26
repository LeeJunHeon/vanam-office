"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Patent } from "@/lib/mockData";
import { IP_TYPES, type IpType } from "@/lib/lookups";

interface PatentFormModalProps {
  onClose: () => void;
  onSubmit: (patent: Patent) => void;
}

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200";
const labelCls = "mb-1 block text-xs font-medium text-gray-600";

export default function PatentFormModal({
  onClose,
  onSubmit,
}: PatentFormModalProps) {
  const [type, setType] = useState<IpType>("출원");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [manager, setManager] = useState("");
  const [note, setNote] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  const submit = () => {
    if (!name.trim()) return;
    const newPatent: Patent = {
      id: `IP-${Date.now()}`,
      type,
      name: name.trim(),
      number: number.trim(),
      manager: manager.trim(),
      note: note.trim(),
      docs: files,
    };
    onSubmit(newPatent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-gray-900">특허 등록</h2>
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

        {/* 첨부 파일 (데모: 저장 안 함) */}
        <div className="mt-4">
          <label className={labelCls}>첨부 파일</label>
          <input
            type="file"
            multiple
            onChange={(e) =>
              setFiles(Array.from(e.target.files ?? []).map((f) => f.name))
            }
            className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
          />
          {files.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {files.map((fname, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-lg bg-gray-50 px-3 py-1 text-xs text-gray-700"
                >
                  {fname}
                </span>
              ))}
            </div>
          )}
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
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
