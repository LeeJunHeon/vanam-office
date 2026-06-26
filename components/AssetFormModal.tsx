"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Asset } from "@/lib/mockData";

interface AssetFormModalProps {
  onClose: () => void;
  onSubmit: (asset: Asset) => void;
}

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200";
const labelCls = "mb-1 block text-xs font-medium text-gray-600";

export default function AssetFormModal({
  onClose,
  onSubmit,
}: AssetFormModalProps) {
  const [purchaseDate, setPurchaseDate] = useState("");
  const [assetNo, setAssetNo] = useState("");
  const [name, setName] = useState("");
  const [spec, setSpec] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [vendor, setVendor] = useState("");
  const [purpose, setPurpose] = useState("");
  const [location, setLocation] = useState("");
  const [managerPrimary, setManagerPrimary] = useState("");
  const [managerSub, setManagerSub] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  const submit = () => {
    if (!name.trim()) return;
    const newAsset: Asset = {
      id: `AS-${Date.now()}`,
      purchaseDate: purchaseDate.trim(),
      assetNo: assetNo.trim(),
      name: name.trim(),
      spec: spec.trim(),
      quantity: Number(quantity) || 0,
      price: Number(price) || 0,
      vendor: vendor.trim(),
      purpose: purpose.trim(),
      location: location.trim(),
      managerPrimary: managerPrimary.trim(),
      managerSub: managerSub.trim() || "-",
      docs: files,
    };
    onSubmit(newAsset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-gray-900">장비 등록</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>구입일자</label>
            <input
              className={inputCls}
              placeholder="예: 2026-06-20"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>장비번호</label>
            <input
              className={inputCls}
              placeholder="예: S-001 (S=연구용, R=일반)"
              value={assetNo}
              onChange={(e) => setAssetNo(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>장비명 *</label>
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>규격</label>
            <input
              className={inputCls}
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>수량</label>
            <input
              type="number"
              className={inputCls}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>구입금액(원)</label>
            <input
              type="number"
              className={inputCls}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>구입처</label>
            <input
              className={inputCls}
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>용도</label>
            <input
              className={inputCls}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>설치장소</label>
            <input
              className={inputCls}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>관리자_정</label>
            <input
              className={inputCls}
              value={managerPrimary}
              onChange={(e) => setManagerPrimary(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>관리자_부</label>
            <input
              className={inputCls}
              value={managerSub}
              onChange={(e) => setManagerSub(e.target.value)}
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
