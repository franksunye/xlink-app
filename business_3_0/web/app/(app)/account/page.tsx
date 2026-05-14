"use client";

import { useRouter } from "next/navigation";
import { type HomeVariant, writeHomeVariant } from "@/lib/home-variant";
import { useHomeVariant } from "@/lib/use-home-variant";

const HOME_OPTIONS: { value: HomeVariant; label: string; desc: string }[] = [
  { value: "task", label: "方案 A：任务优先", desc: "突出下一步行动和今日任务" },
  { value: "metrics", label: "方案 B：数据概览", desc: "突出任务总览、关键数据和快捷操作" },
];

export default function AccountPage() {
  const router = useRouter();
  const homeVariant = useHomeVariant();

  const currentLabel =
    HOME_OPTIONS.find((o) => o.value === homeVariant)?.label.replace("方案 ", "") ?? "A：任务优先";

  function setVariant(v: HomeVariant) {
    writeHomeVariant(v);
    window.alert("首页方案已切换");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="px-3.5 pb-4 pt-4">
      <h1 className="mb-4 text-xl font-black text-[#111827]">我的</h1>
      <div className="overflow-hidden rounded-[14px] border border-[#e8edf4] bg-white shadow-[0_12px_28px_rgba(22,40,72,0.06)]">
      <div className="flex items-center gap-4 border-b border-[#edf1f5] p-4">
        <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-lg bg-[#176b87] text-sm font-extrabold text-white">
          B3
        </div>
        <div className="min-w-0">
          <p className="text-base font-extrabold text-[#182338]">Business 3.0 体验账号</p>
          <p className="mt-1 text-sm text-[#6b7485]">当前模式：{homeVariant === "task" ? "任务优先" : "数据概览"}</p>
        </div>
      </div>

      <div className="border-b border-[#edf1f5] p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[15px] font-extrabold text-[#182338]">首页方案</p>
            <p className="mt-1 text-sm leading-relaxed text-[#6b7485]">用于测试不同首页对处理效率的影响</p>
          </div>
          <span className="shrink-0 rounded-full bg-[#eaf3ff] px-2.5 py-1 text-xs font-extrabold text-[#1478ff]">
            {currentLabel}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {HOME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setVariant(opt.value)}
              className={`min-h-[5.5rem] rounded-xl border px-3 py-3 text-left transition ${
                homeVariant === opt.value
                  ? "border-[#1478ff] bg-[#f4f9ff]"
                  : "border-[#dce3ea] bg-white active:bg-[#f8fafc]"
              }`}
            >
              <span
                className={`block text-sm font-extrabold leading-snug ${
                  homeVariant === opt.value ? "text-[#1478ff]" : "text-[#182338]"
                }`}
              >
                {opt.label}
              </span>
              <span className="mt-2 block text-xs leading-relaxed text-[#6b7485]">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-[#edf1f5]">
        <div className="flex min-h-[3.25rem] items-center justify-between px-4 text-sm font-bold text-[#182338]">
          <span>体验版本</span>
          <span className="font-extrabold text-[#176b87]">0.1.0</span>
        </div>
        <div className="flex min-h-[3.25rem] items-center justify-between px-4 text-sm font-bold text-[#182338]">
          <span>数据来源</span>
          <span className="font-extrabold text-[#176b87]">本地 Mock</span>
        </div>
        <button
          type="button"
          className="flex min-h-[3.25rem] w-full items-center justify-between px-4 text-left text-sm font-bold text-[#182338] active:bg-[#f8fafc]"
          onClick={() => window.alert("体验反馈（v0.1 未接独立路由）")}
        >
          <span>提交反馈</span>
          <span className="font-extrabold text-[#176b87]">进入 ›</span>
        </button>
      </div>

      <div className="p-4">
        <button
          type="button"
          className="w-full rounded-xl border border-[#dce5f0] py-3 text-sm font-extrabold text-[#1f2937] transition active:bg-[#f8fafc]"
          onClick={() => void logout()}
        >
          退出登录
        </button>
      </div>
      </div>
    </div>
  );
}
