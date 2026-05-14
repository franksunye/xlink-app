import { cookies } from "next/headers";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/auth";

export async function getSessionFromCookies(): Promise<boolean> {
  const c = await cookies();
  const v = c.get(SESSION_COOKIE)?.value;
  return isValidSessionToken(v);
}
