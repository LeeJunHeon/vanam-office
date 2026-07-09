import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePersonalInfo } from "@/lib/auth-helpers";

export const runtime = "nodejs"; // Prisma는 edge 불가

// POST /api/personal-info/persons — 인사 전용 직원 생성
export async function POST(request: Request) {
  const _auth = await requirePersonalInfo();
  if (!_auth.ok) return _auth.response;

  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";

    if (!name) {
      return NextResponse.json({ error: "name은 필수입니다." }, { status: 400 });
    }

    // WHY: office는 hr.employees에 '인사 전용(is_hr_only=true)' 직원만 만든다.
    // 출퇴근 직원 생성은 근태 소관이며 office는 그런 직원을 생성하지 않는다.
    const created = await prisma.employee.create({
      data: { name, isHrOnly: true, isActive: true },
    });

    return NextResponse.json({ employeeId: created.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "직원 추가에 실패했습니다." },
      { status: 500 },
    );
  }
}
