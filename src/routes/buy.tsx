import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { Check, Loader2, Smartphone, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { getBundles, buyBundle } from "@/lib/api";
import type { Bundle } from "@/lib/tagtel-data";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS = ["daily", "weekly", "monthly", "unlimited"] as const;

export const Route = createFileRoute("/buy")({
  validateSearch: z.object({ topup: z.boolean().optional() }),
  head: () => ({
    meta: [
      { title: "Buy Data Bundles | Tagtel Connect" },
      {
        name: "description",
        content:
          "Browse Tagtel daily, weekly, monthly and unlimited data bundles and pay instantly with EcoCash.",
      },
      { property: "og:title", content: "Buy Data Bundles | Tagtel Connect" },
      { property: "og:description", content: "Tagtel data bundles from $0.50, paid with EcoCash." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <BuyData />
    </RequireAuth>
  ),
});

type Stage = "summary" | "number" | "ussd" | "success";

function BuyData() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("monthly");
  const [selected, setSelected] = useState<Bundle | null>(null);
  const [stage, setStage] = useState<Stage>("summary");
  const [ecocash, setEcocash] = useState("");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const addTransaction = useAppStore((s) => s.addTransaction);
  const phone = useAppStore((s) => s.phone);

  const { data: bundles, isLoading } = useQuery({ queryKey: ["bundles"], queryFn: getBundles });
  const list = (bundles ?? []).filter((b) => b.category === tab);

  function open(b: Bundle) {
    setSelected(b);
    setStage("summary");
    setEcocash(phone?.replace("+263", "0") ?? "");
    setError("");
  }

  async function pay() {
    if (!selected) return;
    if (ecocash.replace(/\D/g, "").length < 9) {
      setError("Enter a valid EcoCash number");
      return;
    }
    setError("");
    setStage("ussd");
    const res = await buyBundle({ bundleId: selected.id, ecocashNumber: ecocash });
    setReference(res.reference);
    addTransaction({
      id: res.reference,
      date: new Date().toISOString(),
      bundle: selected.name,
      data: selected.data,
      amount: selected.price,
      status: "Success",
      reference: res.reference,
    });
    setStage("success");
  }

  return (
    <AppShell title="Buy Data" subtitle="Pick a bundle and pay with EcoCash">
      <div className="sticky top-[92px] z-10 flex gap-2 overflow-x-auto bg-background px-4 py-3 md:top-28 md:px-8">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "min-h-11 shrink-0 rounded-full px-5 text-sm font-semibold capitalize transition-colors",
              tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-4 pt-1">
        {isLoading
          ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
          : list.map((b) => (
              <button
                key={b.id}
                onClick={() => open(b)}
                className="flex w-full items-center justify-between gap-3 rounded-2xl bg-card p-4 text-left shadow-card active:scale-[0.99]"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-foreground">{b.name}</p>
                    {b.promo ? (
                      <span className="rounded-full bg-accent-gradient px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">
                        Promo
                      </span>
                    ) : b.tag ? (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                        {b.tag}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {b.data} · {b.validity}
                  </p>
                </div>
                <span className="shrink-0 text-xl font-bold text-primary">${b.price.toFixed(2)}</span>
              </button>
            ))}
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl border-0 px-5 pb-8 pt-6">
          <SheetTitle className="sr-only">Bundle purchase</SheetTitle>
          {selected && stage === "summary" ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground">Order summary</h2>
                <p className="mt-1 text-sm text-muted-foreground">Confirm before you pay</p>
              </div>
              <div className="space-y-2 rounded-2xl bg-secondary p-4 text-sm">
                <Row label="Bundle" value={selected.name} />
                <Row label="Data" value={selected.data} />
                <Row label="Validity" value={selected.validity} />
                <div className="mt-2 flex justify-between border-t border-border pt-3 text-base font-bold text-foreground">
                  <span>Total</span>
                  <span>${selected.price.toFixed(2)}</span>
                </div>
              </div>
              <Button variant="brand" size="tap" className="w-full" onClick={() => setStage("number")}>
                <Smartphone /> Pay with EcoCash
              </Button>
            </div>
          ) : null}

          {selected && stage === "number" ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground">EcoCash number</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  You will get a prompt on your phone to enter your PIN.
                </p>
              </div>
              <Input
                inputMode="tel"
                value={ecocash}
                onChange={(e) => setEcocash(e.target.value)}
                placeholder="077 123 4567"
                className="h-14 rounded-xl text-base"
              />
              {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
              <Button variant="accent" size="tap" className="w-full" onClick={pay}>
                <Zap /> Simulate Payment (${selected.price.toFixed(2)})
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Demo mode — EcoCash Merchant API is mocked.
              </p>
            </div>
          ) : null}

          {stage === "ussd" ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <Loader2 className="size-10 animate-spin text-primary" />
              <p className="text-base font-semibold text-foreground">USSD push sent</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Check your phone and enter your EcoCash PIN to approve the payment.
              </p>
            </div>
          ) : null}

          {selected && stage === "success" ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="animate-pop-in flex size-20 items-center justify-center rounded-full bg-success">
                <Check className="size-10 text-success-foreground" strokeWidth={3} />
              </div>
              <h2 className="text-xl font-bold text-foreground">Payment successful</h2>
              <p className="text-sm text-muted-foreground">
                {selected.data} loaded. Reference {reference}
              </p>
              <Button
                variant="brand"
                size="tap"
                className="mt-3 w-full"
                onClick={() => setSelected(null)}
              >
                Done
              </Button>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}