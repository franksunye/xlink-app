import type { WorkOrder } from "@/lib/mock-data";
import { iconForTaskType } from "@/lib/sa-list-display-map";
import type { UiTone } from "@/lib/ui-tones";

function statusHead(statusRaw: string): string {
  return statusRaw.split(/,/)[0]?.trim() ?? "";
}

type StatusContextTemplate = {
  narrativeTitle?: string;
  descDefault: string;
  primary: string;
  secondary: string;
  badgeNoApply?: string;
  badgeHasApply?: string;
  badgeDefault?: string;
  contextTitleNoApply?: string;
  contextDescNoApply?: string;
  contextTitleHasApply?: string;
  contextTitleDefault?: string;
  contextDescFallback?: string;
  needsApplyTime?: boolean;
};

/** 全量 status → 详情 context（对齐 v0.2.1 映射表 + mock 管家心智） */
const STATUS_CONTEXT: Record<string, StatusContextTemplate> = {
  "101": {
    narrativeTitle: "等待接单",
    descDefault: "请尽快接单并联系客户",
    primary: "接单",
    secondary: "查看客户资料",
    badgeDefault: "待接单",
    contextTitleDefault: "待分配服务商",
    contextDescFallback: "等待服务商接单后开始跟进",
  },
  "102": {
    narrativeTitle: "等待接单",
    descDefault: "请尽快接单并联系客户",
    primary: "接单",
    secondary: "查看客户资料",
    badgeDefault: "待接单",
    contextTitleDefault: "待分派管家",
    contextDescFallback: "等待管家接单",
  },
  "103": {
    narrativeTitle: "等待接单",
    descDefault: "请确认接单并开始跟进",
    primary: "接单",
    secondary: "联系客户",
    badgeDefault: "待接单",
    contextTitleDefault: "待管家接单",
    contextDescFallback: "请确认接单后联系客户",
  },
  "104": {
    narrativeTitle: "需要联系客户",
    descDefault: "请尽快与客户沟通需求，确认上门意向",
    primary: "联系客户",
    secondary: "新增预约时间",
    badgeNoApply: "未预约",
    contextTitleNoApply: "暂无预约时间",
    contextDescNoApply: "请与客户沟通上门时间，完成首次预约",
  },
  "105": {
    narrativeTitle: "待预约上门",
    descDefault: "请与客户确认上门时间",
    primary: "联系客户",
    secondary: "修改预约时间",
    badgeHasApply: "已预约",
    badgeNoApply: "待预约",
    contextTitleHasApply: "已预约时间",
    contextTitleNoApply: "待确认预约",
    contextDescNoApply: "请与客户确认上门服务时间",
    needsApplyTime: true,
  },
  "200": {
    narrativeTitle: "暂不需要上门",
    descDefault: "客户暂不需要上门服务，请保持跟进",
    primary: "联系客户",
    secondary: "记录跟进",
    badgeDefault: "暂不上门",
    contextTitleDefault: "暂不上门",
    contextDescFallback: "关注客户后续需求变化",
  },
  "201": {
    narrativeTitle: "不需要上门",
    descDefault: "客户不需要上门服务，请记录原因并保持联系",
    primary: "联系客户",
    secondary: "记录跟进",
    badgeDefault: "不上门",
    contextTitleDefault: "不需要上门",
    contextDescFallback: "确认客户需求后再安排后续动作",
  },
  "202": {
    narrativeTitle: "待上门服务",
    descDefault: "请按照预约时间上门服务",
    primary: "确认已上门",
    secondary: "修改预约时间",
    badgeHasApply: "已预约",
    contextTitleHasApply: "已预约时间",
    contextTitleNoApply: "待确认上门时间",
    contextDescNoApply: "请与客户确认上门服务时间",
    needsApplyTime: true,
  },
  "203": {
    narrativeTitle: "待客户下单",
    descDefault: "请协助客户完成下单",
    primary: "跟进下单",
    secondary: "查看方案",
    badgeDefault: "待下单",
    contextTitleDefault: "待下单",
    contextDescFallback: "确认方案后推进客户下单",
  },
  "204": {
    narrativeTitle: "上门未成交",
    descDefault: "上门后未成交，请继续跟进客户",
    primary: "联系客户",
    secondary: "记录跟进",
    badgeDefault: "待跟进",
    contextTitleDefault: "上门跟进",
    contextDescFallback: "了解未成交原因并制定下一步计划",
  },
  "205": {
    narrativeTitle: "跟进方案",
    descDefault: "请与客户确认方案和报价",
    primary: "查看方案",
    secondary: "发送报价",
    badgeDefault: "方案确认中",
    contextTitleDefault: "方案与报价",
    contextDescFallback: "请与客户确认方案细节与报价",
  },
  "206": {
    narrativeTitle: "待签约",
    descDefault: "客户已确认方案，请尽快推进签约",
    primary: "跟进签约",
    secondary: "查看报价",
    badgeDefault: "待签约",
    contextTitleDefault: "报价已确认",
    contextDescFallback: "请推进正式签约与下单",
  },
  "207": {
    narrativeTitle: "待客户确认",
    descDefault: "等待客户确认相关信息",
    primary: "联系客户",
    secondary: "查看详情",
    badgeDefault: "待确认",
    contextTitleDefault: "待确认",
    contextDescFallback: "请与客户确认关键信息",
  },
  "300": {
    narrativeTitle: "现场服务中",
    descDefault: "工队阶段服务进行中，请关注现场进展",
    primary: "查看进度",
    secondary: "联系工队",
    badgeDefault: "现场服务",
    contextTitleDefault: "工队服务",
    contextDescFallback: "关注进场交底与施工进展",
  },
  "301": {
    narrativeTitle: "待工队接单",
    descDefault: "等待工队接单并安排进场",
    primary: "联系工队",
    secondary: "查看派工",
    badgeDefault: "待接单",
    contextTitleDefault: "工队接单",
    contextDescFallback: "确认工队接单与进场时间",
  },
  "302": {
    narrativeTitle: "待进场交底",
    descDefault: "请安排工队进场交底",
    primary: "确认进场",
    secondary: "联系工队",
    badgeDefault: "待交底",
    contextTitleDefault: "进场交底",
    contextDescFallback: "确认现场交底与施工安排",
  },
  "401": {
    narrativeTitle: "待验收",
    descDefault: "请安排验收并跟进客户确认",
    primary: "查看验收",
    secondary: "联系客户",
    badgeDefault: "待验收",
    contextTitleDefault: "验收阶段",
    contextDescFallback: "完成验收并确认客户意见",
  },
  "402": {
    narrativeTitle: "待完工",
    descDefault: "施工接近完成，请确认收尾事项",
    primary: "确认完工",
    secondary: "查看现场",
    badgeDefault: "待完工",
    contextTitleDefault: "完工确认",
    contextDescFallback: "确认施工收尾与资料归档",
  },
  "403": {
    narrativeTitle: "已完工",
    descDefault: "工单已完工，请关注回访与评价",
    primary: "查看详情",
    secondary: "联系客户",
    badgeDefault: "已完工",
    contextTitleDefault: "已完工",
    contextDescFallback: "关注客户满意度与尾款事项",
  },
  "407": {
    narrativeTitle: "待支付尾款",
    descDefault: "请跟进尾款支付",
    primary: "跟进回款",
    secondary: "查看账单",
    badgeDefault: "待尾款",
    contextTitleDefault: "尾款待付",
    contextDescFallback: "与客户确认尾款支付进度",
  },
  "501": {
    narrativeTitle: "待客户评价",
    descDefault: "请邀请客户完成服务评价",
    primary: "联系客户",
    secondary: "查看服务",
    badgeDefault: "待评价",
    contextTitleDefault: "待评价",
    contextDescFallback: "跟进客户评价与回访",
  },
  "502": {
    narrativeTitle: "服务已完成",
    descDefault: "客户已评价，本单进入完结态",
    primary: "查看详情",
    secondary: "查看评价",
    badgeDefault: "已评价",
    contextTitleDefault: "已评价",
    contextDescFallback: "服务已完结",
  },
  "999": {
    narrativeTitle: "跟进超时",
    descDefault: "跟进已超时，请立即处理",
    primary: "立即跟进",
    secondary: "联系客户",
    badgeDefault: "超时",
    contextTitleDefault: "跟进超时",
    contextDescFallback: "请尽快联系客户并更新进度",
  },
};

function formatApplyTimeDisplay(applyTimeStr: string): string {
  const s = applyTimeStr.trim();
  if (s.length >= 16) {
    const datePart = s.slice(0, 10);
    const timePart = s.slice(11, 16);
    return `${datePart} ${timePart}`;
  }
  return s;
}

function nodeTime(node: Record<string, unknown>): number {
  const raw = node.updateTime ?? node.createTime;
  if (typeof raw === "string") {
    const t = Date.parse(raw.replace(" ", "T"));
    if (!Number.isNaN(t)) return t;
  }
  return 0;
}

function nodeDefNameFromRecord(node: Record<string, unknown>): string | undefined {
  const nodeDef = node.nodeDef;
  if (nodeDef && typeof nodeDef === "object" && nodeDef !== null) {
    const name = (nodeDef as Record<string, unknown>).name;
    if (typeof name === "string" && name.trim()) return name.trim();
  }
  return undefined;
}

/**
 * 当前流程节点名：优先 hint（列表传入）；否则取未完成节点中 updateTime 最新者。
 */
export function currentNodeDefName(
  workflowNode: unknown,
  nodeDefHint?: string | null
): string | undefined {
  const hint = nodeDefHint?.trim();
  if (hint) return hint;

  if (!Array.isArray(workflowNode)) return undefined;

  let bestName: string | undefined;
  let bestTime = -1;
  for (const node of workflowNode) {
    if (!node || typeof node !== "object") continue;
    const n = node as Record<string, unknown>;
    const stateNum = typeof n.state === "number" ? n.state : Number(n.state);
    if (stateNum === 10) continue;
    const name = nodeDefNameFromRecord(n);
    if (!name) continue;
    const t = nodeTime(n);
    if (t >= bestTime) {
      bestTime = t;
      bestName = name;
    }
  }
  return bestName;
}

export type DetailContextInput = {
  sa: Record<string, unknown>;
  taskType: string;
  statusText: string;
  tone: UiTone;
};

function defaultCtas(taskType: string, statusText: string): { primary: string; secondary: string } {
  const primary = taskType.trim() || statusText.trim() || "工单处理";
  return { primary, secondary: "查看跟进记录" };
}

/** 由 status / describe / applyTimeStr 推导详情「当前任务」与「任务上下文」 */
export function resolveDetailContext(input: DetailContextInput): WorkOrder["context"] {
  const statusRaw =
    typeof input.sa.status === "string"
      ? input.sa.status
      : input.sa.status != null
        ? String(input.sa.status)
        : "";
  const code = statusHead(statusRaw);
  const tmpl = STATUS_CONTEXT[code];
  const fallbacks = defaultCtas(input.taskType, input.statusText);

  const describe =
    typeof input.sa.describe === "string" ? input.sa.describe.trim() : "";
  const applyTimeStr =
    typeof input.sa.applyTimeStr === "string" ? input.sa.applyTimeStr.trim() : "";
  const hasApply = applyTimeStr.length > 0;

  const title = tmpl?.narrativeTitle ?? input.taskType;
  const desc = describe || tmpl?.descDefault || input.statusText;

  let badge: string;
  if (hasApply) {
    badge = tmpl?.badgeHasApply ?? "已预约";
  } else if (code === "104") {
    badge = tmpl?.badgeNoApply ?? "未预约";
  } else {
    badge = tmpl?.badgeDefault ?? input.statusText;
  }

  let contextTitle: string;
  let contextDesc: string;
  if (hasApply) {
    contextTitle = tmpl?.contextTitleHasApply ?? "已预约时间";
    contextDesc = formatApplyTimeDisplay(applyTimeStr);
  } else if (code === "104") {
    contextTitle = tmpl?.contextTitleNoApply ?? "暂无预约时间";
    contextDesc = tmpl?.contextDescNoApply ?? "请与客户沟通上门时间，完成首次预约";
  } else if (tmpl?.needsApplyTime && !hasApply) {
    contextTitle = tmpl.contextTitleNoApply ?? "待确认时间";
    contextDesc = tmpl.contextDescNoApply ?? input.statusText;
  } else {
    contextTitle = tmpl?.contextTitleDefault ?? input.statusText;
    contextDesc = describe || tmpl?.contextDescFallback || input.statusText;
  }

  const primary = tmpl?.primary ?? fallbacks.primary;
  const secondary = tmpl?.secondary ?? fallbacks.secondary;

  return {
    title,
    desc,
    badge,
    primary,
    secondary,
    tone: input.tone,
    contextIcon: iconForTaskType(input.taskType),
    contextTitle,
    contextDesc,
  };
}
