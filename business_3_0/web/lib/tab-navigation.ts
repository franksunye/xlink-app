/** Bottom tab roots — detail routes (e.g. /work-orders/[id]) are not tabs. */
export const APP_TAB_HREFS = ["/", "/work-orders", "/projects", "/account"] as const;

export type AppTabId = "home" | "tasks" | "projects" | "account";

const TAB_BY_HREF: Record<(typeof APP_TAB_HREFS)[number], AppTabId> = {
  "/": "home",
  "/work-orders": "tasks",
  "/projects": "projects",
  "/account": "account",
};

export function tabIdFromPathname(pathname: string): AppTabId | null {
  if (pathname in TAB_BY_HREF) return TAB_BY_HREF[pathname as keyof typeof TAB_BY_HREF];
  return null;
}

export function isAppTabPathname(pathname: string): boolean {
  return tabIdFromPathname(pathname) !== null;
}
