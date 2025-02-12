import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  username: string;
  email: string;
  image: string;
  preferenceCurrency: string;
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
      preferenceCurrency: "usd",
      setUsername: (username: string) => set({ username }),
      setEmail: (email: string) => set({ email }),
      setImage: (image: string) => set({ image }),
      setPreferenceCurrency: (currency: string) =>
        set({ preferenceCurrency: currency }),
    }),
    { name: "user-store" }
  )
);
