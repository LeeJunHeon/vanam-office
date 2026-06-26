"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Patent, PatentStatus } from "@/lib/mockData";

interface PatentFormModalProps {
  onClose: () => void;
  onSubmit: (patent: Patent) => void;
}

const statuses: PatentStatus[] = ["출원", "심사중", "등록", "포기"];

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200";
const labelCls = "mb-1 block text-xs font-medium text-gray-600";

export default function PatentFormModal({
  onClose,
  onSubmit,
}: PatentFormModalProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<PatentStatus>("출원");
  const [applicationNumber, setApplicationNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [applicationDate, setApplicationDate] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [country, setCountry] = useState("KR");
  const [inventors, setInventors] = useState("");
  const [relatedProduct, setRelatedProduct] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  const submit = () => {
    if (!title.trim()) return;
    const newPatent: Patent = {
      id: `PT-${Date.now()}`,
      title: title.trim(),
      applicationNumber: applicationNumber.trim(),
      registrationNumber: registrationNumber.trim() || null,
      status,
      applicationDate: applicationDate.trim(),
      registrationDate: registrationDate.trim() || null,
      country: country.trim() || "KR",
      inventors: inventors.trim(),
      relatedProduct: relatedProduct.trim(),
      docs: files.map((name) => ({ name, size: "-" })),
      photos: 0,
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
          <div className="sm:col-span-2">
            <label className={labelCls}>발명의 명칭 *</label>
            <input
              className={inputCls}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>상태</label>
            <select
              className={inputCls}
              value={status}
              onChange={(e) => setStatus(e.target.value as PatentStatus)}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>출원번호</label>
            <input
              className={inputCls}
              value={applicationNumber}
              onChange={(e) => setApplicationNumber(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>등록번호</label>
            <input
              className={inputCls}
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>출원일</label>
            <input
              className={inputCls}
              placeholder="예: 2026-01-15"
              value={applicationDate}
              onChange={(e) => setApplicationDate(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>등록일</label>
            <input
              className={inputCls}
              placeholder="예: 2026-08-30"
              value={registrationDate}
              onChange={(e) => setRegistrationDate(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>출원국</label>
            <input
              className={inputCls}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>발명자</label>
            <input
              className={inputCls}
              value={inventors}
              onChange={(e) => setInventors(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>관련 제품</label>
            <input
              className={inputCls}
              value={relatedProduct}
              onChange={(e) => setRelatedProduct(e.target.value)}
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
              {files.map((name, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-lg bg-gray-50 px-3 py-1 text-xs text-gray-700"
                >
                  {name}
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
