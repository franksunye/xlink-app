"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { tabIdFromPathname, type AppTabId } from "@/lib/tab-navigation";
import HomeScreen from "@/components/screens/HomeScreen";
import WorkOrdersScreen from "@/components/screens/WorkOrdersScreen";
import ProjectsScreen from "@/components/screens/ProjectsScreen";
import AccountScreen from "@/components/screens/AccountScreen";

const TAB_SCREENS: Record<AppTabId, () => ReactNode> = {
  home: () => <HomeScreen />,
  tasks: () => <WorkOrdersScreen />,
  projects: () => <ProjectsScreen />,
  account: () => <AccountScreen />,
};

function TabPanel({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={active ? "block" : "hidden"}
      hidden={!active}
      aria-hidden={!active}
      inert={!active}
    >
      {children}
    </div>
  );
}

/**
 * Keeps visited tab screens mounted (app-like) while URL still updates for deep links.
 * Non-tab routes (e.g. work order detail) render `children` from the App Router.
 */
export function AppTabShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const activeTab = tabIdFromPathname(pathname);
  const [mounted, setMounted] = useState<Set<AppTabId>>(() =>
    activeTab ? new Set([activeTab]) : new Set()
  );

  useEffect(() => {
    if (!activeTab) return;
    setMounted((prev) => {
      if (prev.has(activeTab)) return prev;
      const next = new Set(prev);
      next.add(activeTab);
      return next;
    });
  }, [activeTab]);

  if (!activeTab) {
    return <>{children}</>;
  }

  return (
    <>
      {(Array.from(mounted) as AppTabId[]).map((tab) => {
        const render = TAB_SCREENS[tab];
        return (
          <TabPanel key={tab} active={tab === activeTab}>
            {render()}
          </TabPanel>
        );
      })}
    </>
  );
}
