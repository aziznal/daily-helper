import { CookieNames } from "@/lib/cookie-names";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

import { cookies } from "next/headers";

export default function Layout({ children }: PropsWithChildren) {
  const userIsAuthenticated = cookies().has(CookieNames.IsAuthenticated);

  if (userIsAuthenticated) {
    return redirect("/");
  }

  return <>{children}</>;
}
