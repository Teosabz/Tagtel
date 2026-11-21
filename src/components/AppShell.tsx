import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ShoppingBag, MapPin, LifeBuoy, User, Signal } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/buy", label: "Buy Data", icon: ShoppingBag },
  { to: "/shops", label: "Find Us", icon: MapPin },
  { to: "/support", label: "Support", icon: LifeBuoy },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background md:flex">
      <aside className="hidden w-64 shrink-0 flex-col bg-[var(--sidebar)] px-5 py-7 text-[var(--sidebar-foreground)] md:sticky md:top-0 md:flex md:h-screen">
        <Link to="/dashboard" className="flex items-center gap-3 px-2">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] shadow-float">
            <Signal className="size-6" />
          </span>
          <span>
            <span className="block text-base font-bold tracking-tight">Tagtel</span>
            <span className="block text-xs text-white/60">Connect</span>
          </span>
        </Link>

        <p className="mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
          Your account
        </p>
        <nav className="space-y-1.5">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/12 text-white shadow-sm"
                    : "text-white/65 hover:bg-white/8 hover:text-white",
                )}
              >
                <Icon className="size-5" />
                {item.label}
                {active ? <span className="ml-auto size-1.5 rounded-full bg-[var(--sidebar-primary)]" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-semibold">Stay connected</p>
          <p className="mt-1 text-xs leading-relaxed text-white/60">
            Your bundles, balance and support are always close by.
          </p>
        </div>
      </aside>

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col md:mx-0 md:min-w-0 md:flex-1">
        {title ? (
          <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 px-5 pb-4 pt-5 backdrop-blur-xl md:px-8 md:pb-5 md:pt-8">
            <div className="mx-auto max-w-5xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary md:hidden">
                Tagtel Connect
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:mt-0 md:text-3xl">
                {title}
              </h1>
              {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
          </header>
        ) : null}
        <main className="flex-1 pb-28 md:pb-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-30 mx-auto flex w-[calc(100%-1.5rem)] max-w-md items-stretch rounded-2xl border border-border/80 bg-card/95 p-1.5 shadow-card backdrop-blur-xl md:hidden">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition-colors",
                active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary",
              )}
            >
              <Icon className="size-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}