"use client";

import { useCallback, useEffect, useState } from "react";
import { IdCard, Search, Eye, EyeOff, Save, Trash2, Plus } from "lucide-react";
import type { PersonalListItem, PersonalDetail } from "@/lib/types";
import { api } from "@/lib/api";

// office가 편집 가능한 인사정보 필드
type FormKey =
  | "hrName"
  | "hrPosition"
  | "hrDepartment"
  | "hrPhone"
  | "researcherNumber"
  | "university"
  | "finalDegree"
  | "major"
  | "graduationYearmonth"
  | "degreeNumber"
  | "residentNumber"
  | "address"
  | "bankName"
  | "accountNumber"
  | "accountHolder";

type PersonalForm = Record<FormKey, string>;

const FORM_KEYS: FormKey[] = [
  "hrName",
  "hrPosition",
  "hrDepartment",
  "hrPhone",
  "researcherNumber",
  "university",
  "finalDegree",
  "major",
  "graduationYearmonth",
  "degreeNumber",
  "residentNumber",
  "address",
  "bankName",
  "accountNumber",
  "accountHolder",
];

function emptyForm(): PersonalForm {
  return Object.fromEntries(FORM_KEYS.map((k) => [k, ""])) as PersonalForm;
}

function formFromDetail(d: PersonalDetail): PersonalForm {
  return Object.fromEntries(
    FORM_KEYS.map((k) => [k, d[k] ?? ""]),
  ) as PersonalForm;
}

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
  const [list, setList] = useState<PersonalListItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<PersonalDetail | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<PersonalForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [showResident, setShowResident] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [adding, setAdding] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const loadList = useCallback(async () => {
    try {
      const res = await fetch(api("/api/personal-info"));
      if (!res.ok) return;
      setList(await res.json());
    } catch {
      // ignore
    }
  }, []);

  const loadDetail = useCallback(async (id: number) => {
    try {
      const res = await fetch(api(`/api/personal-info/${id}`));
      if (!res.ok) return;
      setDetail(await res.json());
      setEditing(false);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const filtered = search
    ? list.filter(
        (p) =>
          p.name.includes(search) || (p.employeeNo ?? "").includes(search),
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
    setShow: (v: boolean) => void,
  ) => (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-gray-900">
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

  const readonlyField = (label: string, value: string | null) => (
    <div>
      <div className="mb-1 text-xs font-medium text-gray-600">{label}</div>
      <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-400">
        {value || "-"}
      </div>
    </div>
  );

  const inputField = (label: string, key: FormKey, placeholder?: string) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">
        {label}
      </label>
      <input
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) =>
          setForm((f) => ({ ...f, [key]: e.target.value }))
        }
      />
    </div>
  );

  // ── 동작 ──
  const selectEmployee = (id: number) => {
    setSelectedId(id);
    loadDetail(id);
  };

  const startEdit = () => {
    if (!detail) return;
    setForm(formFromDetail(detail));
    setEditing(true);
  };

  const save = async () => {
    if (selectedId === null) return;
    setSaving(true);
    try {
      const res = await fetch(api(`/api/personal-info/${selectedId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        showToast("저장에 실패했습니다.");
        return;
      }
      await loadDetail(selectedId);
      await loadList();
      showToast("저장되었습니다.");
    } catch {
      showToast("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setEditing(false);
  };

  const remove = async () => {
    if (selectedId === null) return;
    if (!confirm("인사정보를 비우시겠습니까? (직원은 삭제되지 않습니다)")) return;
    try {
      const res = await fetch(api(`/api/personal-info/${selectedId}`), {
        method: "DELETE",
      });
      if (!res.ok) {
        showToast("삭제에 실패했습니다.");
        return;
      }
      await loadDetail(selectedId);
      await loadList();
      showToast("인사정보가 비워졌습니다.");
    } catch {
      showToast("삭제에 실패했습니다.");
    }
  };

  const addPerson = async () => {
    const name = addName.trim();
    if (!name) return;
    setAdding(true);
    try {
      const res = await fetch(api("/api/personal-info/persons"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        showToast("직원 추가에 실패했습니다.");
        return;
      }
      const { employeeId } = await res.json();
      await loadList();
      selectEmployee(employeeId);
      setAddOpen(false);
      setAddName("");
      showToast("직원이 추가되었습니다.");
    } catch {
      showToast("직원 추가에 실패했습니다.");
    } finally {
      setAdding(false);
    }
  };

  const deletePerson = async () => {
    if (selectedId === null) return;
    if (
      !confirm("이 인사 전용 직원을 삭제하시겠습니까? (인사정보도 함께 삭제됩니다)")
    )
      return;
    try {
      const res = await fetch(api(`/api/personal-info/persons/${selectedId}`), {
        method: "DELETE",
      });
      if (!res.ok) {
        showToast("직원 삭제에 실패했습니다.");
        return;
      }
      await loadList();
      setDetail(null);
      setSelectedId(null);
      showToast("직원이 삭제되었습니다.");
    } catch {
      showToast("직원 삭제에 실패했습니다.");
    }
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
          직원 인사정보(제한된 권한자만 접근)
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* 좌측 목록 */}
        <div className="shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white lg:w-72">
          <div className="border-b border-gray-100 p-3">
            <button
              onClick={() => setAddOpen(true)}
              className="mb-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={15} />
              인사 전용 직원 추가
            </button>
            <div className="relative">
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
            {filtered.map((p) => (
              <button
                key={p.employeeId}
                onClick={() => selectEmployee(p.employeeId)}
                className={`block w-full border-b border-gray-50 px-4 py-3 text-left ${
                  p.employeeId === selectedId ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-gray-900">
                    {p.name}
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
            ))}
          </div>
        </div>

        {/* 우측 상세 */}
        <div className="min-w-0 flex-1 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          {detail ? (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {detail.hrName || detail.name}
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
                          인사정보 비우기
                        </button>
                      )}
                      {detail.isHrOnly && (
                        <button
                          onClick={deletePerson}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-100"
                        >
                          <Trash2 size={15} />
                          직원 삭제
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        onClick={save}
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
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
                        {field("입사일", detail.hiredAt?.slice(0, 10) ?? null)}
                        {field("국가연구자 번호", detail.researcherNumber)}
                      </div>
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
                          setShowResident,
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
                          setShowAccount,
                        )}
                        {field("예금주", detail.accountHolder)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
                      직원 신원(사번·이메일·입사일·소속·직책)은 근태에서 관리되어
                      여기선 조회만 됩니다. 이 화면에선 인사정보(성명·학위·통장 등)만
                      편집합니다.
                    </div>

                    {/* 신원(읽기 전용) */}
                    <div>
                      <h3 className="mb-2 text-xs font-bold text-gray-700">
                        신원 (근태 관리 · 읽기 전용)
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {readonlyField("사번", detail.employeeNo)}
                        {readonlyField("이메일", detail.email)}
                        {readonlyField(
                          "입사일",
                          detail.hiredAt?.slice(0, 10) ?? null,
                        )}
                      </div>
                    </div>

                    {/* 회사 */}
                    <div>
                      <h3 className="mb-2 text-xs font-bold text-gray-700">
                        회사
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {inputField("성명(한글)", "hrName")}
                        {inputField("직책", "hrPosition")}
                        {inputField("소속", "hrDepartment")}
                        {inputField("연락처", "hrPhone")}
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
                          "예: 2020-02",
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
                          "예: 000000-0000000",
                        )}
                        {inputField("주소", "address")}
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
              왼쪽에서 직원을 선택하세요
            </div>
          )}
        </div>
      </div>

      {/* 인사 전용 직원 추가 모달 */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="mb-1 text-base font-bold text-gray-900">
              인사 전용 직원 추가
            </h3>
            <p className="mb-4 text-xs text-gray-500">
              근태(출퇴근)에는 표시되지 않는 인사정보 전용 직원입니다.
            </p>
            <input
              autoFocus
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPerson()}
              placeholder="이름"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setAddOpen(false)}
                className="rounded-xl bg-gray-100 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={addPerson}
                disabled={adding}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
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
