import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  username: string;
  email: string;
  image: string;
  preference_currency: string;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setImage: (image: string) => void;
  setPreferenceCurrency: (currency: string) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      username: "",
      email: "",
      image: "",
      preference_currency: "usd",
      setUsername: (username: string) => set({ username }),
      setEmail: (email: string) => set({ email }),
      setImage: (image: string) => set({ image }),
      setPreferenceCurrency: (currency: string) =>
        set({ preference_currency: currency }),
    }),
    { name: "user-store" }
  )
);
