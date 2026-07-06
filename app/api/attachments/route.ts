import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { uploadDir } from "@/lib/uploadDir";

export const runtime = "nodejs"; // Prisma·fs는 edge 불가

// GET /api/attachments?entityType=&entityId= — 엔티티별 첨부 목록
export async function GET(request: Request) {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get("entityType");
    const entityId = searchParams.get("entityId");

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: "entityType, entityId는 필수입니다." },
        { status: 400 },
      );
    }

    const items = await prisma.attachment.findMany({
      where: { entityType, entityId: Number(entityId) },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "첨부 목록을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

// POST /api/attachments (multipart) — 파일 업로드(파일시스템 저장 + DB엔 경로만)
export async function POST(request: Request) {
  const _auth = await requireAdmin();
  if (!_auth.ok) return _auth.response;

  try {
    const form = await request.formData();
    const entityType = form.get("entityType");
    const entityIdRaw = form.get("entityId");
    const docTypeCodeRaw = form.get("docTypeCode");
    const file = form.get("file");

    if (
      !(file instanceof File) ||
      typeof entityType !== "string" ||
      typeof entityIdRaw !== "string"
    ) {
      return NextResponse.json(
        { error: "file, entityType, entityId는 필수입니다." },
        { status: 400 },
      );
    }

    const entityId = Number(entityIdRaw);
    const docTypeCode =
      typeof docTypeCodeRaw === "string" && docTypeCodeRaw
        ? docTypeCodeRaw
        : null;

    const ext = path.extname(file.name);
    const key = `${entityType}/${crypto.randomUUID()}${ext}`;

    await fs.mkdir(path.join(uploadDir(), entityType), { recursive: true });
    await fs.writeFile(
      path.join(uploadDir(), key),
      Buffer.from(await file.arrayBuffer()),
    );

    const created = await prisma.attachment.create({
      data: {
        entityType,
        entityId,
        docTypeCode,
        originalName: file.name,
        storedPath: key,
        fileSize: file.size,
        mimeType: file.type || null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "파일 업로드에 실패했습니다." },
      { status: 500 },
    );
  }
}
