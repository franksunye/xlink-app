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
    <div className="space-y-4 px-3.5 pb-4 pt-4">
      <h1 className="text-xl font-black text-[#111827]">我的</h1>
      <section className="rounded-[14px] border border-[#e8edf4] bg-white p-5 shadow-[0_12px_28px_rgba(22,40,72,0.06)]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#258bff] to-[#005ff0] text-xl font-black text-white">
            张
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748b]">服务商 · 演示账号</p>
            <p className="mt-1 text-lg font-black text-[#101827]">张工</p>
          </div>
        </div>
      </section>
      <button
        type="button"
        className="w-full rounded-2xl border border-[#dce5f0] bg-white py-3.5 text-sm font-extrabold text-[#1f2937] shadow-sm transition active:bg-[#f8fafc]"
        onClick={() => void logout()}
      >
        退出登录
      </button>
    </div>
  );
}
