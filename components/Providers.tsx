"use client";

import { SessionProvider } from "next-auth/react";

// basePath(/office) 하위에서 세션 조회가 나가도록 next-auth 클라이언트 basePath 지정
const authBasePath = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/auth`;

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider basePath={authBasePath}>{children}</SessionProvider>;
}
