import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  classifyCtaLabel,
  isDemoDistance,
  showDistanceLine,
  telHref,
} from "@/lib/work-order-contact";

describe("work-order-contact", () => {
  it("classifies CTA labels", () => {
    assert.equal(classifyCtaLabel("联系客户"), "call");
    assert.equal(classifyCtaLabel("导航"), "navigate");
    assert.equal(classifyCtaLabel("查看跟进记录"), "tab_records");
    assert.equal(classifyCtaLabel("新增预约时间"), "pending_write");
  });

  it("hides demo distance", () => {
    assert.equal(isDemoDistance("2.3 km"), true);
    assert.equal(showDistanceLine({ distance: "2.3 km" }), false);
    assert.equal(showDistanceLine({ distance: "1.2 km" }), true);
  });

  it("builds tel href", () => {
    assert.equal(telHref("180 0321 8877"), "tel:18003218877");
  });
});
