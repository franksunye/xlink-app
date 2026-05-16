/** 与 archive `business_3_0` 概念版色条 / 图标渐变对齐（蓝绿橙紫红）。 */

export type UiTone = "blue" | "green" | "orange" | "purple" | "red" | "gray";

export function isUiTone(t: string | undefined): t is UiTone {
  return (
    t === "blue" ||
    t === "green" ||
    t === "orange" ||
    t === "purple" ||
    t === "red" ||
    t === "gray"
  );
}

export function taskCardStripeClass(tone: string | undefined): string {
  const t = isUiTone(tone) ? tone : "blue";
  const map: Record<UiTone, string> = {
    blue: "bg-[#1478ff]",
    red: "bg-[#ff4052]",
    orange: "bg-[#ff8a1a]",
    purple: "bg-[#7459e8]",
    green: "bg-[#18ae65]",
    gray: "bg-[#94a3b8]",
  };
  return map[t];
}

export function taskIconWrapClass(tone: string | undefined): string {
  const t = isUiTone(tone) ? tone : "blue";
  const map: Record<UiTone, string> = {
    blue: "bg-gradient-to-br from-[#258bff] to-[#005ff0]",
    green: "bg-gradient-to-br from-[#45d589] to-[#18a960]",
    orange: "bg-gradient-to-br from-[#ffad3c] to-[#ff7a10]",
    purple: "bg-gradient-to-br from-[#8e75f8] to-[#5c43d8]",
    red: "bg-gradient-to-br from-[#ff5b5d] to-[#f12f43]",
    gray: "bg-gradient-to-br from-[#94a3b8] to-[#64748b]",
  };
  return map[t];
}

export function overviewIconClass(tone: string | undefined): string {
  return taskIconWrapClass(tone);
}

export function overviewValueClass(tone: string | undefined): string {
  const t = isUiTone(tone) ? tone : "blue";
  const map: Record<UiTone, string> = {
    blue: "text-[#1478ff]",
    green: "text-[#18ae65]",
    orange: "text-[#ff7a0a]",
    purple: "text-[#6042dd]",
    red: "text-[#ff4052]",
    gray: "text-[#64748b]",
  };
  return map[t];
}

export function deltaTextClass(tone: string): string {
  if (tone === "up") return "text-[#ff4052]";
  if (tone === "down") return "text-[#18ae65]";
  return "text-[#8b94a3]";
}

export function quickIconClass(tone: string | undefined): string {
  return taskIconWrapClass(tone);
}

/** 列表卡片角标（与详情 `detailTagClass` 色系一致） */
export function listTagClass(tone: string | undefined): string {
  if (tone === "red") return "bg-[#ffe8e9] text-[#ff4052]";
  if (tone === "orange") return "bg-[#fff0dc] text-[#ff8a1a]";
  if (tone === "green") return "bg-[#e8f8ef] text-[#18ae65]";
  if (tone === "purple") return "bg-[#efeaff] text-[#7459e8]";
  if (tone === "gray") return "bg-[#f1f5f9] text-[#64748b]";
  return "bg-[#eef5ff] text-[#2563eb]";
}

export function detailTagClass(tone: string | undefined): string {
  return listTagClass(tone);
}

export function phoneButtonTextClass(tone: string | undefined): string {
  const t = isUiTone(tone) ? tone : "blue";
  const map: Record<UiTone, string> = {
    blue: "text-[#1478ff]",
    red: "text-[#ff4052]",
    orange: "text-[#ff8a1a]",
    purple: "text-[#7459e8]",
    green: "text-[#18ae65]",
    gray: "text-[#64748b]",
  };
  return map[t];
}

/** 详情页「当前任务」卡片边框/背景 */
export function currentCardShellClass(tone: string | undefined): string {
  const t = isUiTone(tone) ? tone : "blue";
  const map: Record<UiTone, string> = {
    blue: "border-[#cfe3ff] bg-[#f7fbff]",
    red: "border-[#ffd1d7] bg-[#fff8f9]",
    orange: "border-[#ffd9ad] bg-[#fffaf4]",
    purple: "border-[#dccfff] bg-[#fbf8ff]",
    green: "border-[#ccefdc] bg-[#f7fffa]",
    gray: "border-[#d8dde6] bg-[#fbfcfe]",
  };
  return map[t];
}

export function sectionEyebrowClass(tone: string | undefined): string {
  const t = isUiTone(tone) ? tone : "blue";
  const map: Record<UiTone, string> = {
    blue: "text-[#1478ff]",
    red: "text-[#ff4052]",
    orange: "text-[#ff8a1a]",
    purple: "text-[#7459e8]",
    green: "text-[#18ae65]",
    gray: "text-[#687386]",
  };
  return map[t];
}

export function primaryActionClass(tone: string | undefined): string {
  const t = isUiTone(tone) ? tone : "blue";
  const map: Record<UiTone, string> = {
    blue: "bg-[#1478ff]",
    red: "bg-[#ff4052]",
    orange: "bg-[#ff8a1a]",
    purple: "bg-[#7459e8]",
    green: "bg-[#18ae65]",
    gray: "bg-[#8b94a3]",
  };
  return map[t];
}
