import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "standalone",
  ...(basePath ? { basePath } : {}),
  // next/image 를 쓰지 않으므로 이미지 최적화(/_next/image) 비활성화
  images: { unoptimized: true },
  // 첨부 폴더(uploads)가 standalone 추적에 들어가 실행 파일에 복사되지 않게 한다.
  // lib/uploadDir.ts 의 path.join(process.cwd(), "uploads") 때문에 첨부 API 추적에 잡힌다.
  // 키는 라우트 glob('/*' = 전체 라우트), 값은 프로젝트 루트 기준 glob. (.dockerignore 와 이중 안전장치)
  outputFileTracingExcludes: {
    "/*": ["./uploads/**/*"],
  },
  // 첨부 대용량 업로드 대비 요청 본문 버퍼 한도 상향 (기본 10MB)
  experimental: {
    proxyClientMaxBodySize: "100mb",
  },
};

export default nextConfig;
