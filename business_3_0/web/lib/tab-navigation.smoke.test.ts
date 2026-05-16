import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAppTabPathname, tabIdFromPathname } from "./tab-navigation.ts";

describe("tab-navigation", () => {
  it("maps tab roots", () => {
    assert.equal(tabIdFromPathname("/"), "home");
    assert.equal(tabIdFromPathname("/work-orders"), "tasks");
    assert.equal(tabIdFromPathname("/projects"), "projects");
    assert.equal(tabIdFromPathname("/account"), "account");
  });

  it("excludes detail routes", () => {
    assert.equal(tabIdFromPathname("/work-orders/WO-1"), null);
    assert.equal(isAppTabPathname("/work-orders/WO-1"), false);
    assert.equal(isAppTabPathname("/work-orders"), true);
  });
});
