import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;
  const { searchParams } = new URL(request.url);
  const patentId = searchParams.get("patentId");
  if (!patentId)
    return NextResponse.json(
      { error: "patentId는 필수입니다." },
      { status: 400 },
    );
  try {
    const events = await prisma.patentEvent.findMany({
      where: { patentId: Number(patentId) },
      orderBy: [{ eventDate: "asc" }, { id: "asc" }],
    });
    return NextResponse.json(events);
  } catch {
    return NextResponse.json({ error: "이벤트 조회 실패" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;
  try {
    const body = await request.json();
    const { patentId, eventType, eventDate, note } = body ?? {};
    if (!patentId || !eventType)
      return NextResponse.json(
        { error: "patentId, eventType은 필수입니다." },
        { status: 400 },
      );
    const event = await prisma.patentEvent.create({
      data: {
        patentId: Number(patentId),
        eventType,
        eventDate: eventDate ? new Date(eventDate) : null,
        note: note ?? null,
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json({ error: "이벤트 추가 실패" }, { status: 500 });
  }
}
