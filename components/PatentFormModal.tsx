"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Patent } from "@/lib/types";
import type { LookupItem } from "@/lib/useLookups";

interface PatentFormModalProps {
  initial?: Patent;
  countries: LookupItem[];
  kinds: LookupItem[];
  events: LookupItem[];
  onClose: () => void;
  onSubmit: (
    p: {
      countryCode: string | null;
      ipKindCode: string | null;
      name: string;
      number: string | null;
      manager: string | null;
      note: string | null;
    },
    firstEvent: { eventType: string; eventDate: string | null } | null,
  ) => void;
}

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200";
const labelCls = "mb-1 block text-xs font-medium text-gray-600";

export default function PatentFormModal({
  initial,
  countries,
  kinds,
  events,
  onClose,
  onSubmit,
}: PatentFormModalProps) {
  const [countryCode, setCountryCode] = useState(
    initial?.countryCode ?? countries[0]?.code ?? ""
  );
  const [ipKindCode, setIpKindCode] = useState(
    initial?.ipKindCode ?? kinds[0]?.code ?? ""
  );
  const [name, setName] = useState(initial?.name ?? "");
  const [number, setNumber] = useState(initial?.number ?? "");
  const [manager, setManager] = useState(initial?.manager ?? "반암 주식회사");
  const [note, setNote] = useState(initial?.note ?? "");
  // 신규 등록 시 최초 진행상태
  const [eventType, setEventType] = useState(events[0]?.code ?? "");
  const [eventDate, setEventDate] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    const firstEvent =
      !initial && eventType
        ? { eventType, eventDate: eventDate || null }
        : null;
    onSubmit(
      {
        countryCode: countryCode || null,
        ipKindCode: ipKindCode || null,
        name: name.trim(),
        number: number.trim() || null,
        manager: manager.trim() || null,
        note: note.trim() || null,
      },
      firstEvent,
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {initial ? "지식재산권 수정" : "지식재산권 등록"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>국가</label>
            <select
              className={inputCls}
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>유형</label>
            <select
              className={inputCls}
              value={ipKindCode}
              onChange={(e) => setIpKindCode(e.target.value)}
            >
              {kinds.map((k) => (
                <option key={k.code} value={k.code}>
                  {k.label}
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
            <label className={labelCls}>권리권자</label>
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

          {!initial && (
            <>
              <div>
                <label className={labelCls}>최초 진행상태</label>
                <select
                  className={inputCls}
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                >
                  {events.map((ev) => (
                    <option key={ev.code} value={ev.code}>
                      {ev.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>진행일자</label>
                <input
                  type="date"
                  className={inputCls}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
            </>
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
            {initial ? "수정" : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
}
