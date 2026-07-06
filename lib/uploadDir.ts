import path from "path";

// 첨부 파일 저장 루트. env UPLOAD_DIR 없으면 <프로젝트루트>/uploads.
export function uploadDir() {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
}
