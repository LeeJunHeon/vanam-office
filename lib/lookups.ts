// 룩업/코드 상수 모음
// TODO: 추후 DB 룩업 테이블로 이전

export const IP_TYPES = [
  "등록",
  "등록-기술이전",
  "출원",
  "거절",
  "분할 출원",
  "인증",
] as const;
export type IpType = (typeof IP_TYPES)[number];

export const IP_TYPE_BADGE: Record<IpType, string> = {
  등록: "bg-emerald-50 text-emerald-700",
  "등록-기술이전": "bg-teal-50 text-teal-700",
  출원: "bg-blue-50 text-blue-700",
  거절: "bg-rose-50 text-rose-700",
  "분할 출원": "bg-amber-50 text-amber-700",
  인증: "bg-violet-50 text-violet-700",
};

export const PATENT_DOC_TYPES = ["출원사실 증명서", "등록증", "인증서"];

export const ASSET_DOC_TYPES = [
  "계약서",
  "거래명세서",
  "전자세금계산서",
  "입금내역확인증",
  "카드매출전표",
  "증빙사진",
];

// 장비번호 접두사 → 구분
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
