import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { uploadDir } from "@/lib/uploadDir";

export const runtime = "nodejs"; // Prisma·fs는 edge 불가

// DELETE /api/attachments/[id] — 파일 삭제(파일시스템 + DB)
// TODO: 인증 단계에서 requireSession + isAdminSession 가드 추가
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const row = await prisma.attachment.findUnique({
      where: { id: Number(id) },
    });

    if (row) {
      try {
        await fs.unlink(path.join(uploadDir(), row.storedPath));
      } catch {
        // 파일이 이미 없어도 DB 레코드는 정리
      }
      await prisma.attachment.delete({ where: { id: row.id } });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "첨부 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
