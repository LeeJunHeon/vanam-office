// 데모용 목 데이터 — 백엔드/DB/NAS 미연결

import type { IpType } from "@/lib/lookups";

export interface Patent {
  id: string;
  type: IpType;
  name: string;
  number: string;
  manager: string;
  note: string;
  docs: string[];
}

export const patents: Patent[] = [
  {
    id: "IP-1",
    type: "등록",
    name: "박막 증착용 타겟 냉각 구조",
    number: "10-2698412",
    manager: "이준헌",
    note: "",
    docs: ["등록증"],
  },
  {
    id: "IP-2",
    type: "출원",
    name: "스퍼터링 챔버 실시간 두께 모니터링 방법",
    number: "10-2026-0003210",
    manager: "이준헌",
    note: "심사 진행중",
    docs: ["출원사실 증명서"],
  },
  {
    id: "IP-3",
    type: "등록-기술이전",
    name: "증발원 도가니 다중 제어 시스템",
    number: "10-2611234",
    manager: "김서연",
    note: "A사 기술이전 완료",
    docs: ["등록증"],
  },
  {
    id: "IP-4",
    type: "거절",
    name: "진공 게이트밸브 파티클 저감 구조",
    number: "10-2022-0054321",
    manager: "박민호",
    note: "거절결정 (2025-11)",
    docs: [],
  },
  {
    id: "IP-5",
    type: "인증",
    name: "벤처기업 인증",
    number: "제2024-12345호",
    manager: "이준헌",
    note: "유효기간 2027-03",
    docs: ["인증서"],
  },
];

export interface Asset {
  id: string;
  purchaseDate: string;
  assetNo: string;
  name: string;
  spec: string;
  quantity: number;
  price: number;
  vendor: string;
  purpose: string;
  location: string;
  managerPrimary: string;
  managerSub: string;
  docs: string[];
}

export const assets: Asset[] = [
  {
    id: "S-001",
    purchaseDate: "2024-03-15",
    assetNo: "S-001",
    name: "박막두께 측정기",
    spec: "5nm급",
    quantity: 1,
    price: 45000000,
    vendor: "(주)한국계측",
    purpose: "박막 두께 분석",
    location: "연구동 2층",
    managerPrimary: "이준헌",
    managerSub: "김서연",
    docs: ["계약서", "전자세금계산서", "증빙사진"],
  },
  {
    id: "S-002",
    purchaseDate: "2025-01-20",
    assetNo: "S-002",
    name: "RGA 분석기",
    spec: "SRS 100amu",
    quantity: 1,
    price: 28000000,
    vendor: "에스알에스코리아",
    purpose: "잔류가스 분석",
    location: "연구동 1층",
    managerPrimary: "이준헌",
    managerSub: "박민호",
    docs: ["거래명세서", "입금내역확인증"],
  },
  {
    id: "R-011",
    purchaseDate: "2025-06-10",
    assetNo: "R-011",
    name: "사무용 노트북",
    spec: "Dell 5540",
    quantity: 3,
    price: 4500000,
    vendor: "디지털파크",
    purpose: "사무 업무",
    location: "본사 사무실",
    managerPrimary: "박민호",
    managerSub: "-",
    docs: ["카드매출전표"],
  },
  {
    id: "R-012",
    purchaseDate: "2026-02-05",
    assetNo: "R-012",
    name: "진공펌프",
    spec: "로터리 80L/min",
    quantity: 2,
    price: 6800000,
    vendor: "한국진공",
    purpose: "챔버 진공",
    location: "생산동",
    managerPrimary: "김서연",
    managerSub: "박민호",
    docs: ["계약서", "증빙사진"],
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
