import { auth } from "@/auth";
import AppShell from "@/components/AppShell";
import NoAccess from "@/components/NoAccess";

const disableAuth = process.env.DISABLE_AUTH === "true";

export default async function Page() {
  // 로컬 UI 확인 모드는 통과
  if (disableAuth) return <AppShell />;
  // 미인증은 proxy.ts가 이미 포털 로그인으로 보냄. 여기선 로그인했으나 권한 없는 경우를 차단.
  const session = await auth();
  const role = session?.user?.role;
  const isAdmin = role === "admin" || role === "ceo";
  return isAdmin ? <AppShell /> : <NoAccess />;
}
