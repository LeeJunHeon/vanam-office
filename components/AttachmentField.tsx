"use client";

import { useState } from "react";
import { FileText, X, Upload } from "lucide-react";
import type { AttachFile } from "@/lib/mockData";

interface AttachmentFieldProps {
  files: AttachFile[];
  onChange: (files: AttachFile[]) => void;
  docTypes: string[];
  editable: boolean;
}

function isImage(name: string): boolean {
  return /\.(jpg|jpeg|png|webp|heic)$/i.test(name);
}

function formatSize(size?: number): string {
  if (!size) return "";
  return `${Math.max(1, Math.round(size / 1024)).toLocaleString()} KB`;
}

export default function AttachmentField({
  files,
  onChange,
  docTypes,
  editable,
}: AttachmentFieldProps) {
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const added: AttachFile[] = Array.from(fileList).map((f) => ({
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `f-${Date.now()}-${Math.round(performance.now())}`,
      name: f.name,
      size: f.size,
      url: URL.createObjectURL(f),
      kind: docTypes[0] ?? "",
    }));
    onChange([...files, ...added]);
  };

  const updateKind = (id: string, kind: string) => {
    onChange(files.map((f) => (f.id === id ? { ...f, kind } : f)));
  };

  const removeFile = (id: string) => {
    const target = files.find((f) => f.id === id);
    if (target?.url) {
      try {
        URL.revokeObjectURL(target.url);
      } catch {
        // ignore
      }
    }
    onChange(files.filter((f) => f.id !== id));
  };

  // ── 조회(읽기 전용) ──
  if (!editable) {
    if (files.length === 0) {
      return <p className="text-xs text-gray-400">첨부된 파일이 없습니다.</p>;
    }
    return (
      <div className="flex flex-wrap gap-2">
        {files.map((f) => {
          const clickable = !!f.url;
          return (
            <button
              key={f.id}
              type="button"
              disabled={!clickable}
              onClick={() => f.url && window.open(f.url, "_blank")}
              className={`inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs ${
                clickable
                  ? "text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  : "cursor-default text-gray-500"
              }`}
            >
              {f.url && isImage(f.name) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.url}
                  alt={f.name}
                  className="h-8 w-8 rounded object-cover"
                />
              ) : (
                <FileText size={14} className="text-gray-400" />
              )}
              <span>{f.name}</span>
              <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] font-semibold text-gray-600">
                {f.kind}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // ── 편집 ──
  return (
    <div className="space-y-3">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
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
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2"
            >
              {f.url && isImage(f.name) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.url}
                  alt={f.name}
                  className="h-9 w-9 shrink-0 rounded object-cover"
                />
              ) : (
                <FileText size={18} className="shrink-0 text-gray-400" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-gray-900">{f.name}</p>
                {f.size != null && (
                  <p className="text-[11px] text-gray-400">
                    {formatSize(f.size)}
                  </p>
                )}
              </div>
              <select
                value={f.kind}
                onChange={(e) => updateKind(f.id, e.target.value)}
                className="rounded-lg border border-gray-200 px-2 py-1 text-xs focus:ring-2 focus:ring-blue-200"
              >
                {docTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeFile(f.id)}
                className="text-gray-400 hover:text-rose-600"
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
