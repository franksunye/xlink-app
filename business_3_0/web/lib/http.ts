import { NextResponse } from "next/server";

/** BFF JSON: never public long-cache; user-specific. */
export const CACHE_API_PRIVATE =
  "private, no-store, must-revalidate";

export function jsonResponse(
  data: unknown,
  init?: { status?: number; headers?: HeadersInit }
): NextResponse {
  const headers = new Headers(init?.headers);
  if (!headers.has("Cache-Control")) {
    headers.set("Cache-Control", CACHE_API_PRIVATE);
  }
  headers.set("Content-Type", "application/json; charset=utf-8");
  return NextResponse.json(data, { status: init?.status ?? 200, headers });
}
