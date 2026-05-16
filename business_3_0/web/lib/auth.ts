/** Mock or cloud session cookie (httpOnly). Cloud: JSESSIONID from phoneLogin `data.token`. */
export const SESSION_COOKIE = "xlink_b3_sess";
/** Logged-in user summary for UI (httpOnly JSON). */
export const PROFILE_COOKIE = "xlink_b3_profile";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const MOCK_TOKEN = "mock-ok";

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token?.trim()) return false;
  const t = token.trim();
  if (t === MOCK_TOKEN) return true;
  return t.length >= 16 && t.length <= 128 && /^[\w.-]+$/.test(t);
}

export function isMockSessionToken(token: string | undefined): boolean {
  return token?.trim() === MOCK_TOKEN;
}
