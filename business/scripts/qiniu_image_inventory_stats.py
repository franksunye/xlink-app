#!/usr/bin/env python3
import argparse
import csv
import json
from collections import Counter, defaultdict
from datetime import datetime, timezone, timedelta
from pathlib import Path


CN_TZ = timezone(timedelta(hours=8))


def put_time_to_dt(value):
    raw = int(value)
    if raw > 10**16:
        seconds = raw / 10_000_000
    elif raw > 10**13:
        seconds = raw / 1_000_000
    else:
        seconds = raw
    return datetime.fromtimestamp(seconds, tz=timezone.utc).astimezone(CN_TZ)


def percentile(values, pct):
    if not values:
        return 0
    ordered = sorted(values)
    idx = int((len(ordered) - 1) * pct)
    return ordered[idx]


def bucket_size(size):
    if size >= 5 * 1024 * 1024:
        return ">=5MB"
    if size >= 2 * 1024 * 1024:
        return "2MB-5MB"
    if size >= 1024 * 1024:
        return "1MB-2MB"
    if size >= 500 * 1024:
        return "500KB-1MB"
    if size >= 300 * 1024:
        return "300KB-500KB"
    if size >= 100 * 1024:
        return "100KB-300KB"
    return "<100KB"


def human_bytes(value):
    units = ["B", "KB", "MB", "GB", "TB"]
    size = float(value)
    for unit in units:
        if size < 1024 or unit == units[-1]:
            return f"{size:.1f} {unit}" if unit != "B" else f"{int(size)} B"
        size /= 1024


def load_rows(paths):
    rows = []
    for path in paths:
        with path.open("r", encoding="utf-8", errors="replace", newline="") as f:
            reader = csv.reader(f, delimiter="\t")
            for row in reader:
                if not row or len(row) < 4:
                    continue
                if row[0] == "Key":
                    continue
                key, size, put_time, mime = row[:4]
                if not key or not size or not put_time:
                    continue
                try:
                    size_int = int(size)
                    dt = put_time_to_dt(put_time)
                except ValueError:
                    continue
                rows.append(
                    {
                        "key": key,
                        "size": size_int,
                        "put_time": put_time,
                        "datetime": dt,
                        "mime": mime,
                    }
                )
    return rows


def summarize(rows):
    sizes = [row["size"] for row in rows]
    total = sum(sizes)
    by_year = defaultdict(list)
    by_month = defaultdict(list)
    by_mime = defaultdict(list)
    size_buckets = Counter()

    for row in rows:
        by_year[str(row["datetime"].year)].append(row["size"])
        by_month[row["datetime"].strftime("%Y-%m")].append(row["size"])
        by_mime[row["mime"] or "(empty)"].append(row["size"])
        size_buckets[bucket_size(row["size"])] += 1

    def stats(values):
        return {
            "count": len(values),
            "total_bytes": sum(values),
            "avg_bytes": round(sum(values) / len(values), 1) if values else 0,
            "p50_bytes": percentile(values, 0.50),
            "p75_bytes": percentile(values, 0.75),
            "p90_bytes": percentile(values, 0.90),
            "p95_bytes": percentile(values, 0.95),
            "p99_bytes": percentile(values, 0.99),
            "max_bytes": max(values) if values else 0,
        }

    top = sorted(rows, key=lambda item: item["size"], reverse=True)[:30]
    return {
        "overall": stats(sizes),
        "size_buckets": dict(size_buckets),
        "by_year": {key: stats(values) for key, values in sorted(by_year.items())},
        "by_month": {key: stats(values) for key, values in sorted(by_month.items())},
        "by_mime": {key: stats(values) for key, values in sorted(by_mime.items())},
        "top_largest": [
            {
                "key": row["key"],
                "size": row["size"],
                "size_human": human_bytes(row["size"]),
                "datetime": row["datetime"].isoformat(),
                "mime": row["mime"],
            }
            for row in top
        ],
        "total_bytes": total,
        "total_human": human_bytes(total),
    }


def write_markdown(summary, out_path):
    overall = summary["overall"]
    lines = [
        "# Qiniu fs-go 图片对象大小统计",
        "",
        "范围：2024-01-01 到 2025-12-31 上传的图片对象。",
        "",
        "## 总览",
        "",
        "| 指标 | 值 |",
        "| --- | ---: |",
        f"| 图片对象数 | {overall['count']:,} |",
        f"| 总体积 | {summary['total_human']} |",
        f"| 平均 | {human_bytes(overall['avg_bytes'])} |",
        f"| P50 | {human_bytes(overall['p50_bytes'])} |",
        f"| P75 | {human_bytes(overall['p75_bytes'])} |",
        f"| P90 | {human_bytes(overall['p90_bytes'])} |",
        f"| P95 | {human_bytes(overall['p95_bytes'])} |",
        f"| P99 | {human_bytes(overall['p99_bytes'])} |",
        f"| 最大 | {human_bytes(overall['max_bytes'])} |",
        "",
        "## 体积分布",
        "",
        "| 区间 | 数量 | 占比 |",
        "| --- | ---: | ---: |",
    ]
    total_count = overall["count"] or 1
    order = ["<100KB", "100KB-300KB", "300KB-500KB", "500KB-1MB", "1MB-2MB", "2MB-5MB", ">=5MB"]
    for key in order:
        count = summary["size_buckets"].get(key, 0)
        lines.append(f"| {key} | {count:,} | {count / total_count:.1%} |")

    lines += ["", "## 按年份", "", "| 年份 | 数量 | P50 | P90 | P95 | 最大 |", "| --- | ---: | ---: | ---: | ---: | ---: |"]
    for year, data in summary["by_year"].items():
        lines.append(
            f"| {year} | {data['count']:,} | {human_bytes(data['p50_bytes'])} | "
            f"{human_bytes(data['p90_bytes'])} | {human_bytes(data['p95_bytes'])} | {human_bytes(data['max_bytes'])} |"
        )

    lines += ["", "## 最大对象 Top 30", "", "| Key | 大小 | 时间 | MIME |", "| --- | ---: | --- | --- |"]
    for row in summary["top_largest"]:
        lines.append(f"| `{row['key']}` | {row['size_human']} | {row['datetime']} | {row['mime']} |")

    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("inputs", nargs="+", type=Path)
    parser.add_argument("--out-json", type=Path, required=True)
    parser.add_argument("--out-md", type=Path, required=True)
    args = parser.parse_args()

    rows = load_rows(args.inputs)
    summary = summarize(rows)
    args.out_json.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    write_markdown(summary, args.out_md)


if __name__ == "__main__":
    main()
