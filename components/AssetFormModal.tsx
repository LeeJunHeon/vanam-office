"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { AssetTx, AssetTxType } from "@/lib/mockData";

interface AssetFormModalProps {
  onClose: () => void;
  onSubmit: (tx: AssetTx) => void;
}

const categories = ["소모품", "비품", "자산"];
const types: AssetTxType[] = ["입고", "출고", "폐기"];

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200";
const labelCls = "mb-1 block text-xs font-medium text-gray-600";

export default function AssetFormModal({
  onClose,
  onSubmit,
}: AssetFormModalProps) {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [type, setType] = useState<AssetTxType>("입고");
  const [quantity, setQuantity] = useState("");
  const [partner, setPartner] = useState("");
  const [date, setDate] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  const submit = () => {
    if (!itemName.trim()) return;
    const newTx: AssetTx = {
      id: `AT-${Date.now()}`,
      itemName: itemName.trim(),
      category,
      type,
      quantity: quantity.trim(),
      partner: partner.trim() || "-",
      date: date.trim(),
      docs: files.length,
      photos: 0,
    };
    onSubmit(newTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-gray-900">입출 등록</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls}>품목 *</label>
            <input
              className={inputCls}
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>카테고리</label>
            <select
              className={inputCls}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>구분</label>
            <select
              className={inputCls}
              value={type}
              onChange={(e) => setType(e.target.value as AssetTxType)}
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>수량</label>
            <input
              className={inputCls}
              placeholder="예: 20 L"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>거래처</label>
            <input
              className={inputCls}
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>거래일</label>
            <input
              className={inputCls}
              placeholder="예: 2026-06-20"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
