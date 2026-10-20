import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "standalone",
  ...(basePath ? { basePath } : {}),
  // next/image 를 쓰지 않으므로 이미지 최적화(/_next/image) 비활성화
  images: { unoptimized: true },
  // 첨부 대용량 업로드 대비 요청 본문 버퍼 한도 상향 (기본 10MB)
  experimental: {
    proxyClientMaxBodySize: "100mb",
  },
};

export default nextConfig;
