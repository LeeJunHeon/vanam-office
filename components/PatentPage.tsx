"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import type { Patent } from "@/lib/types";
import { api } from "@/lib/api";
import { useLookups, type LookupItem } from "@/lib/useLookups";
import { badgeClass, currentStatus } from "@/lib/lookups";
import PatentFormModal from "@/components/PatentFormModal";
import AttachmentManager from "@/components/AttachmentManager";

export default function PatentPage() {
  const [patents, setPatents] = useState<Patent[]>([]);
  const [selected, setSelected] = useState<Patent | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Patent | null>(null);
  const [toast, setToast] = useState("");

  const { lookups } = useLookups();
  const countries = lookups.ip_country ?? [];
  const kinds = lookups.ip_kind ?? [];
  const ipEvents = lookups.ip_event ?? [];
  const patentDocTypes = lookups.patent_doc_type ?? [];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const load = useCallback(async () => {
    try {
      const res = await fetch(api("/api/patents"));
      if (!res.ok) return;
      const data: Patent[] = await res.json();
      setPatents(data);
      // 상세 열려있으면 최신 데이터(이벤트 포함)로 동기화
      setSelected((cur) =>
        cur ? (data.find((p) => p.id === cur.id) ?? null) : cur,
      );
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ── 라벨/색 헬퍼 ──
  const countryLabel = (code?: string | null) =>
    (code && countries.find((c) => c.code === code)?.label) || code || "-";
  const kindLabel = (code?: string | null) =>
    (code && kinds.find((k) => k.code === code)?.label) || code || "-";
  const eventLabel = (code: string) =>
    ipEvents.find((e) => e.code === code)?.label ?? code;
  const eventColor = (code: string) =>
    ipEvents.find((e) => e.code === code)?.color;

  const StatusBadge = ({ events }: { events?: Patent["events"] }) => {
    const code = currentStatus(events);
    if (!code) return <span className="text-sm text-gray-400">-</span>;
    return (
      <span
        className={`${badgeClass(
          eventColor(code),
        )} inline-flex rounded-md px-2.5 py-0.5 text-xs font-semibold`}
      >
        {eventLabel(code)}
      </span>
    );
  };

  const visible =
    filter === "all"
      ? patents
      : patents.filter((p) => p.ipKindCode === filter);

  const countByStatus = (code: string) =>
    patents.filter((p) => currentStatus(p.events) === code).length;
  const countRegistered = countByStatus("REGISTERED");
  const countApplied = countByStatus("APPLIED");
  const countCertified = countByStatus("CERTIFIED");

  const openRegister = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (p: Patent) => {
    setEditing(p);
    setModalOpen(true);
  };

  const handleSubmit = async (
    payload: {
      countryCode: string | null;
      ipKindCode: string | null;
      name: string;
      number: string | null;
      manager: string | null;
      note: string | null;
    },
    firstEvent: { eventType: string; eventDate: string | null } | null,
  ) => {
    try {
      const res = editing
        ? await fetch(api(`/api/patents/${editing.id}`), {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(api("/api/patents"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, firstEvent }),
          });
      if (!res.ok) {
        showToast("저장에 실패했습니다.");
        return;
      }
      await load();
      setModalOpen(false);
      showToast(editing ? "수정되었습니다." : "등록되었습니다.");
    } catch {
      showToast("저장에 실패했습니다.");
    }
  };

  const handleDelete = async (p: Patent) => {
    if (!confirm("삭제하시겠습니까?")) return;
    try {
      const res = await fetch(api(`/api/patents/${p.id}`), { method: "DELETE" });
      if (!res.ok) {
        showToast("삭제에 실패했습니다.");
        return;
      }
      setSelected(null);
      await load();
      showToast("삭제되었습니다.");
    } catch {
      showToast("삭제에 실패했습니다.");
    }
  };

  const addEvent = async (
    patentId: number,
    eventType: string,
    eventDate: string,
  ) => {
    try {
      const res = await fetch(api("/api/patent-events"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patentId,
          eventType,
          eventDate: eventDate || null,
        }),
      });
      if (!res.ok) {
        showToast("이벤트 추가에 실패했습니다.");
        return;
      }
      await load();
      showToast("진행이력이 추가되었습니다.");
    } catch {
      showToast("이벤트 추가에 실패했습니다.");
    }
  };

  const deleteEvent = async (eventId: number) => {
    if (!confirm("이 진행이력을 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(api(`/api/patent-events/${eventId}`), {
        method: "DELETE",
      });
      if (!res.ok) {
        showToast("이벤트 삭제에 실패했습니다.");
        return;
      }
      await load();
      showToast("진행이력이 삭제되었습니다.");
    } catch {
      showToast("이벤트 삭제에 실패했습니다.");
    }
  };

  const updateEvent = async (
    eventId: number,
    eventType: string,
    eventDate: string,
  ) => {
    try {
      const res = await fetch(api(`/api/patent-events/${eventId}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType, eventDate: eventDate || null }),
      });
      if (!res.ok) {
        showToast("이벤트 수정에 실패했습니다.");
        return;
      }
      await load();
      showToast("진행이력이 수정되었습니다.");
    } catch {
      showToast("이벤트 수정에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-5 p-4 sm:p-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-gray-900 px-5 py-3 text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            지식재산권
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            회사 지식재산권 등록·출원·인증 현황을 관리합니다
          </p>
        </div>
        <button
          onClick={openRegister}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-600"
        >
          <Plus size={16} />
          지식재산권 등록
        </button>
      </div>

      {modalOpen && (
        <PatentFormModal
          initial={editing ?? undefined}
          countries={countries}
          kinds={kinds}
          events={ipEvents}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {selected ? (
        <PatentDetail
          patent={selected}
          countryLabel={countryLabel}
          kindLabel={kindLabel}
          eventLabel={eventLabel}
          eventColor={eventColor}
          ipEvents={ipEvents}
          docTypes={patentDocTypes}
          onBack={() => setSelected(null)}
          onEdit={() => openEdit(selected)}
          onDelete={() => handleDelete(selected)}
          onAddEvent={addEvent}
          onDeleteEvent={deleteEvent}
          onUpdateEvent={updateEvent}
        />
      ) : (
        <>
          {/* 요약 카드 (현재상태 기준) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "등록", value: countRegistered },
              { label: "출원", value: countApplied },
              { label: "인증", value: countCertified },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-gray-100 bg-white p-4"
              >
                <p className="text-xs text-gray-500">{m.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {m.value}건
                </p>
              </div>
            ))}
          </div>

          {/* 필터칩 (유형 기준) */}
          <div className="flex flex-wrap gap-2">
            {[{ code: "all", label: "전체" }, ...kinds].map((f) => (
              <button
                key={f.code}
                onClick={() => setFilter(f.code)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                  filter === f.code
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* 테이블 */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {[
                      "순번",
                      "국가",
                      "유형",
                      "지식재산권명",
                      "등록(출원)번호",
                      "현재상태",
                      "권리권자",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {visible.map((p, i) => (
                    <tr
                      key={p.id}
                      onClick={() => setSelected(p)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {countryLabel(p.countryCode)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {kindLabel(p.ipKindCode)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {p.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {p.number || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <StatusBadge events={p.events} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {p.manager || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PatentDetail({
  patent,
  countryLabel,
  kindLabel,
  eventLabel,
  eventColor,
  ipEvents,
  docTypes,
  onBack,
  onEdit,
  onDelete,
  onAddEvent,
  onDeleteEvent,
  onUpdateEvent,
}: {
  patent: Patent;
  countryLabel: (code?: string | null) => string;
  kindLabel: (code?: string | null) => string;
  eventLabel: (code: string) => string;
  eventColor: (code: string) => string | null | undefined;
  ipEvents: LookupItem[];
  docTypes: { code: string; label: string }[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddEvent: (patentId: number, eventType: string, eventDate: string) => void;
  onDeleteEvent: (eventId: number) => void;
  onUpdateEvent: (eventId: number, eventType: string, eventDate: string) => void;
}) {
  const [evType, setEvType] = useState(ipEvents[0]?.code ?? "");
  const [evDate, setEvDate] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editType, setEditType] = useState("");
  const [editDate, setEditDate] = useState("");

  const timeline = [...(patent.events ?? [])].sort((a, b) => {
    const da = a.eventDate ? +new Date(a.eventDate) : 0;
    const db = b.eventDate ? +new Date(b.eventDate) : 0;
    return da - db;
  });

  const submitEvent = () => {
    if (!evType) return;
    onAddEvent(patent.id, evType, evDate);
    setEvDate("");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200"
        >
          <ArrowLeft size={16} />
          목록으로
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            <Pencil size={15} />
            수정
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-100"
          >
            <Trash2 size={15} />
            삭제
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-bold text-gray-900">{patent.name}</h2>
        {(() => {
          const code = currentStatus(patent.events);
          return code ? (
            <span
              className={`${badgeClass(
                eventColor(code),
              )} inline-flex rounded-md px-3 py-1 text-sm font-semibold`}
            >
              {eventLabel(code)}
            </span>
          ) : null;
        })()}
      </div>

      {/* 기본정보 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="국가" value={countryLabel(patent.countryCode)} />
          <Field label="유형" value={kindLabel(patent.ipKindCode)} />
          <Field label="등록(출원)번호" value={patent.number || "-"} />
          <Field label="권리권자" value={patent.manager || "-"} />
          <Field label="비고" value={patent.note || "-"} />
        </div>
      </div>

      {/* 진행이력 타임라인 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">진행이력</h3>

        {/* 이벤트 추가 폼 */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              진행상태
            </label>
            <select
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
              value={evType}
              onChange={(e) => setEvType(e.target.value)}
            >
              {ipEvents.map((ev) => (
                <option key={ev.code} value={ev.code}>
                  {ev.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              일자
            </label>
            <input
              type="date"
              value={evDate}
              onChange={(e) => setEvDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <button
            onClick={submitEvent}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600"
          >
            <Plus size={15} />
            추가
          </button>
        </div>

        {timeline.length === 0 ? (
          <p className="text-xs text-gray-400">등록된 진행이력이 없습니다.</p>
        ) : (
          <ol className="relative space-y-4 border-l border-gray-100 pl-5">
            {timeline.map((ev) => (
              <li key={ev.id} className="relative">
                <span
                  className={`absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full ${badgeDot(
                    eventColor(ev.eventType),
                  )}`}
                />
                {editId === ev.id ? (
                  <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                      className="rounded-lg border border-gray-200 px-2 py-1 text-sm"
                    >
                      {ipEvents.map((x) => (
                        <option key={x.code} value={x.code}>
                          {x.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="rounded-lg border border-gray-200 px-2 py-1 text-sm"
                    />
                    <button
                      onClick={() => {
                        onUpdateEvent(ev.id, editType, editDate);
                        setEditId(null);
                      }}
                      className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-200"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {eventLabel(ev.eventType)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {ev.eventDate ? ev.eventDate.slice(0, 10) : "-"}
                        </span>
                      </div>
                      {ev.note && (
                        <p className="mt-0.5 text-xs text-gray-500">{ev.note}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => {
                          setEditId(ev.id);
                          setEditType(ev.eventType);
                          setEditDate(
                            ev.eventDate ? ev.eventDate.slice(0, 10) : "",
                          );
                        }}
                        className="rounded p-1 text-gray-400 hover:bg-blue-100 hover:text-blue-600"
                        title="수정"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteEvent(ev.id)}
                        className="rounded p-1 text-gray-400 hover:bg-rose-100 hover:text-rose-600"
                        title="삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* 첨부 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">관련 문서</h3>
        <AttachmentManager
          entityType="patent"
          entityId={patent.id}
          docTypes={docTypes}
        />
      </div>
    </div>
  );
}

// 타임라인 점 색상
function badgeDot(color?: string | null): string {
  const map: Record<string, string> = {
    emerald: "bg-emerald-500",
    teal: "bg-teal-500",
    blue: "bg-blue-500",
    rose: "bg-rose-500",
    amber: "bg-amber-500",
    violet: "bg-violet-500",
    gray: "bg-gray-400",
  };
  return (color && map[color]) || map.gray;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm text-gray-900">{value}</p>
    </div>
  );
}
