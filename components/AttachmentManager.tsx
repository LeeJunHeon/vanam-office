"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText, Upload, Download, X } from "lucide-react";
import { api } from "@/lib/api";

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

  const load = useCallback(async () => {
    try {
      const res = await fetch(
        api(`/api/attachments?entityType=${entityType}&entityId=${entityId}`),
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

  const upload = async (files: FileList | null, code: string) => {
    if (!files || files.length === 0) return;
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("entityType", entityType);
        form.append("entityId", String(entityId));
        form.append("docTypeCode", code);
        form.append("file", file);
        await fetch(api("/api/attachments"), { method: "POST", body: form });
      }
      await load();
    } catch {
      // ignore
    }
  };

  const remove = async (id: number) => {
    if (!confirm("삭제하시겠습니까?")) return;
    try {
      await fetch(api(`/api/attachments/${id}`), { method: "DELETE" });
      await load();
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-3">
      {docTypes.map((dt) => {
        const files = items.filter((it) => it.docTypeCode === dt.code);
        return (
          <div key={dt.code} className="rounded-xl border border-gray-100 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">{dt.label}</p>
              <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50">
                <Upload size={13} />
                파일 추가
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    upload(e.target.files, dt.code);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                upload(e.dataTransfer.files, dt.code);
              }}
              className="mb-2 rounded-lg border border-dashed border-gray-200 px-3 py-2 text-center text-[11px] text-gray-400"
            >
              파일을 여기로 끌어다 놓기
            </div>

            {files.length === 0 ? (
              <p className="text-xs text-gray-300">첨부된 파일 없음</p>
            ) : (
              <ul className="space-y-1.5">
                {files.map((f) => {
                  const isImage = (f.mimeType ?? "").startsWith("image/");
                  return (
                    <li
                      key={f.id}
                      className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-2.5 py-1.5"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        {isImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={api(`/api/attachments/${f.id}/file`)}
                            alt=""
                            className="h-8 w-8 shrink-0 rounded object-cover"
                          />
                        ) : (
                          <FileText
                            size={16}
                            className="shrink-0 text-gray-400"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-xs text-gray-700">
                            {f.originalName}
                          </p>
                          {f.fileSize != null && (
                            <p className="text-[10px] text-gray-400">
                              {formatSize(f.fileSize)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <a
                          href={api(`/api/attachments/${f.id}/file?download=1`)}
                          className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                          title="다운로드"
                        >
                          <Download size={14} />
                        </a>
                        <button
                          onClick={() => remove(f.id)}
                          className="rounded p-1 text-gray-400 hover:bg-rose-100 hover:text-rose-600"
                          title="삭제"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

// 신규 등록 폼에서 쓰는 "카테고리별 파일 선택" UI (아직 저장 전 — 서버 업로드 없이 로컬 File[]만 관리)
export type PendingFiles = Record<string, File[]>; // docTypeCode -> File[]

export function AttachmentPicker({
  docTypes,
  value,
  onChange,
}: {
  docTypes: { code: string; label: string }[];
  value: PendingFiles;
  onChange: (v: PendingFiles) => void;
}) {
  const add = (code: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    onChange({ ...value, [code]: [...(value[code] ?? []), ...Array.from(files)] });
  };
  const removeAt = (code: string, idx: number) => {
    const arr = [...(value[code] ?? [])];
    arr.splice(idx, 1);
    onChange({ ...value, [code]: arr });
  };
  return (
    <div className="space-y-3">
      {docTypes.map((dt) => {
        const files = value[dt.code] ?? [];
        return (
          <div key={dt.code} className="rounded-xl border border-gray-100 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">{dt.label}</p>
              <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50">
                <Upload size={13} />
                파일 추가
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    add(dt.code, e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                add(dt.code, e.dataTransfer.files);
              }}
              className="mb-2 rounded-lg border border-dashed border-gray-200 px-3 py-2 text-center text-[11px] text-gray-400"
            >
              파일을 여기로 끌어다 놓기
            </div>
            {files.length === 0 ? (
              <p className="text-xs text-gray-300">첨부된 파일 없음</p>
            ) : (
              <ul className="space-y-1.5">
                {files.map((f, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-2.5 py-1.5"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <FileText size={16} className="shrink-0 text-gray-400" />
                      <p className="truncate text-xs text-gray-700">{f.name}</p>
                    </div>
                    <button
                      onClick={() => removeAt(dt.code, idx)}
                      className="rounded p-1 text-gray-400 hover:bg-rose-100 hover:text-rose-600"
                      title="삭제"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

// 로컬에 모은 PendingFiles 를 특정 entityId로 일괄 업로드 (저장 직후 호출)
export async function uploadPending(
  entityType: "patent" | "asset",
  entityId: number,
  pending: PendingFiles,
) {
  for (const [code, files] of Object.entries(pending)) {
    for (const file of files) {
      const form = new FormData();
      form.append("entityType", entityType);
      form.append("entityId", String(entityId));
      form.append("docTypeCode", code);
      form.append("file", file);
      await fetch(api("/api/attachments"), { method: "POST", body: form });
    }
  }
}
