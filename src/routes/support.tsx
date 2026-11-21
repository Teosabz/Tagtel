import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Phone, Loader2, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS, SUPPORT_PHONE, SUPPORT_WHATSAPP, SUPPORT_EMAIL } from "@/lib/tagtel-data";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support & Faults | Tagtel Connect" },
      {
        name: "description",
        content:
          "Chat with Tagtel on WhatsApp, call the help desk, read FAQs about slow speed and renewals, or report a fault.",
      },
      { property: "og:title", content: "Support & Faults | Tagtel Connect" },
      { property: "og:description", content: "Tagtel help desk, FAQs and fault reporting." },
    ],
  }),
  component: () => (
    <RequireAuth>
      <Support />
    </RequireAuth>
  ),
});

function Support() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [area, setArea] = useState("");
  const [details, setDetails] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSending(false);
    setSent(true);
    setArea("");
    setDetails("");
  }

  return (
    <AppShell title="Support" subtitle="We are here to help">
      <div className="space-y-5 px-4 pt-4">
        <div className="grid grid-cols-2 gap-3">
          <Button asChild variant="brand" size="tap">
            <a
              href={`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent("Hi Tagtel, I need help with my connection.")}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle /> WhatsApp
            </a>
          </Button>
          <Button asChild variant="outlineBrand" size="tap">
            <a href={`tel:${SUPPORT_PHONE}`}>
              <Phone /> Call us
            </a>
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Or email{" "}
          <a className="font-semibold text-primary" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
        </p>

        <section className="rounded-2xl bg-card p-5 shadow-card">
          <h2 className="text-base font-bold text-foreground">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-2">
            {FAQS.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="py-4 text-left text-sm font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="rounded-2xl bg-card p-5 shadow-card">
          <h2 className="text-base font-bold text-foreground">Report a fault</h2>
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="animate-pop-in flex size-16 items-center justify-center rounded-full bg-success">
                <Check className="size-8 text-success-foreground" strokeWidth={3} />
              </div>
              <p className="font-semibold text-foreground">Fault reported</p>
              <p className="text-sm text-muted-foreground">
                Our team will call you within 24 hours.
              </p>
              <Button variant="soft" size="tapSm" onClick={() => setSent(false)}>
                Report another
              </Button>
            </div>
          ) : (
            <form className="mt-4 space-y-4" onSubmit={submit}>
              <div className="space-y-2">
                <Label htmlFor="area">Your area</Label>
                <Input
                  id="area"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Msasa, Harare"
                  className="h-14 rounded-xl text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="details">What is the problem?</Label>
                <Textarea
                  id="details"
                  required
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="No internet since this morning..."
                  className="rounded-xl text-base"
                />
              </div>
              <Button type="submit" variant="accent" size="tap" className="w-full" disabled={sending}>
                {sending ? <Loader2 className="animate-spin" /> : null}
                {sending ? "Sending..." : "Submit report"}
              </Button>
            </form>
          )}
        </section>
      </div>
    </AppShell>
  );
}