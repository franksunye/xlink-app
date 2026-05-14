import { SESSION_COOKIE } from "@/lib/auth";
import { jsonResponse } from "@/lib/http";

export async function POST() {
  const res = jsonResponse({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
