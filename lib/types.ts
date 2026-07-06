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
