import { NextRequest } from "next/server";
import { resolveCloudJSessionId } from "@/lib/cloud-session";
import { jsonResponse } from "@/lib/http";
import { mockProjects } from "@/lib/mock-data";
import { cloudFetchProjects } from "@/lib/project-cloud-read";
import { getSessionFromCookies } from "@/lib/session";
import { isCloudReadConfigured } from "@/lib/work-order-cloud-read";

export async function GET(req: NextRequest) {
  if (!(await getSessionFromCookies())) {
    return jsonResponse({ error: "unauthorized" }, { status: 401 });
  }

  const headers = new Headers();
  const cookie = req.headers.get("cookie");
  const jsessionId = resolveCloudJSessionId(req);
  const cloudToken =
    req.headers.get("x-xlink-cloud-token")?.trim() ||
    req.headers.get("X-Xlink-Cloud-Token")?.trim() ||
    null;

  if (isCloudReadConfigured() && jsessionId) {
    const cloudList = await cloudFetchProjects(cookie, jsessionId, cloudToken);
    if (cloudList !== null) {
      headers.set("X-Xlink-Read-Source", "cloud");
      return jsonResponse({ items: cloudList }, { headers });
    }
    headers.set("X-Xlink-Read-Source", "mock-fallback");
  }

  return jsonResponse({ items: mockProjects }, { headers });
}
