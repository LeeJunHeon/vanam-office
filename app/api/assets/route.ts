import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export const runtime = "nodejs"; // Prisma는 edge 불가

// GET /api/assets — 장비 관리 대장 전체
export async function GET() {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;

  try {
    const assets = await prisma.asset.findMany({ orderBy: { id: "desc" } });
    return NextResponse.json(assets);
  } catch {
    return NextResponse.json(
      { error: "장비 목록을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

// POST /api/assets — 장비 등록
export async function POST(request: Request) {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;

  try {
    const body = await request.json();
    const {
      purchaseDate,
      kind,
      name,
      spec,
      quantity,
      price,
      vendor,
      purpose,
      location,
      managerPrimary,
      managerSub,
    } = body ?? {};

    if (!name) {
      return NextResponse.json({ error: "name은 필수입니다." }, { status: 400 });
    }

    // 장비번호 자동 생성: 연구용→S, 그 외(일반)→R, 같은 접두사 최대 숫자 + 1 (3자리 zero-pad)
    const prefix = kind === "연구용" ? "S" : "R";
    const existing = await prisma.asset.findMany({
      where: { assetNo: { startsWith: prefix } },
      select: { assetNo: true },
    });
    const re = new RegExp(`^${prefix}-?(\\d+)$`);
    let maxNum = 0;
    for (const a of existing) {
      const m = a.assetNo?.match(re);
      if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
    }
    const assetNo = `${prefix}${String(maxNum + 1).padStart(3, "0")}`;

    const asset = await prisma.asset.create({
      data: {
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        assetNo,
        name,
        spec: spec ?? null,
        quantity: Number(quantity) || 1,
        price: price ? Number(price) : null,
        vendor: vendor ?? null,
        purpose: purpose ?? null,
        location: location ?? null,
        managerPrimary: managerPrimary ?? null,
        managerSub: managerSub ?? null,
      },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "장비 등록에 실패했습니다." },
      { status: 500 },
    );
  }
}
