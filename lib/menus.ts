// 경영지원 메뉴 정의 — 사이드바·AppShell·딥링크 검증·/api/portal-menus 공용 (클라이언트·서버 겸용)

export type Page = "dashboard" | "patent" | "asset" | "hr" | "settings";

export const DEFAULT_PAGE: Page = "dashboard";

// 포털 런처와 맞춘 아이콘 이름 (lucide-react 컴포넌트명)
export type MenuIcon = "Home" | "Award" | "Package" | "IdCard" | "Settings";

export interface MenuItem {
  key: Page;
  label: string;
  icon: MenuIcon;
  requiresPersonalInfo?: boolean; // 인사정보 권한(canViewPersonalInfo) 필요
}

// 사이드바 표시 순서
export const MENU_ITEMS: readonly MenuItem[] = [
  { key: "dashboard", label: "대시보드", icon: "Home" },
  { key: "patent", label: "지식재산권", icon: "Award" },
  { key: "asset", label: "장비관리대장", icon: "Package" },
  { key: "hr", label: "인사정보카드", icon: "IdCard", requiresPersonalInfo: true },
  { key: "settings", label: "설정", icon: "Settings" },
];

export interface MenuAccess {
  canViewHr: boolean;
}

export function isPage(value: unknown): value is Page {
  return MENU_ITEMS.some((m) => m.key === value);
}

export function canAccessMenu(item: MenuItem, access: MenuAccess): boolean {
  return !item.requiresPersonalInfo || access.canViewHr;
}

export function canAccessPage(page: Page, access: MenuAccess): boolean {
  const item = MENU_ITEMS.find((m) => m.key === page);
  return !!item && canAccessMenu(item, access);
}

export function visibleMenus(access: MenuAccess): MenuItem[] {
  return MENU_ITEMS.filter((m) => canAccessMenu(m, access));
}

export function menuLabel(page: Page): string {
  return MENU_ITEMS.find((m) => m.key === page)?.label ?? "";
}
