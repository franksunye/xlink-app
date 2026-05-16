import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  paginateWorkOrders,
  parseListPageParams,
  WORK_ORDER_LIST_ROWS,
} from "./work-order-list-page.ts";

describe("parseListPageParams", () => {
  it("defaults to page 1 and business rows", () => {
    const p = parseListPageParams(null, null);
    assert.equal(p.page, 1);
    assert.equal(p.rows, WORK_ORDER_LIST_ROWS);
  });
});

describe("paginateWorkOrders", () => {
  it("pages and sets hasMore", () => {
    const items = Array.from({ length: 25 }, (_, i) => ({ id: `w${i}` })) as {
      id: string;
    }[];
    const p1 = paginateWorkOrders(items as never, 1, 10);
    assert.equal(p1.items.length, 10);
    assert.equal(p1.hasMore, true);
    const p3 = paginateWorkOrders(items as never, 3, 10);
    assert.equal(p3.items.length, 5);
    assert.equal(p3.hasMore, false);
  });
});
