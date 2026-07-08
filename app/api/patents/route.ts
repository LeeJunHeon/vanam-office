import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export const runtime = "nodejs"; // Prisma는 edge 불가

// GET /api/patents — 지식재산권 대장 전체
export async function GET() {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;

  try {
    const patents = await prisma.patent.findMany({
      orderBy: { id: "desc" },
      include: { events: { orderBy: [{ eventDate: "asc" }, { id: "asc" }] } },
    });
    return NextResponse.json(patents);
  } catch {
    return NextResponse.json(
      { error: "특허 목록을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

// POST /api/patents — 지식재산권 등록
export async function POST(request: Request) {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;

  try {
    const body = await request.json();
    const {
      ipTypeCode,
      countryCode,
      ipKindCode,
      name,
      number,
      manager,
      note,
      firstEvent,
    } = body ?? {};

    if (!name) {
      return NextResponse.json({ error: "name은 필수입니다." }, { status: 400 });
    }

    const patent = await prisma.patent.create({
      data: {
        ipTypeCode: ipTypeCode ?? null,
        countryCode: countryCode ?? null,
        ipKindCode: ipKindCode ?? null,
        name,
        number: number ?? null,
        manager: manager ?? null,
        note: note ?? null,
        ...(firstEvent?.eventType
          ? {
              events: {
                create: {
                  eventType: firstEvent.eventType,
                  eventDate: firstEvent.eventDate
                    ? new Date(firstEvent.eventDate)
                    : null,
                },
              },
            }
          : {}),
      },
      include: { events: true },
    });

    return NextResponse.json(patent, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "특허 등록에 실패했습니다." },
      { status: 500 },
    );
  }
}
