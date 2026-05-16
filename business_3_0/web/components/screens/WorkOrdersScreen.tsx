"use client";

import { Suspense } from "react";
import { WorkOrdersInner } from "@/app/(app)/work-orders/WorkOrdersInner";

export default function WorkOrdersScreen() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-3 px-3.5 pt-4">
          <div className="h-10 w-40 rounded bg-[var(--xlink-panel-soft)]" />
          <div className="h-24 rounded-lg bg-[var(--xlink-panel-soft)]" />
        </div>
      }
    >
      <WorkOrdersInner />
    </Suspense>
  );
}
