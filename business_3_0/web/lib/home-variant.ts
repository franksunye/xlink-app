/** 与小程序概念版 `uni.setStorageSync('business_3_home_variant')` 键名一致。 */

export const HOME_VARIANT_STORAGE_KEY = "business_3_home_variant";

export const HOME_VARIANT_EVENT = "xlink-home-variant-change";

export type HomeVariant = "task" | "metrics";

export function readHomeVariant(): HomeVariant {
  if (typeof window === "undefined") return "task";
  const raw = window.localStorage.getItem(HOME_VARIANT_STORAGE_KEY);
  return raw === "metrics" ? "metrics" : "task";
}

export function writeHomeVariant(v: HomeVariant) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HOME_VARIANT_STORAGE_KEY, v);
  window.dispatchEvent(new CustomEvent(HOME_VARIANT_EVENT));
}

export function subscribeHomeVariant(onStore: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStore();
  window.addEventListener(HOME_VARIANT_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(HOME_VARIANT_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
