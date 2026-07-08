import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export const runtime = "nodejs";

// GET — 기본: category별 그룹(폼용) / ?manage=1: 관리용 flat 목록(id 포함, 비활성 포함)
export async function GET(request: Request) {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;
  try {
    const { searchParams } = new URL(request.url);
    const manage = searchParams.get("manage");
    const category = searchParams.get("category");

    if (manage) {
      const rows = await prisma.codeLookup.findMany({
        where: { ...(category ? { category } : {}) },
        orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      });
      return NextResponse.json(rows);
    }

    const rows = await prisma.codeLookup.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });
    const grouped: Record<string, { code: string; label: string; color: string | null; sortOrder: number }[]> = {};
    for (const row of rows) {
      (grouped[row.category] ??= []).push({ code: row.code, label: row.label, color: row.color, sortOrder: row.sortOrder });
    }
    return NextResponse.json(grouped);
  } catch {
    return NextResponse.json({ error: "룩업 목록을 불러오지 못했습니다." }, { status: 500 });
  }
}

// POST — 생성
export async function POST(request: Request) {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;
  try {
    const body = await request.json();
    const { category, code, label, color, sortOrder, description } = body ?? {};
    if (!category?.trim() || !code?.trim() || !label?.trim()) {
      return NextResponse.json({ error: "카테고리, 코드, 라벨은 필수입니다." }, { status: 400 });
    }
    const exists = await prisma.codeLookup.findFirst({ where: { category: category.trim(), code: code.trim() } });
    if (exists) return NextResponse.json({ error: "이미 존재하는 코드입니다." }, { status: 409 });
    const created = await prisma.codeLookup.create({
      data: {
        category: category.trim(),
        code: code.trim(),
        label: label.trim(),
        color: color?.trim() || null,
        sortOrder: Number(sortOrder) || 0,
        description: description?.trim() || null,
        isSystem: false,
        isActive: true,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "룩업 추가 실패" }, { status: 500 });
  }
}

// PUT ?id= — 수정 (label/color/sortOrder/description/isActive)
export async function PUT(request: Request) {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id는 필수입니다." }, { status: 400 });
    const body = await request.json();
    const updated = await prisma.codeLookup.update({
      where: { id: Number(id) },
      data: {
        ...(body.label !== undefined && { label: String(body.label).trim() }),
        ...(body.color !== undefined && { color: body.color ? String(body.color).trim() : null }),
        ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) || 0 }),
        ...(body.description !== undefined && { description: body.description ? String(body.description).trim() : null }),
        ...(body.isActive !== undefined && { isActive: !!body.isActive }),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "룩업 수정 실패" }, { status: 500 });
  }
}

// DELETE ?id= — 삭제 (시스템 룩업 불가)
export async function DELETE(request: Request) {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id는 필수입니다." }, { status: 400 });
    const row = await prisma.codeLookup.findUnique({ where: { id: Number(id) } });
    if (!row) return NextResponse.json({ error: "없는 항목입니다." }, { status: 404 });
    if (row.isSystem) return NextResponse.json({ error: "시스템 룩업은 삭제할 수 없습니다." }, { status: 400 });
    await prisma.codeLookup.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "룩업 삭제 실패" }, { status: 500 });
  }
}
