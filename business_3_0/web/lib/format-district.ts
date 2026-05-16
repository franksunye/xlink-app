import countyList from "@/lib/data/area-county.json";

const COUNTY_BY_CODE: Record<string, string> = countyList as Record<string, string>;

/** 行政区划县级码 → 名称（如 110105 → 朝阳区） */
export function formatDistrict(code: string | number | null | undefined): string {
  if (code == null || code === "") return "";
  const key = String(code).trim();
  return COUNTY_BY_CODE[key] ?? "";
}

/** 列表/详情展示用地址：区县名 + 详细地址 */
export function formatServiceAddress(
  district: string | number | null | undefined,
  address: string | null | undefined
): string {
  const districtName = formatDistrict(district);
  const detail = typeof address === "string" ? address.trim() : "";
  if (districtName && detail) return `${districtName} ${detail}`;
  if (districtName) return districtName;
  if (detail) return detail;
  return "—";
}
