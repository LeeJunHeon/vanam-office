import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePersonalInfo } from "@/lib/auth-helpers";

export const runtime = "nodejs"; // Prisma는 edge 불가

// DELETE /api/personal-info/persons/[employeeId] — 인사 전용 직원 삭제
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  const _auth = await requirePersonalInfo();
  if (!_auth.ok) return _auth.response;

  try {
    const { employeeId } = await params;

    const target = await prisma.employee.findUnique({
      where: { id: Number(employeeId) },
      select: { isHrOnly: true },
    });

    if (!target) {
      return NextResponse.json(
        { error: "직원을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 실직원(출퇴근) 삭제 방지 안전장치 — office는 인사 전용 직원만 삭제한다.
    if (!target.isHrOnly) {
      return NextResponse.json(
        { error: "출퇴근 직원은 삭제할 수 없습니다." },
        { status: 400 },
      );
    }

    // office.employee_personal_info는 FK ON DELETE CASCADE로 함께 삭제됨
    await prisma.employee.delete({ where: { id: Number(employeeId) } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "직원 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
