import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export const runtime = "nodejs"; // Prisma는 edge 불가

// PATCH /api/assets/[id] — 장비 부분 수정
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;

  try {
    const { id } = await params;
    const body = await request.json();

    const asset = await prisma.asset.update({
      where: { id: Number(id) },
      data: {
        ...(body.purchaseDate !== undefined && {
          purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
        }),
        ...(body.assetNo !== undefined && { assetNo: body.assetNo }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.spec !== undefined && { spec: body.spec }),
        ...(body.quantity !== undefined && { quantity: Number(body.quantity) || 1 }),
        ...(body.price !== undefined && {
          price: body.price ? Number(body.price) : null,
        }),
        ...(body.vendor !== undefined && { vendor: body.vendor }),
        ...(body.purpose !== undefined && { purpose: body.purpose }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.managerPrimary !== undefined && {
          managerPrimary: body.managerPrimary,
        }),
        ...(body.managerSub !== undefined && { managerSub: body.managerSub }),
      },
    });

    return NextResponse.json(asset);
  } catch {
    return NextResponse.json(
      { error: "장비 수정에 실패했습니다." },
      { status: 500 },
    );
  }
}

// DELETE /api/assets/[id] — 장비 삭제
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;

  try {
    const { id } = await params;
    await prisma.asset.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "장비 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
