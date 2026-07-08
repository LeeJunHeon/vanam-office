import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export const runtime = "nodejs";

export async function GET() {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;
  try {
    const [
      patents,
      assets,
      personalInfo,
      ipGroups,
      priceAgg,
      generalCount,
      researchCount,
      recentPatents,
      recentAssets,
    ] = await Promise.all([
      prisma.patent.count(),
      prisma.asset.count(),
      prisma.employeePersonalInfo.count(),
      prisma.patent.groupBy({ by: ["ipTypeCode"], _count: { _all: true } }),
      prisma.asset.aggregate({ _sum: { price: true } }),
      prisma.asset.count({ where: { assetNo: { startsWith: "R" } } }),
      prisma.asset.count({ where: { assetNo: { startsWith: "S" } } }),
      prisma.patent.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { name: true, createdAt: true },
      }),
      prisma.asset.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { name: true, assetNo: true, createdAt: true },
      }),
    ]);

    // ip_type 코드 → 버킷 집계
    const cnt = (codes: string[]) =>
      ipGroups
        .filter((g) => g.ipTypeCode != null && codes.includes(g.ipTypeCode))
        .reduce((s, g) => s + g._count._all, 0);
    const ipDist = {
      registered: cnt(["REGISTERED", "TRANSFERRED"]),
      applied: cnt(["APPLIED", "DIVISIONAL"]),
      certified: cnt(["CERTIFIED"]),
      rejected: cnt(["REJECTED"]),
    };

    const assetDist = {
      general: generalCount,
      research: researchCount,
      totalPrice: Number(priceAgg._sum.price ?? 0),
    };

    const recent = [
      ...recentPatents.map((p) => ({
        type: "지재권",
        name: p.name,
        sub: null as string | null,
        date: p.createdAt,
      })),
      ...recentAssets.map((a) => ({
        type: "장비",
        name: a.name,
        sub: a.assetNo,
        date: a.createdAt,
      })),
    ]
      .sort((x, y) => +new Date(y.date) - +new Date(x.date))
      .slice(0, 6);

    return NextResponse.json({
      patents,
      assets,
      personalInfo,
      ipDist,
      assetDist,
      recent,
    });
  } catch {
    return NextResponse.json({ error: "요약 조회 실패" }, { status: 500 });
  }
}
