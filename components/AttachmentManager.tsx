"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText, Upload, Download, X } from "lucide-react";

// fetch·에셋과 달리 원시 <img>·<a>에는 Next가 basePath를 자동으로 붙이지 않으므로 수동 적용
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

type Att = {
  id: number;
  docTypeCode: string | null;
  originalName: string;
  fileSize: number | null;
  mimeType: string | null;
};

interface AttachmentManagerProps {
  entityType: "patent" | "asset";
  entityId: number;
  docTypes: { code: string; label: string }[];
}

function formatSize(size: number | null): string {
  if (!size) return "";
  return `${Math.max(1, Math.round(size / 1024)).toLocaleString()} KB`;
}

export default function AttachmentManager({
  entityType,
  entityId,
  docTypes,
}: AttachmentManagerProps) {
  const [items, setItems] = useState<Att[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [selectedCode, setSelectedCode] = useState(docTypes[0]?.code ?? "");

  const labelOf = (code: string | null) =>
    (code && docTypes.find((d) => d.code === code)?.label) || code || "";

  const load = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/attachments?entityType=${entityType}&entityId=${entityId}`,
      );
      if (!res.ok) return;
      setItems(await res.json());
    } catch {
      // ignore
    }
  }, [entityType, entityId]);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("entityType", entityType);
        form.append("entityId", String(entityId));
        form.append("docTypeCode", selectedCode);
        form.append("file", file);
        // Content-Type 헤더는 브라우저가 boundary와 함께 자동 지정하므로 수동 지정 X
        await fetch("/api/attachments", { method: "POST", body: form });
      }
      await load();
    } catch {
      // ignore
    }
  };

  const remove = async (id: number) => {
    if (!confirm("삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/attachments/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      await load();
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-3">
      {/* 상단: 종류 select + 드롭존 */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <select
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
          className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:ring-2 focus:ring-blue-200"
        >
          {docTypes.map((d) => (
            <option key={d.code} value={d.code}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          upload(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-dashed p-4 text-center text-sm ${
          dragOver
            ? "border-blue-400 bg-blue-50 text-blue-600"
            : "border-gray-200 text-gray-500"
        }`}
      >
        <Upload size={18} className="text-gray-400" />
        <span>여기로 파일을 끌어다 놓거나 클릭해서 선택하세요</span>
        <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
          파일 선택
        </span>
        <input
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            upload(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {/* 목록 */}
      {items.length === 0 ? (
        <p className="text-xs text-gray-400">첨부된 파일이 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2"
            >
              {it.mimeType?.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${BASE_PATH}/api/attachments/${it.id}/file`}
                  alt={it.originalName}
                  className="h-9 w-9 shrink-0 rounded object-cover"
                />
              ) : (
                <FileText size={18} className="shrink-0 text-gray-400" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-gray-900">
                  {it.originalName}
                </p>
                <p className="text-[11px] text-gray-400">
                  {formatSize(it.fileSize)}
                </p>
              </div>
              {it.docTypeCode && (
                <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] font-semibold text-gray-600">
                  {labelOf(it.docTypeCode)}
                </span>
              )}
              <a
                href={`${BASE_PATH}/api/attachments/${it.id}/file?download=1`}
                className="text-gray-400 hover:text-blue-600"
                title="다운로드"
              >
                <Download size={16} />
              </a>
              <button
                type="button"
                onClick={() => remove(it.id)}
                className="text-gray-400 hover:text-rose-600"
                title="삭제"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
