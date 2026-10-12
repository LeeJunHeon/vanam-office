// 포털 런처 연동 헬퍼 — 메뉴 주소(?page=) 읽기·쓰기, 사용 기록 전송.
// window 를 읽으므로 useEffect·이벤트 핸들러 안에서만 호출한다.
import { DEFAULT_PAGE, isPage, type Page } from "@/lib/menus";

const APP = "office";

// 주소의 ?page= 값 (모르는 키면 null)
export function readPageParam(): Page | null {
  const value = new URLSearchParams(window.location.search).get("page");
  return isPage(value) ? value : null;
}

// 주소의 page 파라미터를 현재 화면과 맞춘다 (기본 화면이면 제거, 다른 파라미터 유지)
export function writePageParam(page: Page): void {
  const url = new URL(window.location.href);
  if (page === DEFAULT_PAGE) url.searchParams.delete("page");
  else url.searchParams.set("page", page);
  if (url.href !== window.location.href)
    window.history.replaceState(window.history.state, "", url.href);
}

// 포털에 메뉴 사용 1건 기록. 실패는 무시한다.
// api() 는 basePath(/office)가 붙어 이 앱으로 가므로 origin 절대 주소를 쓴다.
export function sendLauncherUsage(page: Page): void {
  try {
    const url = `${window.location.origin}/api/launcher/usage`;
    const body = JSON.stringify({ app: APP, page });
    if (typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    } else {
      fetch(url, {
        method: "POST",
        keepalive: true,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body,
      }).catch(() => {});
    }
  } catch {
    // 무시
  }
}
