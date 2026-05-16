import { NextRequest } from "next/server";
import { resolveCloudJSessionId } from "@/lib/cloud-session";
import { jsonResponse } from "@/lib/http";
import { loadCodeLabels } from "@/lib/cloud-code-labels";
import { getSessionFromCookies } from "@/lib/session";
import {
  filterWorkOrders,
  mockWorkOrders,
  withDefaultReadonlyWorkflowNodes,
} from "@/lib/mock-data";
import { tabCountsForOrders, type FilterTabKey } from "@/lib/work-order-filters";
import {
  cloudFetchWorkOrders,
  cloudFetchWorkOrderTabTotals,
  isCloudReadConfigured,
} from "@/lib/work-order-cloud-read";

function parseFilter(raw: string | null): FilterTabKey | null {
  if (!raw) return null;
  const allowed = new Set([
    "to_accept",
    "need_contact",
    "onsite",
    "following",
    "all",
  ]);
  return allowed.has(raw) ? (raw as FilterTabKey) : null;
}

export async function GET(req: NextRequest) {
  if (!(await getSessionFromCookies())) {
    return jsonResponse({ error: "unauthorized" }, { status: 401 });
  }
  const filter = parseFilter(req.nextUrl.searchParams.get("filter"));
  const cookie = req.headers.get("cookie");
  const cloudJSession = resolveCloudJSessionId(req);
  const cloudToken =
    req.headers.get("x-xlink-cloud-token")?.trim() ||
    req.headers.get("X-Xlink-Cloud-Token")?.trim() ||
    null;

  let sourceList = mockWorkOrders;
  let tabs = tabCountsForOrders(mockWorkOrders);
  const headers = new Headers();

  if (isCloudReadConfigured() && cloudJSession) {
    await loadCodeLabels(cookie, cloudJSession);
    const cloudList = await cloudFetchWorkOrders(
      cookie,
      cloudToken,
      cloudJSession,
      filter
    );
    if (cloudList !== null) {
      sourceList = cloudList;
      const cloudTabs = await cloudFetchWorkOrderTabTotals(
        cookie,
        cloudToken,
        cloudJSession
      );
      if (cloudTabs) tabs = cloudTabs;
      headers.set("X-Xlink-Read-Source", "cloud");
    } else {
      headers.set("X-Xlink-Read-Source", "mock-fallback");
    }
  }

  const withNodes = sourceList.map((w) => withDefaultReadonlyWorkflowNodes(w));

  if (headers.get("X-Xlink-Read-Source") === "cloud") {
    return jsonResponse(
      { items: withNodes, filter: filter ?? null, tabs },
      { headers }
    );
  }

  const list = filterWorkOrders(withNodes, filter);
  tabs = tabCountsForOrders(withNodes);
  return jsonResponse(
    { items: list, filter: filter ?? null, tabs },
    { headers }
  );
}
