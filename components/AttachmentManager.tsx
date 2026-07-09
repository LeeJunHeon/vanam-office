"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText, Upload, Download, X } from "lucide-react";
import { api } from "@/lib/api";

type Att = {
  id: number;
  originalName: string;
  fileSize: number | null;
  mimeType: string | null;
};

function formatSize(size: number | null): string {
  if (!size) return "";
  return `${Math.max(1, Math.round(size / 1024)).toLocaleString()} KB`;
}

interface AttachmentManagerProps {
  entityType: "patent" | "asset";
  entityId: number;
}

// 이미 등록된 엔티티의 첨부 관리 (단일 영역, 여러 파일 동시 업로드)
export default function AttachmentManager({
  entityType,
  entityId,
}: AttachmentManagerProps) {
  const [items, setItems] = useState<Att[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setErr(null);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("entityType", entityType);
        form.append("entityId", String(entityId));
        form.append("file", file);
        const res = await fetch(api("/api/attachments"), {
          method: "POST",
          body: form,
        });
        if (!res.ok) throw new Error("fail");
      }
      await load();
    } catch {
      setErr("업로드 실패 — 대용량 파일이면 실패할 수 있습니다.");
    } finally {
      setBusy(false);
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
    <div className="space-y-2">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          upload(e.dataTransfer.files);
        }}
        className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 px-4 py-5 text-center"
      >
        <p className="text-xs text-gray-400">파일을 여기로 끌어다 놓거나</p>
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100">
          <Upload size={13} />
          파일 선택 (여러 개 가능)
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              upload(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {busy && <p className="text-xs text-blue-600">업로드 중…</p>}
      {err && <p className="text-xs text-rose-600">{err}</p>}

      {items.length === 0 ? (
        <p className="py-2 text-center text-xs text-gray-300">첨부된 파일 없음</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((f) => {
            const isImage = (f.mimeType ?? "").startsWith("image/");
            return (
              <li
                key={f.id}
                className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-2.5 py-1.5"
              >
                <a
                  href={api(`/api/attachments/${f.id}/file`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 items-center gap-2 hover:opacity-80"
                  title="미리보기"
                >
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={api(`/api/attachments/${f.id}/file`)}
                      alt=""
                      className="h-8 w-8 shrink-0 rounded object-cover"
                    />
                  ) : (
                    <FileText size={16} className="shrink-0 text-gray-400" />
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
                </a>
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
}

// 신규 등록 폼에서 쓰는 파일 선택 UI (저장 전 로컬 File[]만 관리)
export type PendingFiles = File[];

export function AttachmentPicker({
  value,
  onChange,
}: {
  value: PendingFiles;
  onChange: (v: PendingFiles) => void;
}) {
  const add = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onChange([...value, ...Array.from(files)]);
  };
  const removeAt = (idx: number) => {
    const arr = [...value];
    arr.splice(idx, 1);
    onChange(arr);
  };
  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          add(e.dataTransfer.files);
        }}
        className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 px-4 py-5 text-center"
      >
        <p className="text-xs text-gray-400">파일을 여기로 끌어다 놓거나</p>
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100">
          <Upload size={13} />
          파일 선택 (여러 개 가능)
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              add(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {value.length === 0 ? (
        <p className="py-2 text-center text-xs text-gray-300">첨부된 파일 없음</p>
      ) : (
        <ul className="space-y-1.5">
          {value.map((f, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-2.5 py-1.5"
            >
              <div className="flex min-w-0 items-center gap-2">
                <FileText size={16} className="shrink-0 text-gray-400" />
                <p className="truncate text-xs text-gray-700">{f.name}</p>
              </div>
              <button
                onClick={() => removeAt(idx)}
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
}

// 로컬에 모은 File[] 를 특정 entityId로 일괄 업로드 (저장 직후 호출)
export async function uploadPending(
  entityType: "patent" | "asset",
  entityId: number,
  files: PendingFiles,
) {
  for (const file of files) {
    const form = new FormData();
    form.append("entityType", entityType);
    form.append("entityId", String(entityId));
    form.append("file", file);
    const res = await fetch(api("/api/attachments"), {
      method: "POST",
      body: form,
    });
    if (!res.ok) throw new Error("fail");
  }
}
