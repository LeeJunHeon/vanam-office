// 룩업/코드 상수 모음
// 지재권 종류·서류 종류는 DB(office.code_lookups)에서 온다 → /api/lookups + useLookups.

// 룩업 color → 뱃지 클래스
export const COLOR_BADGE: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-700",
  teal: "bg-teal-50 text-teal-700",
  blue: "bg-blue-50 text-blue-700",
  rose: "bg-rose-50 text-rose-700",
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-violet-50 text-violet-700",
  gray: "bg-gray-100 text-gray-600",
};

export function badgeClass(color?: string | null) {
  return (color && COLOR_BADGE[color]) || COLOR_BADGE.gray;
}

// 장비번호 접두사 → 구분 (S=연구용, R=일반)
export const ASSET_PREFIX: Record<string, string> = { S: "연구용", R: "일반" };

export function assetKind(assetNo: string): "연구용" | "일반" | "기타" {
  const c = assetNo?.trim().charAt(0).toUpperCase();
  return c === "S" ? "연구용" : c === "R" ? "일반" : "기타";
}

export const ASSET_KIND_BADGE: Record<string, string> = {
  연구용: "bg-blue-50 text-blue-700",
  일반: "bg-gray-100 text-gray-600",
  기타: "bg-gray-100 text-gray-500",
};
