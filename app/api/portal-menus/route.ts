import { NextResponse } from "next/server";
import {
  canViewPersonalInfo,
  isAdminSession,
  requireSession,
} from "@/lib/auth-helpers";
import { visibleMenus } from "@/lib/menus";

export const runtime = "nodejs";

// 포털 런처용: 현재 사용자가 사이드바에서 볼 수 있는 메뉴 (사이드바 순서)
export async function GET() {
  const _auth = await requireSession();
  if (!_auth.ok) return _auth.response;
  const session = _auth.session;

  // 앱 전체가 admin·CEO 전용 (app/page.tsx 게이트와 동일)
  const menus = isAdminSession(session)
    ? visibleMenus({ canViewHr: canViewPersonalInfo(session) }).map((m) => ({
        page: m.key,
        label: m.label,
        icon: m.icon,
        adminOnly: false,
      }))
    : [];

  return NextResponse.json(
    { app: "office", menus },
    { headers: { "Cache-Control": "no-store" } },
  );
}
