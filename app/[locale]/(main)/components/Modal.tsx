"use client";

import { Card } from "./Card";
import { useModalStore } from "@/lib/store/useModal";
import { Account, Dict } from "@/lib/types";
import { CloseModal } from "./Buttons";
import { AccountForm, TransactionForm } from "./Forms";
import { useEffect } from "react";

type ModalProps = {
  dict: Dict;
  accounts: Account[];
};
export function Modal({ dict, accounts }: ModalProps) {
  const { setModalActive, modalActive, setModalOpen, modalOpen } =
    useModalStore((state) => state);
  const createAccountMessage = dict.modalMessages.create_account;
  const createTransactionMessage = dict.modalMessages.create_transactions;
  const noAccountMessage = dict.modalMessages.no_account;

  useEffect(() => {
    if (accounts.length == 0) {
      setModalActive("no-account");
      setModalOpen(true);
    }
  }, [accounts, setModalOpen, setModalActive]);

  const NoAccount = () => (
    <Card className="w-full max-w-md p-6 relative h-fit py-4">
      <h2 className="text-xl font-bold">{noAccountMessage.title}</h2>
      <CloseModal handleOnClick={setModalOpen.bind(null, false)} />
      <p className="mt-2 text-sm text-gray-500">{noAccountMessage.message}</p>
      <button
        type="button"
        className="flex justify-center mt-10 w-full rounded-lg bg-primary-50 p-4 text-primary-300 hover:bg-primary-100 hover:text-primary-400"
        onClick={setModalActive.bind(null, "create-account")}
      >
        {noAccountMessage.button}
      </button>
    </Card>
  );

  const CreateAccount = () => (
    <Card className="w-full max-w-md p-6 relative h-fit py-4">
      <h2 className="text-xl font-bold">{createAccountMessage.title}</h2>
      <CloseModal handleOnClick={setModalOpen.bind(null, false)} />
      <AccountForm dict={dict} accounts={accounts} />
    </Card>
  );

  const CreateTransaction = () => (
    <Card className="w-full max-w-md p-6 relative h-fit py-4">
      <h2 className="text-xl font-bold">{createTransactionMessage.title}</h2>
      <CloseModal handleOnClick={setModalOpen.bind(null, false)} />
      <TransactionForm dict={dict} accounts={accounts} />
    </Card>
  );

  return (
    <div
      className={` ${
        modalOpen ? "block" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full max-h-full bg-black/50 backdrop-blur-md`}
    >
      {modalActive === "no-account" && <NoAccount />}
      {modalActive === "create-account" && <CreateAccount />}
      {modalActive === "create-transaction" && <CreateTransaction />}
    </div>
  );
}
