/** Mock session cookie (httpOnly). Value is opaque token for v0.1 only. */
export const SESSION_COOKIE = "xlink_b3_sess";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function isValidSessionToken(token: string | undefined): boolean {
  return token === "mock-ok";
}
