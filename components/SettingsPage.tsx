"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";

type LookupRow = {
  id: number; category: string; code: string; label: string;
  color: string | null; sortOrder: number; isSystem: boolean; isActive: boolean;
};

const CATEGORIES: { key: string; title: string; desc: string }[] = [
  { key: "ip_country", title: "지식재산권 · 국가", desc: "국내 / 미국 / 유럽 / 일본 / 중국 / PCT …" },
  { key: "ip_kind", title: "지식재산권 · 유형", desc: "특허 / 상표 …" },
  { key: "ip_event", title: "지식재산권 · 진행단계", desc: "출원 / 등록 / 거절 / 분할출원 / 인증 …" },
  { key: "asset_doc_type", title: "장비 · 첨부 서류 종류", desc: "계약서 / 거래명세서 / 세금계산서 …" },
  { key: "patent_doc_type", title: "지식재산권 · 첨부 서류 종류", desc: "출원사실증명서 / 등록증 / 인증서 …" },
];

const COLORS = ["blue", "emerald", "teal", "violet", "rose", "amber", "indigo", "gray"];

export default function SettingsPage() {
  const [rows, setRows] = useState<LookupRow[]>([]);
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2000); };

  const load = useCallback(async () => {
    try {
      const res = await fetch(api("/api/lookups?manage=1"));
      if (!res.ok) return;
      setRows(await res.json());
    } catch {}
  }, []);
  useEffect(() => { load(); }, [load]);

  const add = async (category: string, code: string, label: string, color: string) => {
    if (!code.trim() || !label.trim()) { showToast("코드와 라벨을 입력하세요."); return; }
    const maxOrder = Math.max(0, ...rows.filter((r) => r.category === category).map((r) => r.sortOrder));
    const res = await fetch(api("/api/lookups"), {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, code, label, color, sortOrder: maxOrder + 10 }),
    });
    if (!res.ok) { const e = await res.json().catch(() => null); showToast(e?.error || "추가 실패"); return; }
    await load(); showToast("추가되었습니다.");
  };
  const update = async (id: number, label: string, color: string) => {
    const res = await fetch(api(`/api/lookups?id=${id}`), {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, color }),
    });
    if (!res.ok) { showToast("수정 실패"); return; }
    await load(); showToast("수정되었습니다.");
  };
  const remove = async (id: number) => {
    if (!confirm("삭제하시겠습니까? 이미 사용 중인 항목이면 기존 데이터 표시에 영향이 있을 수 있습니다.")) return;
    const res = await fetch(api(`/api/lookups?id=${id}`), { method: "DELETE" });
    if (!res.ok) { const e = await res.json().catch(() => null); showToast(e?.error || "삭제 실패"); return; }
    await load(); showToast("삭제되었습니다.");
  };

  return (
    <div className="space-y-5 p-4 sm:p-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-gray-900 px-5 py-3 text-white shadow-lg">{toast}</div>
      )}
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">설정</h1>
        <p className="mt-0.5 text-sm text-gray-500">지식재산권·장비의 분류 항목을 관리합니다</p>
      </div>
      {CATEGORIES.map((cat) => (
        <Section key={cat.key} cat={cat} rows={rows.filter((r) => r.category === cat.key)} onAdd={add} onUpdate={update} onRemove={remove} />
      ))}
    </div>
  );
}

function Section({ cat, rows, onAdd, onUpdate, onRemove }: {
  cat: { key: string; title: string; desc: string };
  rows: LookupRow[];
  onAdd: (category: string, code: string, label: string, color: string) => void;
  onUpdate: (id: number, label: string, color: string) => void;
  onRemove: (id: number) => void;
}) {
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("blue");
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-3">
        <h2 className="text-sm font-bold text-gray-900">{cat.title}</h2>
        <p className="text-xs text-gray-400">{cat.desc}</p>
      </div>
      <div className="space-y-2">
        {rows.length === 0 ? (
          <p className="text-xs text-gray-400">항목이 없습니다.</p>
        ) : (
          rows.map((r) => <RowEditor key={r.id} row={r} onUpdate={onUpdate} onRemove={onRemove} />)
        )}
      </div>
      <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3 sm:flex-row sm:items-center">
        <input placeholder="코드 (예: DE)" value={code} onChange={(e) => setCode(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm sm:w-32" />
        <input placeholder="라벨 (예: 독일)" value={label} onChange={(e) => setLabel(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm sm:flex-1" />
        <select value={color} onChange={(e) => setColor(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm sm:w-32">
          {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => { onAdd(cat.key, code, label, color); setCode(""); setLabel(""); }}
          className="inline-flex items-center justify-center gap-1 rounded-xl bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600">
          <Plus size={15} /> 추가
        </button>
      </div>
    </div>
  );
}

function RowEditor({ row, onUpdate, onRemove }: {
  row: LookupRow;
  onUpdate: (id: number, label: string, color: string) => void;
  onRemove: (id: number) => void;
}) {
  const [label, setLabel] = useState(row.label);
  const [color, setColor] = useState(row.color ?? "gray");
  const dirty = label !== row.label || (color ?? "") !== (row.color ?? "");
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-gray-50 px-3 py-2 sm:flex-row sm:items-center">
      <span className="w-24 shrink-0 font-mono text-xs text-gray-400">{row.code}</span>
      <input value={label} onChange={(e) => setLabel(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm sm:flex-1" />
      <select value={color} onChange={(e) => setColor(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm sm:w-32">
        {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <div className="flex items-center gap-1">
        <button onClick={() => onUpdate(row.id, label, color)} disabled={!dirty}
          className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-40">저장</button>
        {row.isSystem ? (
          <span className="px-2 text-[10px] text-gray-300">시스템</span>
        ) : (
          <button onClick={() => onRemove(row.id)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-100 hover:text-rose-600"><Trash2 size={14} /></button>
        )}
      </div>
    </div>
  );
}
