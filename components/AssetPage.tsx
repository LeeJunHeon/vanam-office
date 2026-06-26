"use client";

import { useState } from "react";
import { Plus, ArrowLeft, FileText, Pencil, Trash2 } from "lucide-react";
import { assets as mockAssets, type Asset } from "@/lib/mockData";
import { assetKind, ASSET_KIND_BADGE, ASSET_DOC_TYPES } from "@/lib/lookups";
import AssetFormModal from "@/components/AssetFormModal";
import AttachmentField from "@/components/AttachmentField";

function KindBadge({ assetNo }: { assetNo: string }) {
  const kind = assetKind(assetNo);
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${ASSET_KIND_BADGE[kind]}`}
    >
      {kind}
    </span>
  );
}

const filters = ["전체", "연구용", "일반"] as const;

export default function AssetPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("전체");
  const [list, setList] = useState<Asset[]>(mockAssets);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Asset | null>(null);
  const [selected, setSelected] = useState<Asset | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const visible =
    filter === "전체"
      ? list
      : list.filter((a) => assetKind(a.assetNo) === filter);

  const handleSubmit = (a: Asset) => {
    if (editTarget) {
      setList((prev) => prev.map((x) => (x.id === a.id ? a : x)));
      setSelected((cur) => (cur && cur.id === a.id ? a : cur));
      showToast("수정되었습니다.");
    } else {
      setList((prev) => [a, ...prev]);
      showToast("등록되었습니다.");
    }
  };

  const handleDelete = (a: Asset) => {
    if (!confirm("삭제하시겠습니까?")) return;
    setList((prev) => prev.filter((x) => x.id !== a.id));
    setSelected(null);
    showToast("삭제되었습니다.");
  };

  const openRegister = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (a: Asset) => {
    setEditTarget(a);
    setModalOpen(true);
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
          initial={editTarget ?? undefined}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {selected ? (
        <AssetDetail
          asset={selected}
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
                {f}
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
                        {a.purchaseDate}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium">{a.assetNo}</div>
                        <div className="mt-1">
                          <KindBadge assetNo={a.assetNo} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {a.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {a.spec}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {a.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {a.price.toLocaleString()}원
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {a.vendor}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {a.purpose}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {a.location}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {a.managerPrimary}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {a.managerSub}
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
  onBack,
  onEdit,
  onDelete,
}: {
  asset: Asset;
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
          <Field label="구입일자" value={asset.purchaseDate} />
          <Field label="장비번호" value={asset.assetNo} />
          <Field label="규격" value={asset.spec} />
          <Field label="수량" value={String(asset.quantity)} />
          <Field label="구입금액" value={`${asset.price.toLocaleString()}원`} />
          <Field label="구입처" value={asset.vendor} />
          <Field label="용도" value={asset.purpose} />
          <Field label="설치장소" value={asset.location} />
          <Field label="관리자_정" value={asset.managerPrimary} />
          <Field label="관리자_부" value={asset.managerSub} />
        </div>
      </div>

      {/* 첨부 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          관련 서류 ({asset.docs.length})
        </h3>
        <AttachmentField
          files={asset.docs}
          onChange={() => {}}
          docTypes={ASSET_DOC_TYPES}
          editable={false}
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
