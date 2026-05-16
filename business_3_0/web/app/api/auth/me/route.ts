import { cookies } from "next/headers";
import { PROFILE_COOKIE } from "@/lib/auth";
import { parseProfileCookie } from "@/lib/cloud-session";
import { jsonResponse } from "@/lib/http";
import { getSessionFromCookies } from "@/lib/session";
import { mockUser } from "@/lib/mock-data";

export async function GET() {
  if (!(await getSessionFromCookies())) {
    return jsonResponse({ error: "unauthorized" }, { status: 401 });
  }

  const c = await cookies();
  const profile = parseProfileCookie(c.get(PROFILE_COOKIE)?.value);
  if (profile) {
    return jsonResponse({
      user: {
        userId: profile.userId,
        displayName: profile.displayName,
        role: profile.roleName,
        roleId: profile.roleId,
      },
    });
  }

  return jsonResponse({ user: mockUser });
}
