import { NextRequest } from "next/server";
import { jsonResponse } from "@/lib/http";
import { getSessionFromCookies } from "@/lib/session";
import { getWorkOrderById } from "@/lib/mock-data";

type Params = { id: string };

export async function GET(
  _req: NextRequest,
  context: { params: Promise<Params> }
) {
  if (!(await getSessionFromCookies())) {
    return jsonResponse({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const order = getWorkOrderById(id);
  if (!order) {
    return jsonResponse({ error: "not_found" }, { status: 404 });
  }
  return jsonResponse(order);
}
