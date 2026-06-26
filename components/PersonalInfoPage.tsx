"use client";

import { useState } from "react";
import {
  IdCard,
  Plus,
  Search,
  Eye,
  EyeOff,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { mockPersonalInfos, type PersonalInfo } from "@/lib/mockData";

function maskValue(v: string | null): string {
  if (!v) return "-";
  let kept = 0;
  let out = "";
  for (const ch of v) {
    if (ch === "-") {
      out += ch;
      continue;
    }
    if (kept < 6) {
      out += ch;
      kept++;
    } else {
      out += "*";
    }
  }
  return out;
}

export default function PersonalInfoPage() {
  const [list, setList] = useState<PersonalInfo[]>(mockPersonalInfos);
  const [selectedId, setSelectedId] = useState<number | null>(
    mockPersonalInfos[0]?.employeeId ?? null
  );
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<PersonalInfo | null>(null);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [toast, setToast] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [showResident, setShowResident] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const detail = list.find((p) => p.employeeId === selectedId) ?? null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const filtered = search
    ? list.filter(
        (p) =>
          p.hrName.includes(search) ||
          p.name.includes(search) ||
          (p.employeeNo ?? "").includes(search)
      )
    : list;

  // ── 헬퍼 렌더러 ──
  const field = (label: string, value: string | null) => (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm text-gray-900">{value || "-"}</div>
    </div>
  );

  const maskedField = (
    label: string,
    value: string | null,
    show: boolean,
    setShow: (v: boolean) => void
  ) => (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono text-gray-900">
          {show ? value || "-" : maskValue(value)}
        </span>
        {value && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="text-gray-400 hover:text-blue-600"
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  );

  const inputField = (
    label: string,
    key: keyof PersonalInfo,
    placeholder?: string
  ) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">
        {label}
      </label>
      <input
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
        placeholder={placeholder}
        value={form ? (form[key] as string | null) ?? "" : ""}
        onChange={(e) =>
          setForm((f) => (f ? { ...f, [key]: e.target.value } : f))
        }
      />
    </div>
  );

  // ── 동작 ──
  const startEdit = () => {
    if (!detail) return;
    setForm(detail);
    setEditing(true);
  };

  const save = () => {
    if (!form) return;
    setList((prev) =>
      prev.map((p) => (p.employeeId === form.employeeId ? form : p))
    );
    setEditing(false);
    showToast("저장되었습니다.");
  };

  const cancel = () => {
    setEditing(false);
    setForm(detail);
  };

  const remove = () => {
    if (!detail) return;
    if (!confirm("삭제하시겠습니까?")) return;
    if (detail.isHrOnly) {
      setList((prev) => {
        const next = prev.filter((p) => p.employeeId !== detail.employeeId);
        setSelectedId(next[0]?.employeeId ?? null);
        return next;
      });
    } else {
      setList((prev) =>
        prev.map((p) =>
          p.employeeId === detail.employeeId
            ? {
                ...p,
                hrName: p.name,
                employeeNo: null,
                hrPosition: null,
                hrDepartment: null,
                hiredAt: null,
                researcherNumber: null,
                university: null,
                finalDegree: null,
                major: null,
                graduationYearmonth: null,
                degreeNumber: null,
                residentNumber: null,
                hrPhone: null,
                address: null,
                email: null,
                bankName: null,
                accountNumber: null,
                accountHolder: null,
                hasInfo: false,
              }
            : p
        )
      );
    }
    setEditing(false);
    showToast("삭제되었습니다.");
  };

  const addEmployee = () => {
    const name = addName.trim();
    if (!name) return;
    const newId =
      list.reduce((max, p) => Math.max(max, p.employeeId), 0) + 1;
    const newPerson: PersonalInfo = {
      employeeId: newId,
      name: "-",
      positionName: null,
      departmentName: null,
      hrName: name,
      employeeNo: null,
      hrPosition: null,
      hrDepartment: null,
      hiredAt: null,
      researcherNumber: null,
      university: null,
      finalDegree: null,
      major: null,
      graduationYearmonth: null,
      degreeNumber: null,
      residentNumber: null,
      hrPhone: null,
      address: null,
      email: null,
      bankName: null,
      accountNumber: null,
      accountHolder: null,
      hasInfo: true,
      isHrOnly: true,
    };
    setList((prev) => [...prev, newPerson]);
    setSelectedId(newId);
    setEditing(false);
    setAddOpen(false);
    setAddName("");
    showToast("직원이 추가되었습니다.");
  };

  const onDrop = (dropIndex: number) => {
    if (search) return;
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      return;
    }
    setList((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(dropIndex, 0, moved);
      return next;
    });
    setDragIndex(null);
  };

  return (
    <div className="p-4 sm:p-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-gray-900 px-5 py-3 text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* 헤더 */}
      <div className="mb-5">
        <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl">
          <IdCard size={22} className="text-blue-600" />
          인사정보 카드
        </h1>
        <p className="mt-0.5 text-sm text-gray-500">
          직원의 인사 기준 정보·학력·계좌 등을 관리합니다 (제한된 권한자만 접근)
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* 좌측 목록 */}
        <div className="shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white lg:w-72">
          <div className="border-b border-gray-100 p-3">
            <button
              onClick={() => setAddOpen(true)}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={15} />
              직원 추가
            </button>
            <div className="relative mt-3">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="이름/사번 검색"
                className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            {filtered.map((p) => {
              const realIndex = list.indexOf(p);
              return (
                <button
                  key={p.employeeId}
                  draggable
                  onDragStart={() => setDragIndex(realIndex)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(realIndex)}
                  onClick={() => {
                    setSelectedId(p.employeeId);
                    setEditing(false);
                  }}
                  className={`block w-full border-b border-gray-50 px-4 py-3 text-left ${
                    p.employeeId === selectedId ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-gray-900">
                      {p.hrName}
                    </span>
                    {p.isHrOnly && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                        인사전용
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {p.employeeNo ?? "-"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 우측 상세 */}
        <div className="min-w-0 flex-1 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          {detail ? (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {detail.hrName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {detail.hrPosition || detail.positionName || "-"} ·{" "}
                    {detail.hrDepartment || detail.departmentName || "-"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!editing ? (
                    <>
                      <button
                        onClick={startEdit}
                        className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                      >
                        수정
                      </button>
                      {detail.hasInfo && (
                        <button
                          onClick={remove}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-100"
                        >
                          <Trash2 size={15} />
                          삭제
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        onClick={save}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        <Save size={15} />
                        저장
                      </button>
                      <button
                        onClick={cancel}
                        className="rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200"
                      >
                        취소
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-5">
                {!editing ? (
                  <div className="space-y-5">
                    {/* 회사 */}
                    <div>
                      <h3 className="mb-2 text-xs font-bold text-gray-700">
                        회사
                      </h3>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {field("사번", detail.employeeNo)}
                        {field("직책", detail.hrPosition)}
                        {field("소속", detail.hrDepartment)}
                        {field("입사일", detail.hiredAt)}
                        {field("국가연구자 번호", detail.researcherNumber)}
                      </div>
                      <p className="mt-2 text-[11px] text-gray-400">
                        근태 시스템 등록명: {detail.name} ·{" "}
                        {detail.positionName || "-"} ·{" "}
                        {detail.departmentName || "-"}
                      </p>
                    </div>

                    {/* 졸업 대학 정보 */}
                    <div>
                      <h3 className="mb-2 text-xs font-bold text-gray-700">
                        졸업 대학 정보
                      </h3>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {field("대학교", detail.university)}
                        {field("최종 학위", detail.finalDegree)}
                        {field("전공", detail.major)}
                        {field("졸업년월", detail.graduationYearmonth)}
                        {field("학위등록번호", detail.degreeNumber)}
                      </div>
                    </div>

                    {/* 개인 정보 */}
                    <div>
                      <h3 className="mb-2 text-xs font-bold text-gray-700">
                        개인 정보
                      </h3>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {maskedField(
                          "주민번호",
                          detail.residentNumber,
                          showResident,
                          setShowResident
                        )}
                        {field("연락처", detail.hrPhone)}
                        {field("주소", detail.address)}
                        {field("이메일", detail.email)}
                      </div>
                    </div>

                    {/* 급여 통장 */}
                    <div>
                      <h3 className="mb-2 text-xs font-bold text-gray-700">
                        급여 통장
                      </h3>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {field("은행", detail.bankName)}
                        {maskedField(
                          "계좌",
                          detail.accountNumber,
                          showAccount,
                          setShowAccount
                        )}
                        {field("예금주", detail.accountHolder)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
                      사번·이메일·입사일은 직원 관리와 공유됩니다(여기서 수정하면
                      직원 관리에도 반영). 성명/직책/소속/연락처는 인사정보 카드
                      전용입니다.
                    </div>

                    {/* 성명 */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {inputField("성명(한글)", "hrName")}
                    </div>

                    {/* 회사 */}
                    <div>
                      <h3 className="mb-2 text-xs font-bold text-gray-700">
                        회사
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {inputField("사번", "employeeNo")}
                        {inputField("직책", "hrPosition")}
                        {inputField("소속", "hrDepartment")}
                        {inputField("입사일", "hiredAt", "예: 2024-01-15")}
                        {inputField("국가연구자 번호", "researcherNumber")}
                      </div>
                    </div>

                    {/* 졸업 대학 정보 */}
                    <div>
                      <h3 className="mb-2 text-xs font-bold text-gray-700">
                        졸업 대학 정보
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {inputField("대학교", "university")}
                        {inputField("최종 학위", "finalDegree")}
                        {inputField("전공", "major")}
                        {inputField(
                          "졸업년월",
                          "graduationYearmonth",
                          "예: 2020-02"
                        )}
                        {inputField("학위등록번호", "degreeNumber")}
                      </div>
                    </div>

                    {/* 개인 정보 */}
                    <div>
                      <h3 className="mb-2 text-xs font-bold text-gray-700">
                        개인 정보
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {inputField(
                          "주민번호",
                          "residentNumber",
                          "예: 000000-0000000"
                        )}
                        {inputField("연락처", "hrPhone")}
                        {inputField("주소", "address")}
                        {inputField("이메일", "email")}
                      </div>
                    </div>

                    {/* 급여 통장 */}
                    <div>
                      <h3 className="mb-2 text-xs font-bold text-gray-700">
                        급여 통장
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {inputField("은행", "bankName")}
                        {inputField("계좌", "accountNumber")}
                        {inputField("예금주", "accountHolder")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-sm text-gray-400">
              정보를 불러올 수 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 직원 추가 모달 */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-gray-900">
                인사 전용 직원 추가
              </h3>
              <button
                onClick={() => setAddOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              근태 시스템에는 표시되지 않는 인사정보 카드 전용 직원입니다.
            </p>
            <input
              autoFocus
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addEmployee()}
              placeholder="이름"
              className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setAddOpen(false)}
                className="rounded-xl bg-gray-100 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={addEmployee}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
