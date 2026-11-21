import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Plus, Wifi, Clock, Headphones } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getBalance } from "@/lib/api";
import { USAGE_THIS_MONTH } from "@/lib/tagtel-data";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | Tagtel Connect" },
      {
        name: "description",
        content: "See your Tagtel data balance, expiry date and monthly usage, then buy data or top up.",
      },
      { property: "og:title", content: "Dashboard | Tagtel Connect" },
      { property: "og:description", content: "Check your Tagtel data balance and monthly usage." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  ),
});

function expiryText(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return `Expires in ${days} days, ${hours} hours`;
}

function Dashboard() {
  const phone = useAppStore((s) => s.phone);
  const txns = useAppStore((s) => s.transactions);
  const { data, isLoading } = useQuery({ queryKey: ["balance"], queryFn: getBalance });

  const remaining = data ? data.total - data.used : 0;
  const pct = data ? (remaining / data.total) * 100 : 0;

  return (
    <AppShell>
      <div className="bg-brand-gradient px-5 pb-16 pt-7 text-primary-foreground">
        <p className="text-sm opacity-80">Welcome back</p>
        <p className="text-lg font-semibold">{phone ?? ""}</p>
      </div>

      <div className="-mt-12 space-y-5 px-4">
        <section className="animate-rise-in rounded-2xl bg-card p-5 shadow-card">
          {isLoading || !data ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-40" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-4 w-48" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Wifi className="size-4 text-primary" /> Data Balance
              </div>
              <p className="mt-1 text-4xl font-bold tracking-tight text-foreground">{data.data}</p>
              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-accent-gradient transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="size-4" /> {expiryText(data.expiry)}
              </p>
            </>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button asChild variant="brand" size="tap">
              <Link to="/buy">
                <Plus /> Buy Data
              </Link>
            </Button>
            <Button asChild variant="outlineBrand" size="tap">
              <Link to="/buy" search={{ topup: true }}>
                <ArrowUpRight /> Top Up
              </Link>
            </Button>
          </div>
        </section>

        <section className="rounded-2xl bg-card p-5 shadow-card">
          <div className="flex items-baseline justify-between">
            <h2 className="text-base font-bold text-foreground">Usage this month</h2>
            <span className="text-sm font-semibold text-primary">
              {USAGE_THIS_MONTH.reduce((a, b) => a + b.gb, 0).toFixed(1)}GB
            </span>
          </div>
          <div className="mt-5 flex h-40 items-end gap-3">
            {USAGE_THIS_MONTH.map((d, i) => {
              const max = Math.max(...USAGE_THIS_MONTH.map((u) => u.gb));
              const last = i === USAGE_THIS_MONTH.length - 1;
              return (
                <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">{d.gb}</span>
                  <div
                    className={
                      last
                        ? "w-full rounded-lg bg-accent-gradient transition-all duration-700"
                        : "w-full rounded-lg bg-primary transition-all duration-700"
                    }
                    style={{ height: `${(d.gb / max) * 100}px` }}
                  />
                  <span className="text-xs text-muted-foreground">{d.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Recent activity</h2>
            <Link to="/profile" className="text-sm font-semibold text-primary">
              See all
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-border">
            {txns.slice(0, 3).map((t) => (
              <li key={t.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.bundle}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(t.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">${t.amount.toFixed(2)}</p>
                  <p
                    className={
                      t.status === "Success"
                        ? "text-xs font-medium text-success"
                        : "text-xs font-medium text-destructive"
                    }
                  >
                    {t.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <Link
          to="/support"
          className="flex min-h-16 items-center gap-3 rounded-2xl bg-secondary px-5 text-sm font-semibold text-primary"
        >
          <Headphones className="size-5" /> Need help? Talk to Tagtel support
        </Link>
      </div>
    </AppShell>
  );
}