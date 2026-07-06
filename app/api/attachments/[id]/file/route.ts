import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { uploadDir } from "@/lib/uploadDir";

export const runtime = "nodejs"; // Prisma·fs는 edge 불가

// GET /api/attachments/[id]/file[?download=1] — 파일 스트리밍(inline/attachment)
// TODO: 인증 단계에서 requireSession + isAdminSession 가드 추가
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const row = await prisma.attachment.findUnique({
      where: { id: Number(id) },
    });

    if (!row) {
      return NextResponse.json(
        { error: "첨부를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const buf = await fs.readFile(path.join(uploadDir(), row.storedPath));

    const { searchParams } = new URL(request.url);
    const download = searchParams.get("download") === "1";

    return new NextResponse(buf, {
      headers: {
        "Content-Type": row.mimeType || "application/octet-stream",
        "Content-Disposition": `${
          download ? "attachment" : "inline"
        }; filename*=UTF-8''${encodeURIComponent(row.originalName)}`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "파일을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
