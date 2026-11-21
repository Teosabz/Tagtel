import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Txn = {
  id: string;
  date: string;
  bundle: string;
  data: string;
  amount: number;
  status: "Success" | "Failed";
  reference: string;
};

const SEED_TXNS: Txn[] = [
  { id: "t1", date: "2026-07-24T09:12:00Z", bundle: "Monthly 20GB", data: "20GB", amount: 8, status: "Success", reference: "TGT482910" },
  { id: "t2", date: "2026-07-12T18:40:00Z", bundle: "Weekly Plus", data: "7GB", amount: 4, status: "Success", reference: "TGT471233" },
  { id: "t3", date: "2026-07-05T07:55:00Z", bundle: "Daily Plus", data: "1.5GB", amount: 1, status: "Failed", reference: "TGT460187" },
  { id: "t4", date: "2026-06-28T14:05:00Z", bundle: "Monthly 20GB", data: "20GB", amount: 8, status: "Success", reference: "TGT441902" },
];

type AppState = {
  phone: string | null;
  remember: boolean;
  transactions: Txn[];
  login: (phone: string, remember: boolean) => void;
  logout: () => void;
  addTransaction: (t: Txn) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      phone: null,
      remember: true,
      transactions: SEED_TXNS,
      login: (phone, remember) => set({ phone, remember }),
      logout: () => set({ phone: null }),
      addTransaction: (t) => set((s) => ({ transactions: [t, ...s.transactions] })),
    }),
    {
      name: "tagtel-connect",
      partialize: (s) => (s.remember ? s : { transactions: s.transactions, remember: s.remember }),
    },
  ),
);

export function useHydrated() {
  return typeof window !== "undefined";
}