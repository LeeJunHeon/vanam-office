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

export interface PersonalInfo {
  employeeId: number;
  name: string;
  positionName: string | null;
  departmentName: string | null;
  hrName: string;
  employeeNo: string | null;
  hrPosition: string | null;
  hrDepartment: string | null;
  hiredAt: string | null;
  researcherNumber: string | null;
  university: string | null;
  finalDegree: string | null;
  major: string | null;
  graduationYearmonth: string | null;
  degreeNumber: string | null;
  residentNumber: string | null;
  hrPhone: string | null;
  address: string | null;
  email: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
  hasInfo: boolean;
  isHrOnly: boolean;
}

export const mockPersonalInfos: PersonalInfo[] = [
  {
    employeeId: 1,
    name: "이준헌",
    positionName: "대표이사",
    departmentName: "경영",
    hrName: "이준헌",
    employeeNo: "V-2021-001",
    hrPosition: "CTO",
    hrDepartment: "개발",
    hiredAt: "2021-03-02",
    researcherNumber: "10081234567",
    university: "한국대학교",
    finalDegree: "박사",
    major: "신소재공학",
    graduationYearmonth: "2018-02",
    degreeNumber: "한국대2018-1234",
    residentNumber: "880101-1234567",
    hrPhone: "010-1234-5678",
    address: "서울시 강남구",
    email: "jhlee@vanam.co.kr",
    bankName: "국민은행",
    accountNumber: "123456-04-567890",
    accountHolder: "이준헌",
    hasInfo: true,
    isHrOnly: false,
  },
  {
    employeeId: 2,
    name: "김서연",
    positionName: "선임연구원",
    departmentName: "공정",
    hrName: "김서연",
    employeeNo: "V-2022-003",
    hrPosition: "선임연구원",
    hrDepartment: "공정",
    hiredAt: "2022-05-10",
    researcherNumber: null,
    university: "서연대학교",
    finalDegree: "석사",
    major: "화학공학",
    graduationYearmonth: "2021-08",
    degreeNumber: "서연대2021-0456",
    residentNumber: "900315-2345678",
    hrPhone: "010-2345-6789",
    address: "경기도 수원시",
    email: "sykim@vanam.co.kr",
    bankName: "신한은행",
    accountNumber: "110-234-567890",
    accountHolder: "김서연",
    hasInfo: true,
    isHrOnly: false,
  },
  {
    employeeId: 3,
    name: "박민호",
    positionName: "연구원",
    departmentName: "장비",
    hrName: "박민호",
    employeeNo: "V-2023-007",
    hrPosition: "연구원",
    hrDepartment: "장비",
    hiredAt: "2023-09-01",
    researcherNumber: null,
    university: "민호대학교",
    finalDegree: "학사",
    major: "기계공학",
    graduationYearmonth: "2023-02",
    degreeNumber: null,
    residentNumber: "950722-1456789",
    hrPhone: "010-3456-7890",
    address: "인천시 연수구",
    email: "mhpark@vanam.co.kr",
    bankName: "우리은행",
    accountNumber: "1002-345-678901",
    accountHolder: "박민호",
    hasInfo: true,
    isHrOnly: false,
  },
  {
    employeeId: 4,
    name: "-",
    positionName: null,
    departmentName: null,
    hrName: "정유진",
    employeeNo: null,
    hrPosition: "고문",
    hrDepartment: "자문",
    hiredAt: null,
    researcherNumber: null,
    university: null,
    finalDegree: null,
    major: null,
    graduationYearmonth: null,
    degreeNumber: null,
    residentNumber: null,
    hrPhone: "010-4567-8901",
    address: null,
    email: "yjjung@vanam.co.kr",
    bankName: null,
    accountNumber: null,
    accountHolder: null,
    hasInfo: true,
    isHrOnly: true,
  },
];
