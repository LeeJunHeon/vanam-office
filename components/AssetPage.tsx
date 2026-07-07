"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import type { Asset } from "@/lib/types";
import { api } from "@/lib/api";
import { assetKind, ASSET_KIND_BADGE } from "@/lib/lookups";
import { useLookups } from "@/lib/useLookups";
import AssetFormModal from "@/components/AssetFormModal";
import AttachmentManager from "@/components/AttachmentManager";

function KindBadge({ assetNo }: { assetNo: string | null }) {
  const kind = assetKind(assetNo ?? "");
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${ASSET_KIND_BADGE[kind]}`}
    >
      {kind}
    </span>
  );
}

function fmtPrice(price: string | null): string {
  if (price == null || price === "") return "-";
  return `${Number(price).toLocaleString()}원`;
}

const filters = ["all", "연구용", "일반"] as const;
type Filter = (typeof filters)[number];
const filterLabel: Record<Filter, string> = {
  all: "전체",
  연구용: "연구용",
  일반: "일반",
};

export default function AssetPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Asset | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);
  const [toast, setToast] = useState("");

  const { lookups } = useLookups();
  const assetDocTypes = lookups.asset_doc_type ?? [];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const load = useCallback(async () => {
    try {
      const res = await fetch(api("/api/assets"));
      if (!res.ok) return;
      setAssets(await res.json());
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible =
    filter === "all"
      ? assets
      : assets.filter((a) => assetKind(a.assetNo ?? "") === filter);

  const openRegister = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (a: Asset) => {
    setEditing(a);
    setModalOpen(true);
  };

  const handleSubmit = async (payload: {
    purchaseDate: string;
    assetNo: string;
    name: string;
    spec: string;
    quantity: string;
    price: string;
    vendor: string;
    purpose: string;
    location: string;
    managerPrimary: string;
    managerSub: string;
  }) => {
    try {
      const res = editing
        ? await fetch(api(`/api/assets/${editing.id}`), {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(api("/api/assets"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      if (!res.ok) {
        showToast("저장에 실패했습니다.");
        return;
      }
      await load();
      setModalOpen(false);
      if (editing) {
        const updated = await res.json();
        setSelected((cur) => (cur && cur.id === updated.id ? updated : cur));
      }
      showToast(editing ? "수정되었습니다." : "등록되었습니다.");
    } catch {
      showToast("저장에 실패했습니다.");
    }
  };

  const handleDelete = async (a: Asset) => {
    if (!confirm("삭제하시겠습니까?")) return;
    try {
      const res = await fetch(api(`/api/assets/${a.id}`), { method: "DELETE" });
      if (!res.ok) {
        showToast("삭제에 실패했습니다.");
        return;
      }
      await load();
      setSelected(null);
      showToast("삭제되었습니다.");
    } catch {
      showToast("삭제에 실패했습니다.");
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
            비품·자산 관리
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            회사 구매 장비·비품 관리 대장
          </p>
        </div>
        <button
          onClick={openRegister}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-600"
        >
          <Plus size={16} />
          장비 등록
        </button>
      </div>

      {modalOpen && (
        <AssetFormModal
          initial={editing ?? undefined}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {selected ? (
        <AssetDetail
          asset={selected}
          docTypes={assetDocTypes}
          onBack={() => setSelected(null)}
          onEdit={() => openEdit(selected)}
          onDelete={() => handleDelete(selected)}
        />
      ) : (
        <>
          {/* 필터칩 */}
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                  filter === f
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {filterLabel[f]}
              </button>
            ))}
          </div>

          {/* 테이블 */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {[
                      "구입일자",
                      "장비번호",
                      "장비명",
                      "규격",
                      "수량",
                      "구입금액(원)",
                      "구입처",
                      "용도",
                      "설치장소",
                      "관리자_정",
                      "관리자_부",
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
                  {visible.map((a) => (
                    <tr
                      key={a.id}
                      onClick={() => setSelected(a)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {a.purchaseDate?.slice(0, 10) || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium">{a.assetNo || "-"}</div>
                        <div className="mt-1">
                          <KindBadge assetNo={a.assetNo} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {a.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {a.spec || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {a.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {fmtPrice(a.price)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {a.vendor || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {a.purpose || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {a.location || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {a.managerPrimary || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {a.managerSub || "-"}
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

function AssetDetail({
  asset,
  docTypes,
  onBack,
  onEdit,
  onDelete,
}: {
  asset: Asset;
  docTypes: { code: string; label: string }[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
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

      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-gray-900">{asset.name}</h2>
        <KindBadge assetNo={asset.assetNo} />
      </div>

      {/* 기본정보 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="구입일자" value={asset.purchaseDate?.slice(0, 10) || "-"} />
          <Field label="장비번호" value={asset.assetNo || "-"} />
          <Field label="규격" value={asset.spec || "-"} />
          <Field label="수량" value={String(asset.quantity)} />
          <Field label="구입금액" value={fmtPrice(asset.price)} />
          <Field label="구입처" value={asset.vendor || "-"} />
          <Field label="용도" value={asset.purpose || "-"} />
          <Field label="설치장소" value={asset.location || "-"} />
          <Field label="관리자_정" value={asset.managerPrimary || "-"} />
          <Field label="관리자_부" value={asset.managerSub || "-"} />
        </div>
      </div>

      {/* 첨부 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">관련 서류</h3>
        <AttachmentManager
          entityType="asset"
          entityId={asset.id}
          docTypes={docTypes}
        />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm text-gray-900">{value}</p>
    </div>
  );
}
