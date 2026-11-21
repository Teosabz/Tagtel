import { BUNDLES, SHOPS, type Bundle } from "./tagtel-data";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Mock API layer. Swap these for real fetch() calls to the Tagtel backend.
export async function getBalance() {
  await delay(600);
  return { data: "12.4GB", used: 19.6, total: 32, expiry: "2026-08-02" };
}

export async function getBundles(): Promise<Bundle[]> {
  await delay(500);
  return BUNDLES;
}

export async function getShops() {
  await delay(300);
  return SHOPS;
}

export async function buyBundle(input: { bundleId: string; ecocashNumber: string }) {
  await delay(2200);
  const bundle = BUNDLES.find((b) => b.id === input.bundleId);
  if (!bundle) throw new Error("Bundle not found");
  return {
    reference: `TGT${Math.floor(100000 + Math.random() * 899999)}`,
    status: "success" as const,
    bundle,
    ecocashNumber: input.ecocashNumber,
  };
}