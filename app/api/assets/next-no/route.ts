import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { nextAssetNo } from "@/lib/assetNo";

export const runtime = "nodejs";

// GET /api/assets/next-no?kind=일반|연구용
export async function GET(request: Request) {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind") ?? "일반";
  try {
    const assetNo = await nextAssetNo(kind);
    return NextResponse.json({ assetNo });
  } catch {
    return NextResponse.json({ error: "번호 조회 실패" }, { status: 500 });
  }
}
