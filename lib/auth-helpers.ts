import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { auth } from "@/auth";

const disableAuth = process.env.DISABLE_AUTH === "true";

function devSession(): Session {
  // 로컬 우회용 가짜 CEO
  return {
    user: {
      name: "개발자",
      email: "dev@vanam.local",
      role: "ceo",
      dbId: null,
      employeeId: null,
    },
  } as unknown as Session;
}

export async function requireSession(): Promise<
  { ok: true; session: Session } | { ok: false; response: NextResponse }
> {
  if (disableAuth) return { ok: true, session: devSession() };
  const session = await auth();
  if (!session?.user)
    return {
      ok: false,
      response: NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 },
      ),
    };
  return { ok: true, session };
}

export function isAdminSession(
  session: Session | null | undefined,
): boolean {
  const role = session?.user?.role;
  return role === "admin" || role === "ceo";
}

// admin·CEO 요구 (미로그인 401, 권한 없음 403)
export async function requireAdmin(): Promise<
  { ok: true; session: Session } | { ok: false; response: NextResponse }
> {
  const r = await requireSession();
  if (!r.ok) return r;
  if (!isAdminSession(r.session))
    return {
      ok: false,
      response: NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 },
      ),
    };
  return r;
}

// 인사정보 카드 접근 허용 employeeId (이동학=5). CEO는 role로 통과.
const PERSONAL_INFO_EMPLOYEE_IDS = new Set<number>([5]);

export function canViewPersonalInfo(
  session: Session | null | undefined,
): boolean {
  if (session?.user?.role === "ceo") return true;
  const empId = session?.user?.employeeId;
  return empId != null && PERSONAL_INFO_EMPLOYEE_IDS.has(empId);
}

// 인사정보 API 가드 (CEO 또는 이동학만 — admin도 차단)
export async function requirePersonalInfo(): Promise<
  { ok: true; session: Session } | { ok: false; response: NextResponse }
> {
  const r = await requireSession();
  if (!r.ok) return r;
  if (!canViewPersonalInfo(r.session))
    return {
      ok: false,
      response: NextResponse.json(
        { error: "인사정보 접근 권한이 없습니다." },
        { status: 403 },
      ),
    };
  return r;
}
