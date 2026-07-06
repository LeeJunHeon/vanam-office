// 데모용 목 데이터 — 인사관리(PersonalInfoPage)에서만 사용.
// 특허·자산은 실제 DB API(/api/patents, /api/assets)로 이전됨.

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
