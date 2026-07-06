import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"; // Prisma는 edge 불가

// GET /api/patents — 지식재산권 대장 전체
// TODO: 인증 단계에서 requireSession + isAdminSession 가드 추가
export async function GET() {
  try {
    const patents = await prisma.patent.findMany({ orderBy: { id: "desc" } });
    return NextResponse.json(patents);
  } catch {
    return NextResponse.json(
      { error: "특허 목록을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

// POST /api/patents — 지식재산권 등록
// TODO: 인증 단계에서 requireSession + isAdminSession 가드 추가
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ipTypeCode, name, number, manager, note } = body ?? {};

    if (!name || !ipTypeCode) {
      return NextResponse.json(
        { error: "name, ipTypeCode는 필수입니다." },
        { status: 400 },
      );
    }

    const patent = await prisma.patent.create({
      data: {
        ipTypeCode,
        name,
        number: number ?? null,
        manager: manager ?? null,
        note: note ?? null,
      },
    });

    return NextResponse.json(patent, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "특허 등록에 실패했습니다." },
      { status: 500 },
    );
  }
}
