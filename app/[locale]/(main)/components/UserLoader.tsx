"use client";

import { useUserStore } from "@/lib/store/userStore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const UserLoader = () => {
  const { data: session } = useSession();
  const { setUsername, setEmail, setImage, setPreferenceCurrency } =
    useUserStore();
  useEffect(() => {
    if (!session) return;
    setUsername(session.user.name);
    setEmail(session.user.email);
    setImage(session.user.image);
    setPreferenceCurrency(session.user.preferenceCurrency);
  }, [session]);
  return <></>;
};
