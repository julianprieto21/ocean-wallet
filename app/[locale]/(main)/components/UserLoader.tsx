"use client";

import { useModalStore } from "@/lib/store/useModal";
import { useUserStore } from "@/lib/store/userStore";
import { Account } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const UserLoader = ({ accounts }: { accounts: Account[] }) => {
  const { data: session } = useSession();
  const { setUsername, setEmail, setImage, setPreferenceCurrency } =
    useUserStore();
  useEffect(() => {
    if (!session) return;
    setUsername(session.user.name);
    setEmail(session.user.email);
    setImage(session.user.image);
    setPreferenceCurrency(session.user.preferenceCurrency);
  }, [session, setUsername, setEmail, setImage, setPreferenceCurrency]);

  const { setModalOpen, setModalActive } = useModalStore((state) => state);
  useEffect(() => {
    if (accounts.length == 0) {
      setModalActive("no-account");
      setModalOpen(true);
    }
  }, [accounts, setModalOpen, setModalActive]);
  return <></>;
};
