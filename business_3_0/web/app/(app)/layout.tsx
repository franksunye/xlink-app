import { AppTabBar } from "@/components/AppTabBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col pb-20">
      <main className="flex-1 px-4 pt-3">{children}</main>
      <AppTabBar />
    </div>
  );
}
