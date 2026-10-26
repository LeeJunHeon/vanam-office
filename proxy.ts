import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEV_AUTH_BYPASS } from "./lib/dev-auth-bypass";

const { auth } = NextAuth(authConfig);
const isLocal =
  !process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost");

export default auth((req: NextRequest & { auth: any }) => {
  const bp = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const pathname =
    bp && req.nextUrl.pathname.startsWith(bp)
      ? req.nextUrl.pathname.slice(bp.length) || "/"
      : req.nextUrl.pathname;

  if (DEV_AUTH_BYPASS) return NextResponse.next(); // 로컬 우회 (개발 모드 전용, lib/dev-auth-bypass.ts)

  if (pathname.startsWith("/api/auth")) return NextResponse.next();
  if (pathname.startsWith("/login")) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    if (!req.auth?.user)
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 },
      );
    return NextResponse.next();
  }

  // 정적 자산(아이콘, manifest 등)은 인증 없이 통과.
  // /api/ 블록 뒤에 두어 .json 등으로 끝나는 API 경로가 인증을 우회하지 않게 한다.
  if (/\.(?:json|js|png|jpg|jpeg|gif|svg|ico|webmanifest)$/.test(pathname))
    return NextResponse.next();

  if (!req.auth?.user) {
    return NextResponse.redirect(
      new URL("/login", isLocal ? req.url : "https://vanam.synology.me"),
    );
  }
  return NextResponse.next();
});

export const config = {
  // basePath 를 쓰면 Next 가 matcher 앞에 basePath 를 붙여 아래 정규식이 "/<앱경로>/(...)" 가 되어
  // 앱 첫 화면("/<앱경로>")에는 proxy 가 돌지 않는다. "/" 는 Next 가 루트 전용 패턴
  // (루트 + RSC 전송 형태)으로 따로 처리하므로, 넣어야 첫 화면도 인증 검사를 받는다.
  matcher: ["/", "/api/((?!auth).*)", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
