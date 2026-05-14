"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("180 0321 8877");
  const [agreed, setAgreed] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setErr(null);
    if (!agreed) {
      setErr("请先阅读并同意协议");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone, agreed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error === "login_failed" ? "登录失败" : "请稍后重试");
        return;
      }
      router.replace("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 pt-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--xlink-text)]">修链</h1>
        <p className="mt-1 text-sm text-[var(--xlink-muted)]">量顶维修 · 服务商登录</p>
      </div>
      <div className="panel space-y-4 p-5">
        <label className="block text-sm font-medium text-[var(--xlink-text)]">
          手机号
          <input
            className="mt-1 w-full rounded-lg border border-[var(--xlink-line)] px-3 py-2.5 text-base outline-none ring-[var(--xlink-primary)] focus:ring-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </label>
        <p className="text-xs text-[var(--xlink-muted)]">
          演示环境：输入手机号 <code className="rounded bg-[var(--xlink-panel-soft)] px-1">error</code>{" "}
          可模拟失败。
        </p>
        <label className="flex cursor-pointer items-start gap-2 text-sm text-[var(--xlink-muted)]">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            className="mt-0.5"
          />
          我已阅读并同意《用户协议》与《隐私政策》
        </label>
        {err ? (
          <p className="text-sm text-[var(--xlink-red)]" role="alert">
            {err}
          </p>
        ) : null}
        <button
          type="button"
          className="primary-btn w-full disabled:opacity-60"
          onClick={() => void submit()}
          disabled={loading}
        >
          {loading ? "登录中…" : "登录"}
        </button>
      </div>
    </div>
  );
}
