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
      patentsWithEvents,
      priceAgg,
      generalCount,
      researchCount,
      recentPatents,
      recentAssets,
    ] = await Promise.all([
      prisma.patent.count(),
      prisma.asset.count(),
      prisma.employeePersonalInfo.count(),
      prisma.patent.findMany({
        select: {
          id: true,
          events: { select: { id: true, eventType: true, eventDate: true } },
        },
      }),
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

    // 이벤트 현재상태(가장 최근) → 버킷 집계
    const latestStatus = (
      events: { id: number; eventType: string; eventDate: Date | null }[],
    ) => {
      if (!events || events.length === 0) return null;
      const sorted = [...events].sort((a, b) => {
        const da = a.eventDate ? +new Date(a.eventDate) : 0;
        const db = b.eventDate ? +new Date(b.eventDate) : 0;
        if (da !== db) return da - db;
        return a.id - b.id;
      });
      return sorted[sorted.length - 1].eventType;
    };
    const sc: Record<string, number> = {
      REGISTERED: 0,
      TRANSFERRED: 0,
      APPLIED: 0,
      DIVISIONAL: 0,
      CERTIFIED: 0,
      REJECTED: 0,
    };
    for (const p of patentsWithEvents) {
      const s = latestStatus(p.events);
      if (s && s in sc) sc[s] += 1;
    }
    const ipDist = {
      registered: sc.REGISTERED + sc.TRANSFERRED,
      applied: sc.APPLIED + sc.DIVISIONAL,
      certified: sc.CERTIFIED,
      rejected: sc.REJECTED,
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
