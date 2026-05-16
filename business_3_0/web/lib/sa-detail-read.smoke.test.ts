import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  currentNodeDefName,
  resolveDetailContext,
} from "./sa-detail-context.ts";
import { mapActionRowToWorkOrderActivity } from "./work-order-cloud-read.ts";

describe("currentNodeDefName", () => {
  it("prefers nodeDef hint from list", () => {
    assert.equal(
      currentNodeDefName([{ state: 1, nodeDef: { name: "预约" } }], "下单"),
      "下单"
    );
  });

  it("returns latest non-done node by updateTime", () => {
    const name = currentNodeDefName([
      { state: 10, nodeDef: { name: "建单" }, updateTime: "2026-04-13 10:00:00" },
      { state: 1, nodeDef: { name: "预约" }, updateTime: "2026-04-14 10:00:00" },
      { state: 1, nodeDef: { name: "服务" }, updateTime: "2026-04-15 10:00:00" },
    ]);
    assert.equal(name, "服务");
  });

  it("returns undefined when all done", () => {
    assert.equal(
      currentNodeDefName([{ state: 10, nodeDef: { name: "建单" } }]),
      undefined
    );
  });
});

describe("resolveDetailContext", () => {
  it("104 without applyTimeStr matches mock-style copy", () => {
    const ctx = resolveDetailContext({
      sa: { status: "104", describe: "" },
      taskType: "联系客户",
      statusText: "待联系",
      tone: "red",
    });
    assert.equal(ctx.title, "需要联系客户");
    assert.equal(ctx.badge, "未预约");
    assert.equal(ctx.contextTitle, "暂无预约时间");
    assert.match(ctx.desc, /沟通/);
    assert.equal(ctx.primary, "联系客户");
  });

  it("uses describe when present", () => {
    const ctx = resolveDetailContext({
      sa: { status: "104", describe: "客户希望周末上门" },
      taskType: "联系客户",
      statusText: "待联系",
      tone: "red",
    });
    assert.equal(ctx.desc, "客户希望周末上门");
  });

  it("shows booked time when applyTimeStr set", () => {
    const ctx = resolveDetailContext({
      sa: { status: "202", applyTimeStr: "2026-04-14 14:00:00" },
      taskType: "上门服务",
      statusText: "待上门",
      tone: "orange",
    });
    assert.equal(ctx.badge, "已预约");
    assert.equal(ctx.contextTitle, "已预约时间");
    assert.match(ctx.contextDesc, /2026-04-14/);
  });

  it("never uses demo CTA labels for mapped status", () => {
    const ctx = resolveDetailContext({
      sa: { status: "300" },
      taskType: "现场服务",
      statusText: "待分派工队",
      tone: "orange",
    });
    assert.doesNotMatch(ctx.primary, /演示/);
    assert.doesNotMatch(ctx.secondary, /演示/);
    assert.equal(ctx.title, "现场服务中");
  });
});

describe("mapActionRowToWorkOrderActivity", () => {
  it("maps type 1 note with photos", () => {
    const row = mapActionRowToWorkOrderActivity({
      type: "1",
      typeId: "note-1",
      name: "跟进笔记",
      content: "已电话沟通",
      createUserName: "张工",
      createTime: "2026-04-14 10:00:00",
      mediaContent: ["https://example.com/a.jpg"],
    });
    assert.ok(row);
    assert.equal(row.badge, "笔记");
    assert.deepEqual(row.photos, ["https://example.com/a.jpg"]);
  });

  it("maps type 2 system log title from name", () => {
    const row = mapActionRowToWorkOrderActivity({
      type: 2,
      typeId: "log-1",
      name: "状态变更",
      content: "工单已分派",
      createUserName: "系统",
      createTime: "2026-04-14 09:00:00",
    });
    assert.ok(row);
    assert.equal(row.title, "状态变更");
    assert.equal(row.badge, "系统");
  });
});
