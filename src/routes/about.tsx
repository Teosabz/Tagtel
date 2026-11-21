import { createFileRoute, Link } from "@tanstack/react-router";
import { Signal, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SUPPORT_EMAIL, SUPPORT_PHONE, SHOPS } from "@/lib/tagtel-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Tagtel Connect | Tagtel Zimbabwe" },
      {
        name: "description",
        content:
          "Tagtel Connect is the self-service app for Tagtel internet customers in Zimbabwe. Buy data, check balance and get support.",
      },
      { property: "og:title", content: "About Tagtel Connect | Tagtel Zimbabwe" },
      { property: "og:description", content: "The self-service app for Tagtel internet customers." },
    ],
  }),
  component: About,
});

function About() {
  const head = SHOPS[0];
  return (
    <AppShell>
      <div className="bg-brand-gradient px-5 pb-8 pt-6 text-primary-foreground">
        <Link to="/profile" className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm">
          <ArrowLeft className="size-4" /> Back
        </Link>
        <div className="flex size-14 items-center justify-center rounded-2xl bg-accent-gradient">
          <Signal className="size-7" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">Tagtel Connect</h1>
        <p className="mt-1 text-sm opacity-85">Version 1.0.0 · Demo build</p>
      </div>

      <div className="space-y-4 px-4 pt-5">
        <section className="rounded-2xl bg-card p-5 shadow-card">
          <h2 className="text-base font-bold text-foreground">About the app</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tagtel Connect is the self-service app for Tagtel internet customers in Zimbabwe. Check
            your data balance, buy bundles with EcoCash, track your usage, find our shops and report
            faults, all from your phone.
          </p>
        </section>

        <section className="rounded-2xl bg-card p-5 shadow-card">
          <h2 className="text-base font-bold text-foreground">Head office</h2>
          <p className="mt-2 text-sm text-muted-foreground">{head.address}</p>
          <p className="mt-3 text-sm text-foreground">
            <a className="font-semibold text-primary" href={`tel:${SUPPORT_PHONE}`}>
              {SUPPORT_PHONE}
            </a>
          </p>
          <p className="text-sm">
            <a className="font-semibold text-primary" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>
          </p>
        </section>

        <div className="py-6 text-center">
          <p className="text-sm font-semibold text-muted-foreground">Powered by Teo</p>
        </div>
      </div>
    </AppShell>
  );
}