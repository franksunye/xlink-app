"use client";

import { startTransition, useEffect, useState } from "react";
import { readHomeVariant, subscribeHomeVariant, type HomeVariant } from "@/lib/home-variant";

/**
 * 与小程序一致读 `localStorage`；首帧 `task` 与 SSR 一致，挂载后再同步真实值。
 */
export function useHomeVariant(): HomeVariant {
  const [v, setV] = useState<HomeVariant>("task");
  useEffect(() => {
    startTransition(() => {
      setV(readHomeVariant());
    });
    return subscribeHomeVariant(() => {
      startTransition(() => {
        setV(readHomeVariant());
      });
    });
  }, []);
  return v;
}
