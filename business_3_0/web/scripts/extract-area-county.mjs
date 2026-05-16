#!/usr/bin/env node
/**
 * Extract county_list from code/app/business/resources/js/area.js
 * into business_3_0/web/lib/data/area-county.json
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(__dirname, "..");
const defaultAreaPath = resolve(
  webRoot,
  "../../../xlink/code/app/business/resources/js/area.js"
);
const areaPath = process.argv[2] ? resolve(process.argv[2]) : defaultAreaPath;
const outPath = join(webRoot, "lib/data/area-county.json");

const areaMod = await import(pathToFileURL(areaPath).href);
const county_list = areaMod.default?.county_list ?? areaMod.county_list;
if (!county_list || typeof county_list !== "object") {
  console.error("county_list not found in", areaPath);
  process.exit(1);
}
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(county_list));
console.log(`Wrote ${Object.keys(county_list).length} counties to ${outPath}`);
