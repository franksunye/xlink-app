import { NextRequest } from "next/server";
import {
  PROFILE_COOKIE,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth";
import {
  type UserProfile,
  serializeProfileCookie,
} from "@/lib/cloud-session";
import { jsonResponse } from "@/lib/http";
import { mockUser } from "@/lib/mock-data";
import { cloudReadBaseUrl, isCloudReadConfigured } from "@/lib/work-order-cloud-read";

const DEFAULT_TENANT_ID = "1340835581184723420";

type LoginBody = {
  agreed?: boolean;
  phone?: string;
  code?: string;
  password?: string;
  method?: string;
};

type CloudUser = {
  _id?: string;
  name?: string;
  realName?: string;
  phone?: string;
  tenantName?: string;
};

type CloudRole = {
  _id?: string;
  name?: string;
};

function normalizePhone(raw: string): string {
  return raw.replace(/\s+/g, "").trim();
}

function loginMethodValue(method: string | undefined): "1" | "2" {
  if (method === "password" || method === "2") return "2";
  return "1";
}

function displayNameFromUser(user: CloudUser): string {
  const name =
    (typeof user.realName === "string" && user.realName.trim()) ||
    (typeof user.name === "string" && user.name.trim()) ||
    (typeof user.phone === "string" && user.phone.trim()) ||
    "用户";
  return name;
}

function profileFromCloud(user: CloudUser, role: CloudRole): UserProfile {
  const companyName =
    typeof user.tenantName === "string" && user.tenantName.trim()
      ? user.tenantName.trim()
      : undefined;
  return {
    userId: user._id != null ? String(user._id) : "",
    displayName: displayNameFromUser(user),
    roleId: role._id != null ? String(role._id) : "",
    roleName:
      (typeof role.name === "string" && role.name.trim()) || "服务商",
    companyName,
  };
}

function cookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

function setMockSession(res: ReturnType<typeof jsonResponse>) {
  res.cookies.set(SESSION_COOKIE, "mock-ok", cookieOptions());
  res.cookies.set(
    PROFILE_COOKIE,
    serializeProfileCookie({
      userId: mockUser.userId,
      displayName: mockUser.displayName,
      roleId: "mock-role",
      roleName: mockUser.role,
    }),
    cookieOptions()
  );
}

async function phoneLoginCloud(
  phone: string,
  credential: string,
  method: "1" | "2"
): Promise<
  | { ok: true; token: string; profile: UserProfile; company?: string }
  | { ok: false; message?: string }
> {
  const base = cloudReadBaseUrl();
  if (!base) return { ok: false };

  const tenantId =
    process.env.XLINK_CLOUD_TENANT_ID?.trim() || DEFAULT_TENANT_ID;
  const body = new URLSearchParams();
  body.set("method", method);
  body.set("phone", phone);
  body.set("code", credential);
  body.set("tenantId", tenantId);

  const url = new URL("index/phoneLogin.do", `${base}/`);
  let res: Response;
  try {
    res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: body.toString(),
      cache: "no-store",
    });
  } catch {
    return { ok: false };
  }

  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    return { ok: false };
  }

  if (!json || typeof json !== "object") return { ok: false };
  const root = json as Record<string, unknown>;
  const success =
    root.success === true ||
    root.success === "true" ||
    root.success === 1 ||
    root.success === "1";
  if (!success) {
    const msg =
      typeof root.message === "string" ? root.message : undefined;
    return { ok: false, message: msg };
  }

  const data = root.data;
  if (!data || typeof data !== "object") return { ok: false };
  const d = data as Record<string, unknown>;
  const token = typeof d.token === "string" ? d.token.trim() : "";
  if (!token) return { ok: false };

  const user = (d.user ?? {}) as CloudUser;
  const role = (d.currentRole ?? {}) as CloudRole;
  const profile = profileFromCloud(user, role);
  const company =
    typeof user.tenantName === "string" && user.tenantName.trim()
      ? user.tenantName.trim()
      : undefined;

  return { ok: true, token, profile, company };
}

export async function POST(req: NextRequest) {
  let body: LoginBody = {};
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!body.agreed) {
    return jsonResponse({ ok: false, error: "agreement_required" }, { status: 400 });
  }

  const phone = normalizePhone(body.phone ?? "");
  if (!phone) {
    return jsonResponse({ ok: false, error: "phone_required" }, { status: 400 });
  }
  if (phone.toLowerCase() === "error") {
    return jsonResponse({ ok: false, error: "login_failed" }, { status: 401 });
  }

  const method = loginMethodValue(body.method);
  const credential =
    method === "2"
      ? (body.password ?? body.code ?? "").trim()
      : (body.code ?? "").trim();

  if (isCloudReadConfigured()) {
    const cloud = await phoneLoginCloud(phone, credential, method);
    if (cloud.ok) {
      const user = {
        userId: cloud.profile.userId,
        displayName: cloud.profile.displayName,
        role: cloud.profile.roleName,
      };
      const res = jsonResponse({ ok: true, user });
      res.cookies.set(SESSION_COOKIE, cloud.token, cookieOptions());
      res.cookies.set(
        PROFILE_COOKIE,
        serializeProfileCookie(cloud.profile),
        cookieOptions()
      );
      return res;
    }
    if (cloud.message) {
      return jsonResponse(
        { ok: false, error: "login_failed", message: cloud.message },
        { status: 401 }
      );
    }
    return jsonResponse(
      { ok: false, error: "login_failed", message: "无法连接服务，请检查网络或稍后重试" },
      { status: 401 }
    );
  }

  const res = jsonResponse({ ok: true, user: mockUser });
  setMockSession(res);
  return res;
}
