import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export const runtime = "nodejs";

export async function GET() {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;
  try {
    const [patents, assets, personalInfo] = await Promise.all([
      prisma.patent.count(),
      prisma.asset.count(),
      prisma.employeePersonalInfo.count(),
    ]);
    return NextResponse.json({ patents, assets, personalInfo });
  } catch {
    return NextResponse.json({ error: "요약 조회 실패" }, { status: 500 });
  }
}
