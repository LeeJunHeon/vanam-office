import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PersonalDetail } from "@/lib/types";

export const runtime = "nodejs"; // Prisma는 edge 불가

// GET /api/personal-info/[employeeId] — 신원(hr 읽기) + 인사정보(office)
// TODO: 인증 단계에서 requireSession + isAdminSession 가드 추가
export async function GET(
  request: Request,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  try {
    const { employeeId } = await params;
    const e = await prisma.employee.findUnique({
      where: { id: Number(employeeId) },
      include: { department: true, position: true, personalInfo: true },
    });

    if (!e) {
      return NextResponse.json(
        { error: "직원을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const pi = e.personalInfo;
    const detail: PersonalDetail = {
      employeeId: e.id,
      // hr 신원(읽기 전용)
      name: e.name,
      employeeNo: e.employeeNo,
      email: e.email,
      hiredAt: e.hiredAt ? e.hiredAt.toISOString() : null,
      positionName: e.position?.name ?? null,
      departmentName: e.department?.name ?? null,
      isHrOnly: e.isHrOnly,
      // office 인사정보(편집 가능)
      hasInfo: !!pi,
      hrName: pi?.hrName ?? null,
      hrPosition: pi?.hrPosition ?? null,
      hrDepartment: pi?.hrDepartment ?? null,
      hrPhone: pi?.hrPhone ?? null,
      researcherNumber: pi?.researcherNumber ?? null,
      university: pi?.university ?? null,
      finalDegree: pi?.finalDegree ?? null,
      major: pi?.major ?? null,
      graduationYearmonth: pi?.graduationYearmonth ?? null,
      degreeNumber: pi?.degreeNumber ?? null,
      residentNumber: pi?.residentNumber ?? null,
      address: pi?.address ?? null,
      bankName: pi?.bankName ?? null,
      accountNumber: pi?.accountNumber ?? null,
      accountHolder: pi?.accountHolder ?? null,
    };

    return NextResponse.json(detail);
  } catch {
    return NextResponse.json(
      { error: "인사정보를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

// PUT /api/personal-info/[employeeId] — office 인사정보만 upsert(hr 필드엔 쓰지 않음)
// TODO: 인증 단계에서 requireSession + isAdminSession 가드 추가
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  try {
    const { employeeId } = await params;
    const body = await request.json();

    // office 편집 가능 필드만 추출 (사번·이메일·입사일 등 hr 필드는 절대 쓰지 않음)
    const data = {
      hrName: body.hrName ?? null,
      hrPosition: body.hrPosition ?? null,
      hrDepartment: body.hrDepartment ?? null,
      hrPhone: body.hrPhone ?? null,
      researcherNumber: body.researcherNumber ?? null,
      university: body.university ?? null,
      finalDegree: body.finalDegree ?? null,
      major: body.major ?? null,
      graduationYearmonth: body.graduationYearmonth ?? null,
      degreeNumber: body.degreeNumber ?? null,
      residentNumber: body.residentNumber ?? null,
      address: body.address ?? null,
      bankName: body.bankName ?? null,
      accountNumber: body.accountNumber ?? null,
      accountHolder: body.accountHolder ?? null,
    };

    await prisma.employeePersonalInfo.upsert({
      where: { employeeId: Number(employeeId) },
      create: { employeeId: Number(employeeId), ...data },
      update: data,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "인사정보 저장에 실패했습니다." },
      { status: 500 },
    );
  }
}

// DELETE /api/personal-info/[employeeId] — 인사정보만 비움(직원은 삭제하지 않음)
// TODO: 인증 단계에서 requireSession + isAdminSession 가드 추가
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  try {
    const { employeeId } = await params;
    await prisma.employeePersonalInfo.deleteMany({
      where: { employeeId: Number(employeeId) },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "인사정보 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
