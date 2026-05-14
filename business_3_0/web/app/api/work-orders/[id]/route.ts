import { NextRequest } from "next/server";
import { jsonResponse } from "@/lib/http";
import { getSessionFromCookies } from "@/lib/session";
import { getWorkOrderById, withDefaultReadonlyWorkflowNodes } from "@/lib/mock-data";
import {
  cloudFetchWorkOrderById,
  isCloudReadConfigured,
} from "@/lib/work-order-cloud-read";

type Params = { id: string };

export async function GET(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  if (!(await getSessionFromCookies())) {
    return jsonResponse({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const cookie = req.headers.get("cookie");
  const cloudToken =
    req.headers.get("x-xlink-cloud-token")?.trim() ||
    req.headers.get("X-Xlink-Cloud-Token")?.trim() ||
    null;
  const headers = new Headers();

  if (isCloudReadConfigured()) {
    const cloudOrder = await cloudFetchWorkOrderById(id, cookie, cloudToken);
    if (cloudOrder) {
      headers.set("X-Xlink-Read-Source", "cloud");
      return jsonResponse(withDefaultReadonlyWorkflowNodes(cloudOrder), { headers });
    }
    headers.set("X-Xlink-Read-Source", "mock-fallback");
  }

  const order = getWorkOrderById(id);
  if (!order) {
    return jsonResponse({ error: "not_found" }, { status: 404 });
  }
  return jsonResponse(withDefaultReadonlyWorkflowNodes(order), { headers });
}
