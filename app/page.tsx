import { auth } from "@/auth";
import AppShell from "@/components/AppShell";
import NoAccess from "@/components/NoAccess";
import { canViewPersonalInfo } from "@/lib/auth-helpers";
// 로컬 우회 (개발 모드 + DISABLE_AUTH=true 일 때만)
import { DEV_AUTH_BYPASS } from "@/lib/dev-auth-bypass";

export default async function Page() {
  if (DEV_AUTH_BYPASS) return <AppShell canViewHr={true} />;
  const session = await auth();
  const role = session?.user?.role;
  const isAdmin = role === "admin" || role === "ceo";
  if (!isAdmin) return <NoAccess />;
  return <AppShell canViewHr={canViewPersonalInfo(session)} />;
}
