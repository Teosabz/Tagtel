import { createFileRoute } from "@tanstack/react-router";
import { Phone, Navigation, MapPin, Clock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { SHOPS } from "@/lib/tagtel-data";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shops")({
  head: () => ({
    meta: [
      { title: "Find a Tagtel Shop | Tagtel Connect" },
      {
        name: "description",
        content:
          "Locate Tagtel shops in Harare, Bulawayo and Mutare. Get opening hours, call the branch or get directions.",
      },
      { property: "og:title", content: "Find a Tagtel Shop | Tagtel Connect" },
      { property: "og:description", content: "Tagtel shop locations, hours and directions in Zimbabwe." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <Shops />
    </RequireAuth>
  ),
});

function Shops() {
  const [activeId, setActiveId] = useState(SHOPS[0].id);
  const active = SHOPS.find((s) => s.id === activeId)!;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${active.lng - 0.012}%2C${active.lat - 0.008}%2C${active.lng + 0.012}%2C${active.lat + 0.008}&layer=mapnik&marker=${active.lat}%2C${active.lng}`;

  return (
    <AppShell title="Find Us" subtitle="Tagtel shops near you">
      <div className="h-64 w-full overflow-hidden border-b border-border bg-secondary">
        <iframe
          key={active.id}
          title={`Map showing ${active.name}`}
          src={mapSrc}
          className="size-full"
          loading="lazy"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        {SHOPS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            className={cn(
              "min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold",
              s.id === activeId
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground",
            )}
          >
            {s.name.replace("Tagtel ", "")}
          </button>
        ))}
      </div>

      <div className="space-y-4 px-4">
        <article className="animate-rise-in rounded-2xl bg-card p-5 shadow-card">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-5 shrink-0 text-accent" />
            <div>
              <h2 className="text-lg font-bold text-foreground">{active.name}</h2>
              {active.headOffice ? (
                <span className="mt-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                  Head Office
                </span>
              ) : null}
              <p className="mt-2 text-sm text-muted-foreground">{active.address}</p>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-2 text-sm text-foreground">
            <Clock className="size-4 text-primary" /> {active.hours}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button asChild variant="outlineBrand" size="tap">
              <a href={`tel:${active.phone}`}>
                <Phone /> Call
              </a>
            </Button>
            <Button asChild variant="brand" size="tap">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${active.lat},${active.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                <Navigation /> Directions
              </a>
            </Button>
          </div>
        </article>

        <div className="space-y-3">
          <h3 className="px-1 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            All shops
          </h3>
          {SHOPS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className="flex w-full items-start gap-3 rounded-2xl bg-card p-4 text-left shadow-card"
            >
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-semibold text-foreground">{s.name}</p>
                <p className="text-sm text-muted-foreground">{s.address}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}