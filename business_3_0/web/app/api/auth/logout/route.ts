import { PROFILE_COOKIE, SESSION_COOKIE } from "@/lib/auth";
import { jsonResponse } from "@/lib/http";

const clearOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 0,
};

export async function POST() {
  const res = jsonResponse({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", clearOpts);
  res.cookies.set(PROFILE_COOKIE, "", clearOpts);
  return res;
}
