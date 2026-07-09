// lib/excel.ts
// 목록을 스타일 적용된 .xlsx로 내보내는 범용 헬퍼.
// exceljs는 호출(버튼 클릭) 시점에만 동적 import → 초기 번들 미포함.

export type ExcelColumn = { header: string; key: string; width?: number };
type Cellish = string | number | null | undefined;

export async function exportToExcel(opts: {
  fileName: string;
  sheetName: string;
  columns: ExcelColumn[];
  rows: Record<string, Cellish>[];
}) {
  // 번들러(turbopack/webpack)에 따라 default 래핑 여부가 달라 양쪽 대응
  const _m = await import("exceljs");
  const ExcelJS = _m.default ?? (_m as unknown as typeof _m.default);

  const wb = new ExcelJS.Workbook();
  wb.creator = "VanaM 경영지원";
  wb.created = new Date();

  const ws = wb.addWorksheet(opts.sheetName, {
    views: [{ state: "frozen", ySplit: 1 }], // 헤더 행 고정
  });

  ws.columns = opts.columns.map((c) => ({
    header: c.header,
    key: c.key,
    width: c.width ?? 16,
  }));

  // 헤더 스타일 (남색 배경 + 흰 글자 + 테두리)
  const headerRow = ws.getRow(1);
  headerRow.height = 22;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, size: 11, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E3A8A" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin", color: { argb: "FF1E3A8A" } },
      bottom: { style: "thin", color: { argb: "FF1E3A8A" } },
      left: { style: "thin", color: { argb: "FF1E3A8A" } },
      right: { style: "thin", color: { argb: "FF1E3A8A" } },
    };
  });

  // 데이터 행 (연회색 테두리)
  opts.rows.forEach((r) => {
    const row = ws.addRow(r);
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle" };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
      };
    });
  });

  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: opts.columns.length } };

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = opts.fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
