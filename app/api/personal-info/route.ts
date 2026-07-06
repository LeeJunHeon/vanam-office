import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import type { PersonalListItem } from "@/lib/types";

export const runtime = "nodejs"; // Prisma는 edge 불가

// GET /api/personal-info — 재직 직원 목록(신원은 hr에서 읽기 전용)
export async function GET() {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;

  try {
    const employees = await prisma.employee.findMany({
      where: { isActive: true },
      orderBy: [{ hrSortOrder: { sort: "asc", nulls: "last" } }, { name: "asc" }],
      include: {
        department: true,
        position: true,
        personalInfo: { select: { id: true } },
      },
    });

    const list: PersonalListItem[] = employees.map((e) => ({
      employeeId: e.id,
      name: e.name,
      employeeNo: e.employeeNo,
      positionName: e.position?.name ?? null,
      departmentName: e.department?.name ?? null,
      isHrOnly: e.isHrOnly,
      hasInfo: !!e.personalInfo,
    }));

    return NextResponse.json(list);
  } catch {
    return NextResponse.json(
      { error: "직원 목록을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
