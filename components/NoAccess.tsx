import { Lock } from "lucide-react";

export default function NoAccess() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
          <Lock size={24} />
        </div>
        <h1 className="text-base font-bold text-gray-900">
          접근 권한이 없습니다
        </h1>
        <p className="text-sm text-gray-500">
          경영지원은 관리자·대표(admin·CEO) 전용입니다.
        </p>
        <a
          href="https://vanam.synology.me"
          className="mt-1 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-600"
        >
          포털로 이동
        </a>
      </div>
    </div>
  );
}
