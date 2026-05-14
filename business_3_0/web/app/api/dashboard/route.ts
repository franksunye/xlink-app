import { jsonResponse } from "@/lib/http";
import { getSessionFromCookies } from "@/lib/session";
import { mockDashboard } from "@/lib/mock-data";

export async function GET() {
  if (!(await getSessionFromCookies())) {
    return jsonResponse({ error: "unauthorized" }, { status: 401 });
  }
  return jsonResponse(mockDashboard);
}
