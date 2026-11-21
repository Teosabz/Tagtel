import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useAppStore } from "@/lib/store";

export function RequireAuth({ children }: { children: ReactNode }) {
  const phone = useAppStore((s) => s.phone);
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && !phone) navigate({ to: "/" });
  }, [ready, phone, navigate]);

  if (!ready || !phone) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-4 border-secondary border-t-primary" />
      </div>
    );
  }
  return <>{children}</>;
}