import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Receipt, LogOut, Info, ChevronRight, User } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Transactions | Tagtel Connect" },
      {
        name: "description",
        content: "View your Tagtel account details and every data bundle purchase with status and amount.",
      },
      { property: "og:title", content: "Profile & Transactions | Tagtel Connect" },
      { property: "og:description", content: "Your Tagtel account and purchase history." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <Profile />
    </RequireAuth>
  ),
});

function Profile() {
  const navigate = useNavigate();
  const phone = useAppStore((s) => s.phone);
  const txns = useAppStore((s) => s.transactions);
  const logout = useAppStore((s) => s.logout);

  return (
    <AppShell title="Profile" subtitle="Account and transactions">
      <div className="space-y-5 px-4 pt-4">
        <section className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card">
          <div className="flex size-14 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground">
            <User className="size-6" />
          </div>
          <div>
            <p className="text-base font-bold text-foreground">Tagtel customer</p>
            <p className="text-sm text-muted-foreground">{phone}</p>
          </div>
        </section>

        <section className="rounded-2xl bg-card p-5 shadow-card">
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
            <Receipt className="size-4 text-primary" /> Transaction history
          </h2>
          {txns.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-semibold text-foreground">No transactions yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your data purchases will show up here.
              </p>
              <Button asChild variant="brand" size="tapSm" className="mt-4">
                <Link to="/buy">Buy data</Link>
              </Button>
            </div>
          ) : (
            <ul className="mt-2 divide-y divide-border">
              {txns.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 py-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t.bundle} · {t.data}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(t.date).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">Ref {t.reference}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">${t.amount.toFixed(2)}</p>
                    <span
                      className={
                        t.status === "Success"
                          ? "rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success"
                          : "rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive"
                      }
                    >
                      {t.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Link
          to="/about"
          className="flex min-h-16 items-center justify-between rounded-2xl bg-card px-5 text-sm font-semibold text-foreground shadow-card"
        >
          <span className="flex items-center gap-3">
            <Info className="size-5 text-primary" /> About Tagtel Connect
          </span>
          <ChevronRight className="size-5 text-muted-foreground" />
        </Link>

        <Button
          variant="outline"
          size="tap"
          className="w-full text-destructive"
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
        >
          <LogOut /> Log out
        </Button>
      </div>
    </AppShell>
  );
}