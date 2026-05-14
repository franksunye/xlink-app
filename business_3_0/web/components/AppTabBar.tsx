"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "首页" },
  { href: "/work-orders", label: "任务" },
  { href: "/projects", label: "项目" },
  { href: "/account", label: "我的" },
] as const;

export function AppTabBar() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--xlink-line)] bg-[var(--xlink-panel)] pb-[env(safe-area-inset-bottom)]"
      aria-label="主导航"
    >
      <div className="mx-auto flex max-w-lg justify-around">
        {tabs.map((t) => {
          const active =
            t.href === "/"
              ? pathname === "/"
              : pathname === t.href || pathname.startsWith(`${t.href}/`);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-xs font-medium ${
                active
                  ? "text-[var(--xlink-primary)]"
                  : "text-[var(--xlink-muted)]"
              }`}
            >
              <span
                className={`h-1 w-8 rounded-full ${active ? "bg-[var(--xlink-primary)]" : "bg-transparent"}`}
                aria-hidden
              />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
