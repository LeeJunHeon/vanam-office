// 데모용 목 데이터 — 백엔드/DB/NAS 미연결

export type PatentStatus = "출원" | "심사중" | "등록" | "포기";

export interface PatentDoc {
  name: string;
  size: string;
}

export interface Patent {
  id: string;
  title: string;
  applicationNumber: string;
  registrationNumber: string | null;
  status: PatentStatus;
  applicationDate: string;
  registrationDate: string | null;
  country: string;
  inventors: string;
  relatedProduct: string;
  docs: PatentDoc[];
  photos: number;
}

export const patents: Patent[] = [
  {
    id: "PT-001",
    title: "박막 증착용 타겟 냉각 구조",
    applicationNumber: "10-2024-0012345",
    registrationNumber: "10-2698412",
    status: "등록",
    applicationDate: "2024-02-15",
    registrationDate: "2025-08-30",
    country: "KR",
    inventors: "이준헌 외 1",
    relatedProduct: "스퍼터 타겟 어셈블리",
    docs: [
      { name: "특허출원서.pdf", size: "1.2MB" },
      { name: "등록증.pdf", size: "0.3MB" },
      { name: "도면.pdf", size: "0.9MB" },
    ],
    photos: 2,
  },
  {
    id: "PT-002",
    title: "ALD 프리커서 캐니스터 잔량 측정 장치",
    applicationNumber: "10-2025-0023456",
    registrationNumber: null,
    status: "심사중",
    applicationDate: "2025-04-10",
    registrationDate: null,
    country: "KR",
    inventors: "이준헌",
    relatedProduct: "ALD 캐니스터",
    docs: [
      { name: "특허출원서.pdf", size: "1.1MB" },
      { name: "도면.pdf", size: "0.7MB" },
    ],
    photos: 1,
  },
  {
    id: "PT-003",
    title: "스퍼터링 챔버 실시간 두께 모니터링 방법",
    applicationNumber: "10-2026-0003210",
    registrationNumber: null,
    status: "출원",
    applicationDate: "2026-01-20",
    registrationDate: null,
    country: "KR",
    inventors: "이준헌 외 2",
    relatedProduct: "스퍼터 챔버",
    docs: [{ name: "특허출원서.pdf", size: "1.3MB" }],
    photos: 0,
  },
  {
    id: "PT-004",
    title: "증발원 도가니 다중 제어 시스템",
    applicationNumber: "10-2023-0098765",
    registrationNumber: "10-2611234",
    status: "등록",
    applicationDate: "2023-09-05",
    registrationDate: "2024-12-01",
    country: "KR",
    inventors: "이준헌",
    relatedProduct: "Evaporator",
    docs: [
      { name: "특허출원서.pdf", size: "1.4MB" },
      { name: "등록증.pdf", size: "0.3MB" },
      { name: "도면.pdf", size: "1.0MB" },
      { name: "의견서.pdf", size: "0.5MB" },
    ],
    photos: 3,
  },
  {
    id: "PT-005",
    title: "진공 게이트밸브 파티클 저감 구조",
    applicationNumber: "10-2022-0054321",
    registrationNumber: null,
    status: "포기",
    applicationDate: "2022-06-30",
    registrationDate: null,
    country: "KR",
    inventors: "이준헌",
    relatedProduct: "게이트밸브",
    docs: [{ name: "특허출원서.pdf", size: "1.0MB" }],
    photos: 0,
  },
];

export type AssetTxType = "입고" | "출고" | "폐기";

export interface AssetTx {
  id: string;
  itemName: string;
  category: string;
  type: AssetTxType;
  quantity: string;
  partner: string;
  date: string;
  docs: number;
  photos: number;
}

export const assetTxs: AssetTx[] = [
  {
    id: "AT-001",
    itemName: "진공펌프 오일",
    category: "소모품",
    type: "입고",
    quantity: "20 L",
    partner: "한국진공",
    date: "2026-06-20",
    docs: 0,
    photos: 1,
  },
  {
    id: "AT-002",
    itemName: "O-ring KF40 세트",
    category: "소모품",
    type: "입고",
    quantity: "100 ea",
    partner: "우진씰",
    date: "2026-06-18",
    docs: 1,
    photos: 0,
  },
  {
    id: "AT-003",
    itemName: "노트북 Dell 5540",
    category: "비품",
    type: "입고",
    quantity: "2 ea",
    partner: "디지털파크",
    date: "2026-06-15",
    docs: 2,
    photos: 0,
  },
  {
    id: "AT-004",
    itemName: "질소 가스 7㎥",
    category: "소모품",
    type: "출고",
    quantity: "3 ea",
    partner: "사내 사용",
    date: "2026-06-12",
    docs: 0,
    photos: 0,
  },
  {
    id: "AT-005",
    itemName: "폐 게이트밸브",
    category: "자산",
    type: "폐기",
    quantity: "1 ea",
    partner: "-",
    date: "2026-06-10",
    docs: 0,
    photos: 2,
  },
];
