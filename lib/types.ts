// API(Prisma) 직렬화 결과에 맞춘 화면용 타입
// - price(Decimal)·purchaseDate/createdAt(Date)는 JSON에서 문자열로 온다.

export type Patent = {
  id: number;
  ipTypeCode: string;
  name: string;
  number: string | null;
  manager: string | null;
  note: string | null;
  createdAt?: string;
};

export type Asset = {
  id: number;
  purchaseDate: string | null;
  assetNo: string | null;
  name: string;
  spec: string | null;
  quantity: number;
  price: string | null;
  vendor: string | null;
  purpose: string | null;
  location: string | null;
  managerPrimary: string | null;
  managerSub: string | null;
};

// 인사관리 — 신원은 hr(읽기), 인사정보는 office(편집)
export type PersonalListItem = {
  employeeId: number;
  name: string;
  employeeNo: string | null;
  positionName: string | null;
  departmentName: string | null;
  isHrOnly: boolean;
  hasInfo: boolean;
};

export type PersonalDetail = {
  employeeId: number;
  // hr 신원(읽기 전용)
  name: string;
  employeeNo: string | null;
  email: string | null;
  hiredAt: string | null;
  positionName: string | null;
  departmentName: string | null;
  isHrOnly: boolean;
  // office 인사정보(편집 가능)
  hasInfo: boolean;
  hrName: string | null;
  hrPosition: string | null;
  hrDepartment: string | null;
  hrPhone: string | null;
  researcherNumber: string | null;
  university: string | null;
  finalDegree: string | null;
  major: string | null;
  graduationYearmonth: string | null;
  degreeNumber: string | null;
  residentNumber: string | null;
  address: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
};
