import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;
  try {
    const { id } = await params;
    await prisma.patentEvent.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "이벤트 삭제 실패" }, { status: 500 });
  }
}
