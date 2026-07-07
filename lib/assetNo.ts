import { prisma } from "@/lib/prisma";

// 종류(일반/연구용) → 다음 장비번호 (R/S + 3자리). 경합 대비로 저장 시에도 이 함수로 재확정.
export async function nextAssetNo(kind: string): Promise<string> {
  const prefix = kind === "연구용" ? "S" : "R"; // 그 외는 일반(R)
  const existing = await prisma.asset.findMany({
    where: { assetNo: { startsWith: prefix } },
    select: { assetNo: true },
  });
  const re = new RegExp(`^${prefix}-?(\\d+)$`);
  let maxNum = 0;
  for (const a of existing) {
    const m = a.assetNo?.match(re);
    if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
  }
  return `${prefix}${String(maxNum + 1).padStart(3, "0")}`;
}
