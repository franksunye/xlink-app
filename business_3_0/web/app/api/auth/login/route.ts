import { NextRequest } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";
import { jsonResponse } from "@/lib/http";
import { mockUser } from "@/lib/mock-data";

export async function POST(req: NextRequest) {
  let body: { agreed?: boolean; phone?: string } = {};
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!body.agreed) {
    return jsonResponse({ ok: false, error: "agreement_required" }, { status: 400 });
  }
  if (body.phone?.trim().toLowerCase() === "error") {
    return jsonResponse({ ok: false, error: "login_failed" }, { status: 401 });
  }
  const res = jsonResponse({ ok: true, user: mockUser });
  res.cookies.set(SESSION_COOKIE, "mock-ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
