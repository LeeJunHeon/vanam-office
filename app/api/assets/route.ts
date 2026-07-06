import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"; // Prisma는 edge 불가

// GET /api/assets — 장비 관리 대장 전체
// TODO: 인증 단계에서 requireSession + isAdminSession 가드 추가
export async function GET() {
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
// TODO: 인증 단계에서 requireSession + isAdminSession 가드 추가
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      purchaseDate,
      assetNo,
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

    const asset = await prisma.asset.create({
      data: {
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        assetNo: assetNo ?? null,
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
