"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconAccount, IconHome, IconProjects, IconTasks } from "@/components/TabBarIcons";

const tabs = [
  { href: "/", label: "首页", Icon: IconHome },
  { href: "/work-orders", label: "任务", Icon: IconTasks },
  { href: "/projects", label: "项目", Icon: IconProjects },
  { href: "/account", label: "我的", Icon: IconAccount },
] as const;

export function AppTabBar() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e6edf6] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(22,40,72,0.06)]"
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
              prefetch
              scroll={false}
              className={`flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[10px] font-bold ${
                active ? "text-[var(--xlink-primary)]" : "text-[var(--xlink-tab-inactive)]"
              }`}
            >
              <t.Icon active={active} />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
