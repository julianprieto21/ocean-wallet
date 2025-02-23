import { create } from "zustand";
import { persist } from "zustand/middleware";

type UISettingsStore = {
  transactionType: string;
  chartLength: number;
  setTransactioType: (transactionType: string) => void;
  setChartLength: (chartLength: number) => void;
};

export const useUISettingsStore = create<UISettingsStore>()(
  persist(
    (set) => ({
      transactionType: "transactional",
      setTransactioType: (transactionType: string) =>
        set({ transactionType: transactionType }),
      chartLength: 7,
      setChartLength: (chartLength: number) =>
        set({ chartLength: chartLength }),
    }),
    { name: "interact-store" }
  )
);
