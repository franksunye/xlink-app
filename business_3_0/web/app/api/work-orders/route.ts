import { NextRequest } from "next/server";
import { jsonResponse } from "@/lib/http";
import { getSessionFromCookies } from "@/lib/session";
import { filterWorkOrders, mockWorkOrders } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  if (!(await getSessionFromCookies())) {
    return jsonResponse({ error: "unauthorized" }, { status: 401 });
  }
  const filter = req.nextUrl.searchParams.get("filter");
  const list = filterWorkOrders(mockWorkOrders, filter);
  return jsonResponse({ items: list, filter: filter ?? null });
}
