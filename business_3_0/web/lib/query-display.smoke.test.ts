import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isInitialQueryLoad,
  shouldShowWorkOrdersFullSkeleton,
} from "./query-display.ts";

describe("isInitialQueryLoad", () => {
  it("is true only when pending without data", () => {
    assert.equal(isInitialQueryLoad(true, undefined), true);
    assert.equal(isInitialQueryLoad(false, undefined), false);
    assert.equal(isInitialQueryLoad(true, { items: [] }), false);
  });
});

describe("shouldShowWorkOrdersFullSkeleton", () => {
  it("never shows after shell mounted", () => {
    assert.equal(shouldShowWorkOrdersFullSkeleton(true, true, undefined), false);
  });

  it("matches initial load before shell mounted", () => {
    assert.equal(shouldShowWorkOrdersFullSkeleton(false, true, undefined), true);
    assert.equal(shouldShowWorkOrdersFullSkeleton(false, false, { items: [] }), false);
  });
});
