"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LoginBrandMark, LoginWorkerScene } from "@/components/login/LoginWorkerScene";
import { InlineToast } from "@/components/ui/InlineToast";

const TRUST = [
  { icon: "♢", label: "专业可靠" },
  { icon: "◴", label: "高效便捷" },
  { icon: "♙", label: "安全保障" },
];

type Step = "launch" | "methods" | "form";
type AuthMode = "code" | "password";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(() => {
    if (typeof window === "undefined") return "launch";
    return new URLSearchParams(window.location.search).get("step") === "methods" ? "methods" : "launch";
  });
  const [authMode, setAuthMode] = useState<AuthMode>("code");
  const [phone, setPhone] = useState("180 0321 8877");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [codeHint, setCodeHint] = useState<string | null>(null);
  const launchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (step !== "launch") return;
    launchTimer.current = setTimeout(() => setStep("methods"), 1200);
    return () => {
      if (launchTimer.current) clearTimeout(launchTimer.current);
    };
  }, [step]);

  function skipLaunch() {
    if (launchTimer.current) {
      clearTimeout(launchTimer.current);
      launchTimer.current = null;
    }
    setStep("methods");
  }

  async function postLogin(body: Record<string, unknown>) {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data.message === "string" && data.message.trim()
            ? data.message.trim()
            : data.error === "login_failed"
              ? "手机号或验证码不正确"
              : data.error === "agreement_required"
                ? "请先同意协议"
                : "请稍后重试";
        setErr(msg);
        return;
      }
      router.replace("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function submitForm() {
    if (!phone.trim()) {
      setErr("请输入手机号");
      return;
    }
    if (phone.trim().toLowerCase() === "error") {
      setErr("登录失败");
      return;
    }
    if (!agreed) {
      setErr("请先同意协议");
      return;
    }
    if (authMode === "password" && !password.trim()) {
      setErr("请输入登录密码");
      return;
    }
    await postLogin({
      phone,
      agreed,
      method: authMode === "password" ? "password" : "code",
      code: authMode === "code" ? code : undefined,
      password: authMode === "password" ? password : undefined,
    });
  }

  async function quickLogin() {
    if (!phone.trim()) {
      setErr("请输入手机号");
      return;
    }
    setAgreed(true);
    setCode("999999");
    setToast("已使用测试验证码登录");
    await postLogin({ phone, agreed: true, method: "code", code: "999999" });
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-md flex-col pb-10 pt-0">
      <InlineToast message={toast} onClear={() => setToast(null)} />
      {step === "launch" ? (
        <>
          <div className="flex h-6 items-center justify-between text-xs font-bold text-[#050b18]">
            <span>9:41</span>
            <span className="flex items-end gap-0.5">
              <span className="block h-[5px] w-[3px] rounded-sm bg-[#0b1020]" />
              <span className="block h-2 w-[3px] rounded-sm bg-[#0b1020]" />
              <span className="block h-2.5 w-[3px] rounded-sm bg-[#0b1020]" />
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center">
            <div className="mt-16 flex items-center gap-3">
              <LoginBrandMark />
              <div>
                <p className="text-[2rem] font-black leading-none text-[#1f77f0]">修链</p>
                <p className="mt-2 text-xs font-extrabold tracking-[0.35em] text-[#1f77f0]">量顶维修</p>
              </div>
            </div>
            <p className="mt-12 text-center text-[15px] font-bold leading-relaxed text-[#102340]">
              让屋顶维修更专业、更高效
            </p>
            <LoginWorkerScene />
            <div className="mt-6 w-full border-t border-[#eaf0f8] pt-5">
              <div className="grid grid-cols-3 gap-2">
                {TRUST.map((t) => (
                  <div
                    key={t.label}
                    className="flex flex-col items-center gap-2 text-center text-xs font-semibold text-[#31415b]"
                  >
                    <span className="text-lg font-extrabold text-[#1478f2]">{t.icon}</span>
                    {t.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-[#9aa7bb]">版本号：v0.2.4（Web）</p>
          <button
            type="button"
            className="mt-3 h-12 w-full rounded-xl bg-[rgba(20,120,242,0.08)] text-[15px] font-extrabold text-[#1478f2]"
            onClick={skipLaunch}
          >
            进入登录
          </button>
        </>
      ) : null}

      {step === "methods" ? (
        <div className="flex min-h-[calc(100dvh-6rem)] flex-col">
          <div className="mt-10 flex justify-center">
            <div className="flex scale-90 items-center gap-2">
              <LoginBrandMark />
              <div>
                <p className="text-3xl font-black text-[#1f77f0]">修链</p>
                <p className="text-xs font-extrabold tracking-[0.3em] text-[#1f77f0]">量顶维修</p>
              </div>
            </div>
          </div>
          <h1 className="mt-10 text-center text-xl font-extrabold text-[#111b31]">选择登录方式</h1>
          <div className="mt-8 flex flex-col gap-4">
            <button
              type="button"
              className="flex min-h-[3.5rem] items-center gap-3 rounded-2xl border border-[#e0e9f5] bg-white/90 px-4 py-3 text-left shadow-[0_12px_22px_rgba(29,78,145,0.06)]"
              onClick={() => {
                setAuthMode("code");
                setStep("form");
                setErr(null);
              }}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ecf5ff] text-lg font-extrabold text-[#1478f2]">
                ▣
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-extrabold text-[#17233d]">验证码登录</span>
                <span className="mt-1 block text-xs text-[#8b97aa]">通过手机号验证登录</span>
              </span>
              <span className="shrink-0 rounded-full bg-[#dff8e8] px-2 py-0.5 text-xs font-extrabold text-[#19b66a]">
                推荐
              </span>
            </button>
            <button
              type="button"
              className="flex min-h-[3.5rem] items-center gap-3 rounded-2xl border border-[#e0e9f5] bg-white/90 px-4 py-3 text-left shadow-[0_12px_22px_rgba(29,78,145,0.06)]"
              onClick={() => {
                setAuthMode("password");
                setStep("form");
                setErr(null);
              }}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef6ff] text-lg font-extrabold text-[#1478f2]">
                ▥
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-extrabold text-[#17233d]">密码登录</span>
                <span className="mt-1 block text-xs text-[#8b97aa]">使用账号密码登录</span>
              </span>
              <span className="text-2xl font-light text-[#b7c1d2]">›</span>
            </button>
            <button
              type="button"
              className="flex min-h-[3.5rem] items-center gap-3 rounded-2xl border border-[#e0e9f5] bg-white/90 px-4 py-3 text-left shadow-[0_12px_22px_rgba(29,78,145,0.06)]"
              onClick={() => void quickLogin()}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff8e4] text-lg font-extrabold text-[#b88700]">
                ◒
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-extrabold text-[#17233d]">快捷登录</span>
                <span className="mt-1 block text-xs text-[#8b97aa]">一键登录，安全便捷</span>
              </span>
              <span className="text-2xl font-light text-[#b7c1d2]">›</span>
            </button>
          </div>
          <p className="mt-auto pb-4 pt-10 text-center text-xs leading-relaxed text-[#9aa7bb]">
            登录即表示同意《用户协议》与《隐私政策》
          </p>
        </div>
      ) : null}

      {step === "form" ? (
        <div className="flex min-h-[calc(100dvh-6rem)] flex-col">
          <button
            type="button"
            className="mt-2 w-12 text-left text-4xl font-light leading-none text-[#16243d]"
            onClick={() => {
              setStep("methods");
              setErr(null);
            }}
            aria-label="返回"
          >
            ‹
          </button>
          <div className="mt-2 flex justify-center">
            <div className="flex scale-90 items-center gap-2">
              <LoginBrandMark />
              <div>
                <p className="text-3xl font-black text-[#1f77f0]">修链</p>
                <p className="text-xs font-extrabold tracking-[0.3em] text-[#1f77f0]">量顶维修</p>
              </div>
            </div>
          </div>
          <h1 className="mt-8 text-center text-xl font-extrabold text-[#111b31]">
            {authMode === "password" ? "密码登录" : "验证码登录"}
          </h1>
          <p className="mt-2 px-2 text-center text-sm text-[#8a95a8]">
            {authMode === "password"
              ? "使用手机号或员工账号登录"
              : "未注册的手机号验证后将自动创建账户"}
          </p>

          <div className="mt-8 space-y-1">
            <label className="text-xs font-bold text-[#526079]">手机号</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border border-[#dbe5f2] bg-white px-3 text-base text-[#19253d] shadow-sm outline-none ring-[#1478ff] focus:ring-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>

          <div className="mt-4 space-y-1">
            <label className="text-xs font-bold text-[#526079]">
              {authMode === "password" ? "密码" : "验证码"}
            </label>
            {authMode === "code" ? (
              <>
                <div className="mt-2 flex h-11 items-center rounded-xl border border-[#dbe5f2] bg-white pr-2 shadow-sm">
                  <input
                    className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none"
                    placeholder="请输入短信验证码"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    autoComplete="one-time-code"
                  />
                  <button
                    type="button"
                    className="shrink-0 px-2 text-xs font-extrabold text-[#1478f2]"
                    onClick={() => {
                      setCode("999999");
                      setCodeHint("Beta 环境已填入测试验证码 999999");
                      setErr(null);
                    }}
                  >
                    填入测试码
                  </button>
                </div>
                {codeHint ? (
                  <p className="mt-1.5 text-xs font-semibold text-[#19b66a]">{codeHint}</p>
                ) : (
                  <p className="mt-1.5 text-xs text-[#8995a7]">未接短信网关时，可点「填入测试码」</p>
                )}
              </>
            ) : (
              <input
                type="password"
                className="mt-2 h-11 w-full rounded-xl border border-[#dbe5f2] bg-white px-3 text-base shadow-sm outline-none ring-[#1478ff] focus:ring-2"
                placeholder="请输入登录密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            )}
          </div>

          <p className="mt-2 text-xs text-[#8995a7]">
            Beta 联调：测试账号验证码可用固定码{" "}
            <code className="rounded bg-[#f0f4fa] px-1">999999</code>；演示失败填{" "}
            <code className="rounded bg-[#f0f4fa] px-1">error</code>。
          </p>

          <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm text-[#8995a7]">
            <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} className="mt-0.5" />
            我已阅读并同意《用户协议》与《隐私政策》
          </label>

          {err ? (
            <p className="mt-2 text-sm font-semibold text-[#ff4052]" role="alert">
              {err}
            </p>
          ) : null}

          <button
            type="button"
            className="primary-btn mt-8 w-full disabled:opacity-60"
            onClick={() => void submitForm()}
            disabled={loading}
          >
            {loading ? "登录中…" : "登录"}
          </button>

          <div className="mt-12 flex items-center gap-3 text-xs text-[#a0aabb]">
            <span className="h-px flex-1 bg-[#e6edf6]" />
            其他登录方式
            <span className="h-px flex-1 bg-[#e6edf6]" />
          </div>
          <div className="mt-6 flex justify-center gap-16">
            <button
              type="button"
              className="flex flex-col items-center gap-2 text-xs font-semibold text-[#48566e]"
              onClick={() => {
                setAuthMode("password");
                setErr(null);
              }}
            >
              <span className="text-xl">▤</span>
              密码登录
            </button>
            <button
              type="button"
              className="flex flex-col items-center gap-2 text-xs font-semibold text-[#48566e]"
              onClick={() => void quickLogin()}
            >
              <span className="text-xl">▥</span>
              快捷登录
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
