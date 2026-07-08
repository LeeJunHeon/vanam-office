import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export const runtime = "nodejs"; // Prisma는 edge 불가

// PATCH /api/patents/[id] — 지식재산권 부분 수정
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;

  try {
    const { id } = await params;
    const body = await request.json();

    const patent = await prisma.patent.update({
      where: { id: Number(id) },
      data: {
        ...(body.ipTypeCode !== undefined && { ipTypeCode: body.ipTypeCode }),
        ...(body.countryCode !== undefined && { countryCode: body.countryCode }),
        ...(body.ipKindCode !== undefined && { ipKindCode: body.ipKindCode }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.number !== undefined && { number: body.number }),
        ...(body.manager !== undefined && { manager: body.manager }),
        ...(body.note !== undefined && { note: body.note }),
      },
    });

    return NextResponse.json(patent);
  } catch {
    return NextResponse.json(
      { error: "특허 수정에 실패했습니다." },
      { status: 500 },
    );
  }
}

// DELETE /api/patents/[id] — 지식재산권 삭제
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;

  try {
    const { id } = await params;
    await prisma.patent.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "특허 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
