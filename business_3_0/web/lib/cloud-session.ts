import type { NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/auth";

export type UserProfile = {
  userId: string;
  displayName: string;
  roleId: string;
  roleName: string;
  companyName?: string;
};

/** Priority: login cookie → x-xlink-jsessionid → XLINK_CLOUD_READ_JSESSIONID */
export function resolveJSessionIdFromSources(sources: {
  sessionCookie?: string | null;
  headerJSessionId?: string | null;
  envJSessionId?: string | null;
}): string | null {
  const fromCookie = sources.sessionCookie?.trim();
  if (fromCookie && fromCookie !== "mock-ok" && isValidSessionToken(fromCookie)) {
    return fromCookie;
  }
  const fromHeader = sources.headerJSessionId?.trim();
  if (fromHeader) return fromHeader;
  const fromEnv = sources.envJSessionId?.trim();
  return fromEnv || null;
}

export function resolveCloudJSessionId(req: NextRequest): string | null {
  return resolveJSessionIdFromSources({
    sessionCookie: req.cookies.get(SESSION_COOKIE)?.value,
    headerJSessionId:
      req.headers.get("x-xlink-jsessionid") ?? req.headers.get("X-Xlink-Jsessionid"),
    envJSessionId: process.env.XLINK_CLOUD_READ_JSESSIONID,
  });
}

export function buildCloudCookieHeaderFromSession(
  jsessionId: string | null | undefined,
  incomingCookie?: string | null
): string | null {
  const sid = jsessionId?.trim();
  let c = (incomingCookie ?? "").trim();
  if (sid) {
    c = c
      .replace(/(?:^|;)\s*JSESSIONID=[^;]*/gi, "")
      .replace(/^;\s*|\s*;\s*$/g, "")
      .trim();
    c = (c ? `${c}; ` : "") + `JSESSIONID=${sid}`;
  }
  return c.length > 0 ? c : null;
}

export function parseProfileCookie(value: string | undefined): UserProfile | null {
  if (!value?.trim()) return null;
  try {
    const raw = JSON.parse(value) as Partial<UserProfile>;
    if (
      typeof raw.userId === "string" &&
      typeof raw.displayName === "string" &&
      typeof raw.roleId === "string" &&
      typeof raw.roleName === "string"
    ) {
      const companyName =
        typeof raw.companyName === "string" && raw.companyName.trim()
          ? raw.companyName.trim()
          : undefined;
      return {
        userId: raw.userId,
        displayName: raw.displayName,
        roleId: raw.roleId,
        roleName: raw.roleName,
        ...(companyName ? { companyName } : {}),
      };
    }
  } catch {
    return null;
  }
  return null;
}

export function serializeProfileCookie(profile: UserProfile): string {
  return JSON.stringify(profile);
}
