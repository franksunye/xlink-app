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
import { paginateWorkOrders, parseListPageParams } from "@/lib/work-order-list-page";
import {
  cloudFetchWorkOrdersPage,
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
  const { page, rows } = parseListPageParams(
    req.nextUrl.searchParams.get("page"),
    req.nextUrl.searchParams.get("rows")
  );
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
    const includeTabs = page === 1;
    const [cloudPage, cloudTabs] = await Promise.all([
      cloudFetchWorkOrdersPage(
        cookie,
        cloudToken,
        cloudJSession,
        filter,
        page,
        rows
      ),
      includeTabs
        ? cloudFetchWorkOrderTabTotals(cookie, cloudToken, cloudJSession)
        : Promise.resolve(null),
    ]);
    if (cloudPage !== null) {
      if (cloudTabs) tabs = cloudTabs;
      headers.set("X-Xlink-Read-Source", "cloud");
      const items = cloudPage.items.map((w) => withDefaultReadonlyWorkflowNodes(w));
      return jsonResponse(
        {
          items,
          filter: filter ?? null,
          ...(includeTabs ? { tabs } : {}),
          page: cloudPage.page,
          rows: cloudPage.rows,
          total: cloudPage.total,
          hasMore: cloudPage.hasMore,
        },
        { headers }
      );
    }
    headers.set("X-Xlink-Read-Source", "mock-fallback");
  }

  const withNodes = sourceList.map((w) => withDefaultReadonlyWorkflowNodes(w));
  const filtered = filterWorkOrders(withNodes, filter);
  const includeTabs = page === 1;
  if (includeTabs) tabs = tabCountsForOrders(withNodes);
  const slice = paginateWorkOrders(filtered, page, rows);
  return jsonResponse(
    {
      items: slice.items,
      filter: filter ?? null,
      ...(includeTabs ? { tabs } : {}),
      page: slice.page,
      rows: slice.rows,
      total: slice.total,
      hasMore: slice.hasMore,
    },
    { headers }
  );
}
