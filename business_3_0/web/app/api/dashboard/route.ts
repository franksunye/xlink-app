import { NextRequest } from "next/server";
import { PROFILE_COOKIE } from "@/lib/auth";
import {
  buildCloudCookieHeaderFromSession,
  parseProfileCookie,
  resolveCloudJSessionId,
} from "@/lib/cloud-session";
import { cloudFetchDashboard } from "@/lib/dashboard-cloud-read";
import { jsonResponse } from "@/lib/http";
import { mockDashboard } from "@/lib/mock-data";
import { getSessionFromCookies } from "@/lib/session";
import { isCloudReadConfigured } from "@/lib/work-order-cloud-read";

export async function GET(req: NextRequest) {
  if (!(await getSessionFromCookies())) {
    return jsonResponse({ error: "unauthorized" }, { status: 401 });
  }

  const headers = new Headers();
  const rawCookie = req.headers.get("cookie");
  const jsessionId = resolveCloudJSessionId(req);
  const cookieHeader = buildCloudCookieHeaderFromSession(jsessionId, rawCookie);
  const profile = parseProfileCookie(req.cookies.get(PROFILE_COOKIE)?.value);
  const cloudToken =
    req.headers.get("x-xlink-cloud-token")?.trim() ||
    req.headers.get("X-Xlink-Cloud-Token")?.trim() ||
    null;

  if (isCloudReadConfigured() && jsessionId) {
    const cloudDash = await cloudFetchDashboard(
      cookieHeader,
      jsessionId,
      profile,
      cloudToken
    );
    if (cloudDash) {
      headers.set("X-Xlink-Read-Source", "cloud");
      return jsonResponse(cloudDash, { headers });
    }
    headers.set("X-Xlink-Read-Source", "mock-fallback");
  }

  return jsonResponse(mockDashboard, { headers });
}
