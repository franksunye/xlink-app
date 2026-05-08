#!/usr/bin/env python3
"""Read-only image upload baseline sampler for XLink business.

The script samples order image URLs from beta/prod APIs, compares original
objects with Qiniu `!convert.jpg` downloads, and estimates client-side
compression impact using macOS `sips`.
"""

from __future__ import annotations

import argparse
import base64
import http.cookiejar
import json
import os
import re
import ssl
import subprocess
import tempfile
import time
import urllib.parse
import urllib.request
from pathlib import Path
from statistics import median
from typing import Any


HOSTS = {
    "beta": "https://xlinkbeta.fsgo365.cn",
    "prod": "https://xlink.fsgo365.cn",
}
DEFAULT_TENANT_ID = "1340835581184723420"
DEFAULT_BETA_PHONE = "18003218877"
DEFAULT_BETA_CODE = "999999"
DEFAULT_ENV_PHONES = {
    "beta": "XLINK_BETA_PHONE",
    "prod": "XLINK_PROD_PHONE",
}
DEFAULT_ENV_CODES = {
    "beta": "XLINK_BETA_PWD",
    "prod": "XLINK_PROD_PWD",
}
IMAGE_RE = re.compile(r"https://pub\.fsgo365\.cn/[^\"'\\,\]\s]+")
IMAGE_SUFFIX_RE = re.compile(r"\.(jpg|jpeg|png|webp|heic|heif|avif)(?:!|$|\?)", re.I)


def make_opener() -> urllib.request.OpenerDirector:
    cookie_jar = http.cookiejar.CookieJar()
    context = ssl._create_unverified_context()
    return urllib.request.build_opener(
        urllib.request.HTTPCookieProcessor(cookie_jar),
        urllib.request.HTTPSHandler(context=context),
    )


def post_json(
    root: str,
    path: str,
    data: dict[str, Any],
    token: str | None = None,
    cookie: str | None = None,
    opener: urllib.request.OpenerDirector | None = None,
) -> tuple[Any, dict[str, str]]:
    url = root.rstrip("/") + "/" + path.lstrip("/")
    body = urllib.parse.urlencode(data).encode("utf-8")
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    if token:
        headers["X-Auth-Token"] = token
    if cookie:
        headers["Cookie"] = cookie
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    active_opener = opener or urllib.request.build_opener()
    with active_opener.open(req, timeout=25) as resp:
        raw = resp.read().decode("utf-8", errors="replace")
        headers_dict = {k.lower(): v for k, v in resp.headers.items()}
    try:
        return json.loads(raw), headers_dict
    except json.JSONDecodeError:
        return raw, headers_dict


def login_phone(root: str, phone: str, code: str, tenant_id: str, opener: urllib.request.OpenerDirector) -> str:
    data, headers = post_json(
        root,
        "index/phoneLogin.do",
        {"phone": phone, "code": code, "method": "1", "tenantId": tenant_id},
        opener=opener,
    )
    token = None
    if isinstance(data, dict):
        token = (data.get("data") or {}).get("token") if isinstance(data.get("data"), dict) else None
    token = token or headers.get("x-auth-token")
    if not token:
        raise RuntimeError(f"Login returned no token: {str(data)[:300]}")
    return token


def login_account(host: str, account: str, password: str, opener: urllib.request.OpenerDirector) -> str:
    url = host.rstrip("/") + "/fsgo/login"
    auth = base64.b64encode(f"{account}:{password}".encode("utf-8")).decode("ascii")
    body = urllib.parse.urlencode({"imageCode": ""}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": f"Basic {auth}",
        },
        method="POST",
    )
    with opener.open(req, timeout=25) as resp:
        raw = resp.read().decode("utf-8", errors="replace")
        headers_dict = {k.lower(): v for k, v in resp.headers.items()}
    token = headers_dict.get("x-auth-token")
    if not token:
        raise RuntimeError(f"Account login returned no token: {raw[:300]}")
    return token


def query_orders(
    root: str,
    token: str,
    rows: int,
    page: int,
    opener: urllib.request.OpenerDirector,
    cookie: str | None = None,
) -> list[dict[str, Any]]:
    data, _ = post_json(
        root, "basic/order/query.do", {"rows": rows, "page": page}, token=token, cookie=cookie, opener=opener
    )
    if not isinstance(data, dict):
        return []
    rows_data = data.get("data")
    return rows_data if isinstance(rows_data, list) else []


def normalize_original_url(url: str) -> str:
    return url.split("!")[0].split("?")[0]


def convert_url(original_url: str) -> str:
    if "!convert.jpg" in original_url:
        return original_url
    return normalize_original_url(original_url) + "!convert.jpg"


def is_image_url(url: str) -> bool:
    return bool(IMAGE_SUFFIX_RE.search(url))


def extract_urls_from_value(value: Any) -> list[str]:
    text = value if isinstance(value, str) else json.dumps(value, ensure_ascii=False)
    return [u.rstrip("。；;，,") for u in IMAGE_RE.findall(text) if is_image_url(u)]


def collect_order_urls(order: dict[str, Any]) -> list[dict[str, str]]:
    found: list[dict[str, str]] = []
    exts = order.get("exts") if isinstance(order.get("exts"), dict) else {}
    for field in ("repairPhotos", "warrantyPhotos"):
        for url in extract_urls_from_value(exts.get(field, "")):
            found.append({"field": field, "url": url})
    for url in extract_urls_from_value(order):
        if not any(item["url"] == url for item in found):
            found.append({"field": "other", "url": url})
    return found


def head_content_length(url: str) -> int | None:
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "xlink-baseline/1.0"})
    context = ssl._create_unverified_context()
    try:
        with urllib.request.urlopen(req, timeout=15, context=context) as resp:
            length = resp.headers.get("Content-Length")
            return int(length) if length else None
    except Exception:
        return None


def download(url: str, dest: Path) -> int:
    req = urllib.request.Request(url, headers={"User-Agent": "xlink-baseline/1.0"})
    context = ssl._create_unverified_context()
    with urllib.request.urlopen(req, timeout=30, context=context) as resp:
        data = resp.read()
    dest.write_bytes(data)
    return len(data)


def sips_dimensions(path: Path) -> tuple[int | None, int | None]:
    try:
        out = subprocess.check_output(
            ["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(path)],
            stderr=subprocess.DEVNULL,
            text=True,
        )
    except Exception:
        return None, None
    width = height = None
    for line in out.splitlines():
        line = line.strip()
        if line.startswith("pixelWidth:"):
            width = int(line.split(":", 1)[1].strip())
        if line.startswith("pixelHeight:"):
            height = int(line.split(":", 1)[1].strip())
    return width, height


def compress_with_sips(src: Path, dest: Path, max_edge: int, quality: int) -> int | None:
    try:
        subprocess.check_call(
            [
                "sips",
                "-Z",
                str(max_edge),
                "-s",
                "format",
                "jpeg",
                "-s",
                "formatOptions",
                str(quality),
                str(src),
                "--out",
                str(dest),
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    except Exception:
        return None
    return dest.stat().st_size if dest.exists() else None


def percentile(values: list[int], pct: float) -> int | None:
    if not values:
        return None
    ordered = sorted(values)
    index = round((len(ordered) - 1) * pct)
    return ordered[index]


def summarize(values: list[int]) -> dict[str, int | float | None]:
    if not values:
        return {"count": 0, "min": None, "p50": None, "p75": None, "p90": None, "p95": None, "max": None, "avg": None}
    return {
        "count": len(values),
        "min": min(values),
        "p50": int(median(values)),
        "p75": percentile(values, 0.75),
        "p90": percentile(values, 0.90),
        "p95": percentile(values, 0.95),
        "max": max(values),
        "avg": round(sum(values) / len(values), 1),
    }


def effective_compressed_bytes(row: dict[str, Any]) -> int | None:
    original = row.get("original_bytes")
    compressed = row.get("compressed_bytes")
    if not original:
      return None
    if not compressed:
      return original
    return min(original, compressed)


def compression_effect(rows: list[dict[str, Any]]) -> dict[str, int | float | None]:
    valid = [r for r in rows if r.get("original_bytes")]
    if not valid:
        return {"count": 0, "smaller_count": 0, "original_total": 0, "effective_total": 0, "saving_pct": None}
    original_total = sum(r["original_bytes"] for r in valid)
    effective_total = sum(effective_compressed_bytes(r) or r["original_bytes"] for r in valid)
    smaller_count = sum(
        1 for r in valid if r.get("compressed_bytes") and r["compressed_bytes"] < r["original_bytes"]
    )
    saving_pct = round((original_total - effective_total) / original_total * 100, 1) if original_total else None
    return {
        "count": len(valid),
        "smaller_count": smaller_count,
        "original_total": original_total,
        "effective_total": effective_total,
        "saving_pct": saving_pct,
    }


def seconds_for_bytes(byte_count: int | None, mbps: float) -> float | None:
    if byte_count is None:
        return None
    return round(byte_count * 8 / (mbps * 1_000_000), 2)


def write_markdown(path: Path, payload: dict[str, Any]) -> None:
    overall = payload["summary"]["overall"]
    fields = payload["summary"]["by_field"]
    lines = [
        "# Image Upload Baseline",
        "",
        f"- env: `{payload['env']}`",
        f"- generated_at: `{payload['generated_at']}`",
        f"- sampled_orders: `{payload['sampled_orders']}`",
        f"- sampled_images: `{len(payload['records'])}`",
        f"- compression_candidate: long edge `{payload['max_edge']}px`, quality `{payload['quality']}`",
        "",
        "## Overall",
        "",
        "| metric | count | p50 | p75 | p90 | p95 | max | avg |",
        "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ]
    for key in ("original_bytes", "download_bytes", "compressed_bytes"):
        row = overall[key]
        lines.append(
            f"| {key} | {row['count']} | {row['p50']} | {row['p75']} | {row['p90']} | {row['p95']} | {row['max']} | {row['avg']} |"
        )
    row = overall["effective_compressed_bytes"]
    lines.append(
        f"| effective_compressed_bytes | {row['count']} | {row['p50']} | {row['p75']} | {row['p90']} | {row['p95']} | {row['max']} | {row['avg']} |"
    )
    effect = payload["summary"]["compression_effect"]
    lines.extend(
        [
            "",
            "## Conditional Compression Effect",
            "",
            f"- smaller_count: `{effect['smaller_count']}` / `{effect['count']}`",
            f"- original_total: `{effect['original_total']}` bytes",
            f"- effective_total: `{effect['effective_total']}` bytes",
            f"- saving_pct: `{effect['saving_pct']}%`",
        ]
    )
    lines.extend(["", "## By Field", ""])
    for field, stats in fields.items():
        lines.extend([f"### {field}", "", "| metric | count | p50 | p90 | max | avg |", "| --- | ---: | ---: | ---: | ---: | ---: |"])
        for key in ("original_bytes", "download_bytes", "compressed_bytes"):
            row = stats[key]
            lines.append(f"| {key} | {row['count']} | {row['p50']} | {row['p90']} | {row['max']} | {row['avg']} |")
        row = stats["effective_compressed_bytes"]
        lines.append(
            f"| effective_compressed_bytes | {row['count']} | {row['p50']} | {row['p90']} | {row['max']} | {row['avg']} |"
        )
        lines.append("")
    p90_original = overall["original_bytes"]["p90"]
    p90_compressed = overall["effective_compressed_bytes"]["p90"]
    lines.extend(["## Upload Time Estimate", ""])
    for mbps in (0.5, 2, 5):
        before = seconds_for_bytes(p90_original, mbps)
        after = seconds_for_bytes(p90_compressed, mbps)
        saved = round(before - after, 2) if before is not None and after is not None else None
        lines.append(f"- P90 at {mbps} Mbps: before `{before}s`, after `{after}s`, saved `{saved}s` per image")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Read-only image baseline sampler")
    parser.add_argument("--env", choices=HOSTS.keys(), default="beta")
    parser.add_argument("--login-mode", choices=("phone", "account"), default="phone")
    parser.add_argument("--tenant-id", default=os.getenv("XLINK_TENANT_ID", DEFAULT_TENANT_ID))
    parser.add_argument("--phone", default=None)
    parser.add_argument("--code", default=None)
    parser.add_argument("--account", default=None)
    parser.add_argument("--password", default=None)
    parser.add_argument("--token", default=os.getenv("XLINK_AUTH_TOKEN"))
    parser.add_argument("--cookie", default=os.getenv("XLINK_COOKIE"))
    parser.add_argument("--rows", type=int, default=20)
    parser.add_argument("--pages", type=int, default=5)
    parser.add_argument("--max-images", type=int, default=80)
    parser.add_argument("--max-edge", type=int, default=1600)
    parser.add_argument("--quality", type=int, default=80)
    parser.add_argument("--out-dir", default="business/tmp/image_upload_baseline")
    args = parser.parse_args()

    host = HOSTS[args.env].rstrip("/")
    root = host + "/fsgo/wm"
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    opener = make_opener()
    if args.token:
        token = args.token
    elif args.login_mode == "phone":
        phone = args.phone or os.getenv(DEFAULT_ENV_PHONES[args.env])
        code = args.code or os.getenv(DEFAULT_ENV_CODES[args.env])
        if args.env == "beta":
            phone = phone or DEFAULT_BETA_PHONE
            code = code or DEFAULT_BETA_CODE
        if not phone or not code:
            env_phone = DEFAULT_ENV_PHONES[args.env]
            env_code = DEFAULT_ENV_CODES[args.env]
            raise SystemExit(
                f"[ERROR] Missing credentials for {args.env}. Pass --phone/--code or set {env_phone}/{env_code}."
            )
        if args.env == "prod" and (phone == DEFAULT_BETA_PHONE and code == DEFAULT_BETA_CODE):
            raise SystemExit("[ERROR] Refusing to use beta default credentials against prod.")
        token = login_phone(root, phone, code, args.tenant_id, opener)
    else:
        account = args.account or os.getenv("XLINK_PROD_ACCOUNT" if args.env == "prod" else "XLINK_BETA_ACCOUNT")
        password = args.password or os.getenv("XLINK_PROD_PASSWORD" if args.env == "prod" else "XLINK_BETA_PASSWORD")
        if not account or not password:
            raise SystemExit("[ERROR] Missing account credentials. Pass --account/--password or set env vars.")
        token = login_account(host, account, password, opener)

    records: list[dict[str, Any]] = []
    seen: set[tuple[str, str]] = set()
    sampled_orders = 0
    with tempfile.TemporaryDirectory() as tmp_dir_raw:
        tmp_dir = Path(tmp_dir_raw)
        for page in range(1, args.pages + 1):
            orders = query_orders(root, token, args.rows, page, opener, cookie=args.cookie)
            if not orders:
                break
            sampled_orders += len(orders)
            for order in orders:
                for item in collect_order_urls(order):
                    original_url = normalize_original_url(item["url"])
                    key = (item["field"], original_url)
                    if key in seen:
                        continue
                    seen.add(key)
                    download_variant = convert_url(original_url)
                    original_path = tmp_dir / f"orig_{len(records)}.img"
                    compressed_path = tmp_dir / f"compressed_{len(records)}.jpg"
                    try:
                        original_bytes = head_content_length(original_url)
                        download_bytes = head_content_length(download_variant)
                        downloaded_bytes = download(original_url, original_path)
                        if original_bytes is None:
                            original_bytes = downloaded_bytes
                        width, height = sips_dimensions(original_path)
                        compressed_bytes = compress_with_sips(original_path, compressed_path, args.max_edge, args.quality)
                    except Exception as exc:
                        records.append(
                            {
                                "field": item["field"],
                                "url": item["url"],
                                "original_url": original_url,
                                "error": str(exc),
                            }
                        )
                        continue
                    records.append(
                        {
                            "field": item["field"],
                            "url": item["url"],
                            "original_url": original_url,
                            "download_url": download_variant,
                            "original_bytes": original_bytes,
                            "download_bytes": download_bytes,
                            "compressed_bytes": compressed_bytes,
                            "width": width,
                            "height": height,
                            "long_edge": max([v for v in (width, height) if v] or [0]),
                        }
                    )
                    if len([r for r in records if not r.get("error")]) >= args.max_images:
                        break
                if len([r for r in records if not r.get("error")]) >= args.max_images:
                    break
            if len([r for r in records if not r.get("error")]) >= args.max_images:
                break

    valid = [r for r in records if not r.get("error")]
    by_field: dict[str, dict[str, Any]] = {}
    for field in sorted({r["field"] for r in valid}):
        rows = [r for r in valid if r["field"] == field]
        by_field[field] = {
            "original_bytes": summarize([r["original_bytes"] for r in rows if r.get("original_bytes")]),
            "download_bytes": summarize([r["download_bytes"] for r in rows if r.get("download_bytes")]),
            "compressed_bytes": summarize([r["compressed_bytes"] for r in rows if r.get("compressed_bytes")]),
            "effective_compressed_bytes": summarize(
                [effective_compressed_bytes(r) for r in rows if effective_compressed_bytes(r)]
            ),
            "compression_effect": compression_effect(rows),
        }
    payload = {
        "env": args.env,
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "sampled_orders": sampled_orders,
        "max_edge": args.max_edge,
        "quality": args.quality,
        "summary": {
            "overall": {
                "original_bytes": summarize([r["original_bytes"] for r in valid if r.get("original_bytes")]),
                "download_bytes": summarize([r["download_bytes"] for r in valid if r.get("download_bytes")]),
                "compressed_bytes": summarize([r["compressed_bytes"] for r in valid if r.get("compressed_bytes")]),
                "effective_compressed_bytes": summarize(
                    [effective_compressed_bytes(r) for r in valid if effective_compressed_bytes(r)]
                ),
                "long_edge": summarize([r["long_edge"] for r in valid if r.get("long_edge")]),
            },
            "by_field": by_field,
            "compression_effect": compression_effect(valid),
        },
        "records": records,
    }
    json_path = out_dir / f"{args.env}_image_upload_baseline.json"
    md_path = out_dir / f"{args.env}_image_upload_baseline.md"
    json_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    write_markdown(md_path, payload)
    print(f"[OK] sampled_images={len(valid)} sampled_orders={sampled_orders}")
    print(f"[OK] wrote {json_path}")
    print(f"[OK] wrote {md_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
