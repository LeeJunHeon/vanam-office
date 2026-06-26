import { IdCard, ExternalLink } from "lucide-react";

export default function HrPage() {
  return (
    <div className="space-y-5 p-4 sm:p-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">인사관리</h1>
        <p className="mt-0.5 text-sm text-gray-500">직원 인사정보 카드</p>
      </div>

      <div className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <IdCard size={24} />
        </div>
        <h2 className="mt-4 text-base font-bold text-gray-900">
          인사정보 카드는 근태관리에서 관리됩니다
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          성명·소속·학위·급여통장 등 직원 인사정보는 근태관리 시스템의 인사정보
          카드와 동일한 데이터입니다. 보안 일관성을 위해 한 곳에서 관리하고,
          여기서는 바로 이동만 합니다.
        </p>
        {/* TODO: 실제 근태 URL */}
        <a
          href="#"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-600"
        >
          <ExternalLink size={16} />
          근태관리에서 열기
        </a>
      </div>
    </div>
  );
}
