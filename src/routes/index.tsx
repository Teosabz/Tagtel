import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Signal, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tagtel Connect | Buy Data & Manage Your Tagtel Line" },
      {
        name: "description",
        content:
          "Log in with your Tagtel number to buy data bundles with EcoCash, check your balance and find Tagtel shops in Zimbabwe.",
      },
      { property: "og:title", content: "Tagtel Connect | Buy Data & Manage Your Tagtel Line" },
      {
        property: "og:description",
        content: "Buy data with EcoCash, check your balance and find Tagtel shops across Zimbabwe.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const login = useAppStore((s) => s.login);
  const phoneStored = useAppStore((s) => s.phone);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (phoneStored) navigate({ to: "/dashboard" });
  }, [phoneStored, navigate]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const digits = phone.replace(/\D/g, "");

  async function sendOtp() {
    setError("");
    if (digits.length < 9) {
      setError("Enter a valid Tagtel number, e.g. 077 123 4567");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStep("otp");
    setSeconds(30);
  }

  async function verify() {
    setError("");
    if (otp.replace(/\D/g, "").length !== 5) {
      setError("Enter the 5-digit code we sent you");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    login(`+263${digits.replace(/^0/, "")}`, remember);
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-brand-gradient">
      <div className="flex flex-1 flex-col justify-center px-6 py-10 text-primary-foreground">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-accent-gradient shadow-float">
          <Signal className="size-7" />
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight">Tagtel Connect</h1>
        <p className="mt-2 text-sm opacity-85">
          Buy data, check your balance and get help. All in one place.
        </p>
      </div>

      <div className="animate-rise-in rounded-t-3xl bg-card px-6 pb-10 pt-7">
        {step === "phone" ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-foreground">Sign in</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We will send you a one-time code by SMS. No password needed.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm">
                Tagtel phone number
              </Label>
              <div className="flex items-center gap-2">
                <span className="flex h-14 items-center rounded-xl bg-secondary px-4 text-base font-semibold text-secondary-foreground">
                  +263
                </span>
                <Input
                  id="phone"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="77 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-14 flex-1 rounded-xl text-base"
                />
              </div>
            </div>
            <label className="flex items-center gap-3 text-sm text-foreground">
              <Checkbox
                checked={remember}
                onCheckedChange={(v) => setRemember(Boolean(v))}
                className="size-5"
              />
              Remember me on this phone
            </label>
            {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
            <Button variant="brand" size="tap" className="w-full" onClick={sendOtp} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : null}
              {loading ? "Sending code..." : "Send code"}
            </Button>
            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4" /> Secured by Tagtel Zimbabwe
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-foreground">Enter your code</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Sent to +263 {digits.replace(/^0/, "")}
              </p>
            </div>
            <Input
              inputMode="numeric"
              maxLength={5}
              placeholder="- - - - -"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="h-16 rounded-xl text-center text-2xl font-bold tracking-[0.5em]"
            />
            {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
            <Button variant="brand" size="tap" className="w-full" onClick={verify} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : null}
              {loading ? "Verifying..." : "Verify & continue"}
            </Button>
            <div className="flex items-center justify-between text-sm">
              <button
                className="min-h-11 text-muted-foreground"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                }}
              >
                Change number
              </button>
              <button
                className="min-h-11 font-semibold text-primary disabled:opacity-50"
                disabled={seconds > 0}
                onClick={() => setSeconds(30)}
              >
                {seconds > 0 ? `Resend in ${seconds}s` : "Resend code"}
              </button>
            </div>
            <p className="rounded-xl bg-secondary p-3 text-center text-xs text-muted-foreground">
              Demo mode: any 5-digit code works.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
