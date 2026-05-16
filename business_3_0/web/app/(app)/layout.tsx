import { AppTabBar } from "@/components/AppTabBar";
import { AppTabShell } from "@/components/AppTabShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col bg-[var(--xlink-page)] pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
      <main className="flex-1">
        <AppTabShell>{children}</AppTabShell>
      </main>
      <AppTabBar />
    </div>
  );
}
