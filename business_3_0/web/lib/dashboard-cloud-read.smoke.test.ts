import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildMetricsFromEntries,
  mapTabTotalsToEntries,
  mapTabTotalsToHomeTasks,
  mapTabTotalsToTaskOverview,
} from "./dashboard-cloud-read.ts";

const fixtureTabs = [
  { key: "to_accept", label: "待接单", count: 8 },
  { key: "need_contact", label: "待联系", count: 3 },
  { key: "onsite", label: "待上门", count: 12 },
  { key: "following", label: "待跟进", count: 2 },
  { key: "all", label: "全部", count: 25 },
];

describe("mapTabTotalsToEntries", () => {
  it("maps four tab counts to dashboard entries", () => {
    const entries = mapTabTotalsToEntries(fixtureTabs);
    assert.equal(entries.length, 4);
    assert.equal(entries[0]?.filter, "to_accept");
    assert.equal(entries[0]?.value, 8);
    assert.equal(entries[1]?.filter, "need_contact");
    assert.equal(entries[1]?.value, 3);
    assert.equal(entries[2]?.filter, "onsite");
    assert.equal(entries[2]?.value, 12);
    assert.equal(entries[3]?.filter, "following");
    assert.equal(entries[3]?.value, 2);
  });
});

describe("mapTabTotalsToTaskOverview", () => {
  it("uses same counts with overview shape", () => {
    const overview = mapTabTotalsToTaskOverview(fixtureTabs);
    const onsite = overview.find((o) => o.filter === "onsite");
    assert.equal(onsite?.value, 12);
    assert.equal(onsite?.label, "待上门");
  });
});

describe("mapTabTotalsToHomeTasks", () => {
  it("builds home tasks from tab counts", () => {
    const tasks = mapTabTotalsToHomeTasks(fixtureTabs);
    assert.equal(tasks.length, 4);
    assert.equal(tasks[0]?.filter, "need_contact");
    assert.equal(tasks[0]?.count, 3);
    assert.equal(tasks[1]?.filter, "following");
    assert.equal(tasks[1]?.count, 2);
    assert.equal(tasks[2]?.filter, "onsite");
    assert.equal(tasks[2]?.count, 12);
    assert.equal(tasks[3]?.filter, "to_accept");
    assert.equal(tasks[3]?.count, 8);
  });

  it("prepends visit task when primary order exists", () => {
    const primary = {
      id: "WO-1",
      customer: "张先生",
      title: "上门",
      appointment: "14:30 上门",
      address: "上海市浦东新区世纪大道1号",
      distance: "—",
    };
    const tasks = mapTabTotalsToHomeTasks(fixtureTabs, primary);
    assert.equal(tasks[0]?.key, "visit");
    assert.equal(tasks[0]?.orderId, "WO-1");
  });
});

describe("buildMetricsFromEntries", () => {
  it("derives metrics from entry filters", () => {
    const entries = mapTabTotalsToEntries(fixtureTabs);
    const metrics = buildMetricsFromEntries(entries);
    assert.equal(metrics[0]?.value, 8);
    assert.equal(metrics[1]?.value, 12);
    assert.equal(metrics[2]?.value, 2);
    assert.equal(metrics[3]?.value, 3);
  });
});
