"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const TRUST = [
  { icon: "♢", label: "专业可靠" },
  { icon: "◴", label: "高效便捷" },
  { icon: "♙", label: "安全保障" },
];

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"methods" | "form">("methods");
  const [phone, setPhone] = useState("180 0321 8877");
  const [agreed, setAgreed] = useState(false);
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
    <div className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-md flex-col px-4 pb-8 pt-5">
      {step === "methods" ? (
        <>
          <div className="mt-8 flex flex-col items-center">
            <div className="flex items-center gap-2">
              <BrandMark />
              <div>
                <p className="text-[2rem] font-black leading-none text-[#1f77f0]">修链</p>
                <p className="mt-2 text-xs font-extrabold tracking-[0.35em] text-[#1f77f0]">量顶维修</p>
              </div>
            </div>
            <p className="mt-10 text-center text-[15px] font-bold leading-relaxed text-[#102340]">
              让屋顶维修更专业、更高效
            </p>
          </div>
          <div className="mt-8 overflow-hidden rounded-3xl border border-[#eaf0f8] bg-gradient-to-b from-[#f8fbff] to-[#e9f1ff] shadow-inner">
            <div className="h-40 bg-gradient-to-b from-[#f8fbff] via-[#eef5ff] to-[#e9f1ff]" aria-hidden />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-[#eaf0f8] pt-5">
            {TRUST.map((t) => (
              <div key={t.label} className="flex flex-col items-center gap-2 text-center text-xs font-semibold text-[#31415b]">
                <span className="text-lg font-extrabold text-[#1478f2]">{t.icon}</span>
                {t.label}
              </div>
            ))}
          </div>
          <p className="mt-auto pt-8 text-center text-xs text-[#9aa7bb]">版本号：v0.1.0（Web）</p>
          <button
            type="button"
            className="mt-4 h-12 w-full rounded-xl bg-[rgba(20,120,242,0.08)] text-[15px] font-extrabold text-[#1478f2]"
            onClick={() => setStep("form")}
          >
            进入登录
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            className="mt-2 text-3xl font-light leading-none text-[#16243d]"
            onClick={() => setStep("methods")}
            aria-label="返回"
          >
            ‹
          </button>
          <div className="mt-4 flex justify-center">
            <div className="flex scale-90 items-center gap-2">
              <BrandMark />
              <div>
                <p className="text-3xl font-black text-[#1f77f0]">修链</p>
                <p className="text-xs font-extrabold tracking-[0.3em] text-[#1f77f0]">量顶维修</p>
              </div>
            </div>
          </div>
          <h1 className="mt-10 text-center text-xl font-extrabold text-[#111b31]">验证码登录</h1>
          <p className="mt-2 text-center text-sm text-[#8a95a8]">未注册的手机号验证后将自动创建账户</p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="text-xs font-bold text-[#526079]">手机号</label>
              <input
                className="mt-2 h-11 w-full rounded-xl border border-[#dbe5f2] bg-white px-3 text-base text-[#19253d] shadow-sm outline-none ring-[#1478ff] focus:ring-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#526079]">验证码</label>
              <div className="mt-2 flex h-11 items-center rounded-xl border border-[#dbe5f2] bg-white pr-2 shadow-sm">
                <input
                  className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none"
                  placeholder="演示可留空"
                  readOnly
                />
                <button type="button" className="shrink-0 px-2 text-xs font-extrabold text-[#1478f2]" onClick={() => window.alert("验证码已发送")}>
                  获取验证码
                </button>
              </div>
            </div>
            <p className="text-xs text-[#8995a7]">
              演示：手机号填 <code className="rounded bg-[#f0f4fa] px-1">error</code> 模拟失败。
            </p>
            <label className="flex cursor-pointer items-start gap-2 text-sm text-[#8995a7]">
              <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} className="mt-0.5" />
              我已阅读并同意《用户协议》与《隐私政策》
            </label>
            {err ? (
              <p className="text-sm font-semibold text-[#ff4052]" role="alert">
                {err}
              </p>
            ) : null}
            <button type="button" className="primary-btn w-full disabled:opacity-60" onClick={() => void submit()} disabled={loading}>
              {loading ? "登录中…" : "登录"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function BrandMark() {
  return (
    <div className="relative h-14 w-[4.25rem] shrink-0">
      <span className="absolute left-1 top-1 h-11 w-11 rounded-full bg-[#ffca1b]" />
      <span
        className="absolute left-5 top-8 h-5 w-10 border-b-[10px] border-l-[10px] border-[#1f77f0]"
        style={{ transform: "rotate(-45deg)" }}
        aria-hidden
      />
      <span className="absolute bottom-3 right-0.5 h-3 w-3 rotate-45 bg-[#0a46a8]" aria-hidden />
    </div>
  );
}
