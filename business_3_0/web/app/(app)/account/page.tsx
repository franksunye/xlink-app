"use client";

import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-[var(--xlink-text)]">我的</h1>
      <div className="panel p-4">
        <p className="text-sm text-[var(--xlink-muted)]">服务商 · 演示账号</p>
        <p className="mt-2 text-base font-semibold text-[var(--xlink-text)]">张工</p>
      </div>
      <button
        type="button"
        className="w-full rounded-xl border border-[var(--xlink-line)] py-3 text-sm font-semibold text-[var(--xlink-text)] active:bg-[var(--xlink-panel-soft)]"
        onClick={() => void logout()}
      >
        退出登录
      </button>
    </div>
  );
}
