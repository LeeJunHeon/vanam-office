import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);
const isLocal =
  !process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost");
const disableAuth = process.env.DISABLE_AUTH === "true"; // 로컬 UI 확인용. 운영 금지.

export default auth((req: NextRequest & { auth: any }) => {
  const bp = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const pathname =
    bp && req.nextUrl.pathname.startsWith(bp)
      ? req.nextUrl.pathname.slice(bp.length) || "/"
      : req.nextUrl.pathname;

  if (disableAuth) return NextResponse.next(); // 로컬 우회

  if (pathname.startsWith("/api/auth")) return NextResponse.next();
  if (pathname.startsWith("/login")) return NextResponse.next();
  if (/\.(?:json|js|png|jpg|jpeg|gif|svg|ico|webmanifest)$/.test(pathname))
    return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    if (!req.auth?.user)
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 },
      );
    return NextResponse.next();
  }
  if (!req.auth?.user) {
    return NextResponse.redirect(
      new URL("/login", isLocal ? req.url : "https://vanam.synology.me"),
    );
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/api/((?!auth).*)", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
