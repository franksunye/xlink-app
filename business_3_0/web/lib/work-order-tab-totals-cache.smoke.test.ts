import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clearWorkOrderTabTotalsCache,
  cloudFetchWorkOrderTabTotals,
} from "./work-order-cloud-read.ts";

describe("work order tab totals cache", () => {
  it("clearWorkOrderTabTotalsCache is callable", () => {
    clearWorkOrderTabTotalsCache();
    assert.equal(typeof clearWorkOrderTabTotalsCache, "function");
  });

  it("returns null when cloud read is not configured", async () => {
    const prev = process.env.XLINK_CLOUD_READ_BASE_URL;
    delete process.env.XLINK_CLOUD_READ_BASE_URL;
    try {
      const tabs = await cloudFetchWorkOrderTabTotals(null, null, null);
      assert.equal(tabs, null);
    } finally {
      if (prev !== undefined) process.env.XLINK_CLOUD_READ_BASE_URL = prev;
    }
  });
});
