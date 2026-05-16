import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidSessionToken } from "./auth.ts";
import {
  buildCloudCookieHeaderFromSession,
  parseProfileCookie,
  resolveJSessionIdFromSources,
  serializeProfileCookie,
} from "./cloud-session.ts";

describe("isValidSessionToken", () => {
  it("accepts mock-ok", () => {
    assert.equal(isValidSessionToken("mock-ok"), true);
  });

  it("accepts JSESSIONID-shaped tokens", () => {
    assert.equal(isValidSessionToken("A1B2C3D4E5F6G7H8JSESSION"), true);
  });

  it("rejects empty", () => {
    assert.equal(isValidSessionToken(""), false);
    assert.equal(isValidSessionToken(undefined), false);
  });
});

describe("resolveJSessionIdFromSources", () => {
  it("prefers login cookie over header and env", () => {
    assert.equal(
      resolveJSessionIdFromSources({
        sessionCookie: "cookie-session-id-abcdefghij",
        headerJSessionId: "header-session",
        envJSessionId: "env-session",
      }),
      "cookie-session-id-abcdefghij"
    );
  });

  it("skips mock-ok cookie and uses header", () => {
    assert.equal(
      resolveJSessionIdFromSources({
        sessionCookie: "mock-ok",
        headerJSessionId: "header-session",
        envJSessionId: "env-session",
      }),
      "header-session"
    );
  });

  it("falls back to env when cookie and header absent", () => {
    assert.equal(
      resolveJSessionIdFromSources({
        envJSessionId: "env-session-abcdefghij",
      }),
      "env-session-abcdefghij"
    );
  });
});

describe("profile cookie", () => {
  it("round-trips profile JSON", () => {
    const profile = {
      userId: "u1",
      displayName: "张工",
      roleId: "r1",
      roleName: "服务商",
    };
    const parsed = parseProfileCookie(serializeProfileCookie(profile));
    assert.deepEqual(parsed, profile);
  });
});

describe("buildCloudCookieHeaderFromSession", () => {
  it("injects JSESSIONID into cookie header", () => {
    const c = buildCloudCookieHeaderFromSession("abc123sessionidxyz", "foo=bar");
    assert.match(c ?? "", /JSESSIONID=abc123sessionidxyz/);
    assert.match(c ?? "", /foo=bar/);
  });
});
