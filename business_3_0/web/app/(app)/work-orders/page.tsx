"use client";

import { Suspense } from "react";
import { WorkOrdersInner } from "./WorkOrdersInner";

export default function WorkOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-3">
          <div className="h-10 w-40 rounded bg-[var(--xlink-panel-soft)]" />
          <div className="h-24 rounded-lg bg-[var(--xlink-panel-soft)]" />
        </div>
      }
    >
      <WorkOrdersInner />
    </Suspense>
  );
}
