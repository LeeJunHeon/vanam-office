import { auth } from "@/auth";
import AppShell from "@/components/AppShell";
import NoAccess from "@/components/NoAccess";
import { canViewPersonalInfo } from "@/lib/auth-helpers";

const disableAuth = process.env.DISABLE_AUTH === "true";

export default async function Page() {
  if (disableAuth) return <AppShell canViewHr={true} />;
  const session = await auth();
  const role = session?.user?.role;
  const isAdmin = role === "admin" || role === "ceo";
  if (!isAdmin) return <NoAccess />;
  return <AppShell canViewHr={canViewPersonalInfo(session)} />;
}
