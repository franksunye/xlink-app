import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "修链 · 服务商",
    short_name: "修链",
    description: "XLink Business 3.0 服务商工作台（演示）",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f6fb",
    theme_color: "#2563eb",
    lang: "zh-CN",
    icons: [
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
