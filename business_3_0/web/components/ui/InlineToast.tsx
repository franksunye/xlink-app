"use client";

import { useEffect } from "react";

type Props = {
  message: string | null;
  onClear: () => void;
  durationMs?: number;
};

/** 轻量底部提示，替代 window.alert */
export function InlineToast({ message, onClear, durationMs = 2800 }: Props) {
  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(onClear, durationMs);
    return () => window.clearTimeout(t);
  }, [message, durationMs, onClear]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-1/2 z-[100] max-w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-[#d8e4f4] bg-[#101827]/92 px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_12px_40px_rgba(15,23,42,0.35)] backdrop-blur-sm"
    >
      {message}
    </div>
  );
}
