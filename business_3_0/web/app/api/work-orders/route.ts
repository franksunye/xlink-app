import { NextRequest } from "next/server";
import { jsonResponse } from "@/lib/http";
import { getSessionFromCookies } from "@/lib/session";
import {
  filterWorkOrders,
  mockWorkOrders,
  withDefaultReadonlyWorkflowNodes,
} from "@/lib/mock-data";
import { tabCountsForOrders } from "@/lib/work-order-filters";
import { cloudFetchWorkOrders, isCloudReadConfigured } from "@/lib/work-order-cloud-read";

export async function GET(req: NextRequest) {
  if (!(await getSessionFromCookies())) {
    return jsonResponse({ error: "unauthorized" }, { status: 401 });
  }
  const filter = req.nextUrl.searchParams.get("filter");
  const cookie = req.headers.get("cookie");
  const cloudToken =
    req.headers.get("x-xlink-cloud-token")?.trim() ||
    req.headers.get("X-Xlink-Cloud-Token")?.trim() ||
    null;

  let sourceList = mockWorkOrders;
  const headers = new Headers();

  if (isCloudReadConfigured()) {
    const cloudList = await cloudFetchWorkOrders(cookie, cloudToken);
    if (cloudList && cloudList.length > 0) {
      sourceList = cloudList;
      headers.set("X-Xlink-Read-Source", "cloud");
    } else {
      headers.set("X-Xlink-Read-Source", "mock-fallback");
    }
  }

  const withNodes = sourceList.map((w) => withDefaultReadonlyWorkflowNodes(w));
  const list = filterWorkOrders(withNodes, filter);
  const tabs = tabCountsForOrders(withNodes);
  return jsonResponse(
    { items: list, filter: filter ?? null, tabs },
    { headers }
  );
}
