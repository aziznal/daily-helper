import { PropsWithChildren } from "react";
import { CookieNames } from "@/lib/cookie-names";
import { redirect } from "next/navigation";

import { cookies } from "next/headers";

export default function PasswordProtectedLayout({
  children,
}: PropsWithChildren) {
  const userIsAuthenticated = cookies().has(CookieNames.IsAuthenticated);

  if (!userIsAuthenticated) {
    return redirect("/enter-password");
  }

  return <>{children}</>;
}
