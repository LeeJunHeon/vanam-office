import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export const runtime = "nodejs"; // Prisma는 edge 불가

// GET /api/lookups — 활성 룩업을 category별로 그룹핑해서 반환
export async function GET() {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;

  try {
    const rows = await prisma.codeLookup.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });

    const grouped: Record<
      string,
      { code: string; label: string; color: string | null; sortOrder: number }[]
    > = {};

    for (const row of rows) {
      (grouped[row.category] ??= []).push({
        code: row.code,
        label: row.label,
        color: row.color,
        sortOrder: row.sortOrder,
      });
    }

    return NextResponse.json(grouped);
  } catch {
    return NextResponse.json(
      { error: "룩업 목록을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
