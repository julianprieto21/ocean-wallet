"use client";

import { Card } from "./Card";
import { useModalStore } from "@/lib/store/modalStore";
import { Account, Dict } from "@/lib/types";
import { CloseModal } from "./Buttons";
import {
  AccountForm,
  SignOutForm,
  TransactionForm,
  TransferForm,
  UserForm,
} from "./Forms";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ModalProps = {
  dict: Dict;
  accounts: Account[];
};
export function Modal({ dict, accounts }: ModalProps) {
  const { setModalActive, modalActive, setModalOpen, modalOpen } =
    useModalStore((state) => state);
  const createAccountMessages = dict.modalMessages.create_account;
  const createTransactionMessages = dict.modalMessages.create_transactions;
  const noAccountMessages = dict.modalMessages.no_account;
  const menuMessages = dict.modalMessages.menu;
  const createTransferMessages = dict.modalMessages.create_transfers;

  useEffect(() => {
    if (accounts.length == 0) {
      setModalActive("no-account");
      setModalOpen(true);
    }
  }, [accounts, setModalOpen, setModalActive]);

  const NoAccount = () => (
    <Card className="w-full max-w-md p-6 relative h-fit py-4">
      <h2 className="text-xl font-bold">{noAccountMessages.title}</h2>
      <CloseModal handleOnClick={setModalOpen.bind(null, false)} />
      <p className="mt-2 text-sm text-gray-500">{noAccountMessages.message}</p>
      <button
        type="button"
        className="flex justify-center mt-10 w-full rounded-lg bg-primary-50 p-4 text-primary-300 hover:bg-primary-100 hover:text-primary-400"
        onClick={setModalActive.bind(null, "create-account")}
      >
        {noAccountMessages.button}
      </button>
    </Card>
  );

  const MenuModal = () => (
    <Card className="w-full max-w-md p-6 relative h-fit py-4">
      <h2 className="text-xl font-bold">{menuMessages.title}</h2>
      <CloseModal handleOnClick={setModalOpen.bind(null, false)} />
      <UserForm dict={dict} />
      <div className="border-t border-primary-300 w-full my-2"></div>
      <SignOutForm dict={dict} />
    </Card>
  );

  const CreateAccount = () => (
    <Card className="w-full max-w-md p-6 relative h-fit py-4">
      <h2 className="text-xl font-bold">{createAccountMessages.title}</h2>
      <CloseModal handleOnClick={setModalOpen.bind(null, false)} />
      <AccountForm dict={dict} accounts={accounts} />
    </Card>
  );

  const CreateTransaction = () => (
    <Card className="w-full max-w-md p-6 relative h-fit py-4">
      <h2 className="text-xl font-bold">{createTransactionMessages.title}</h2>
      <CloseModal handleOnClick={setModalOpen.bind(null, false)} />
      <TransactionForm dict={dict} accounts={accounts} />
      <ChevronRight
        className="size-10 md:size-8 cursor-pointer absolute top-1/2 -translate-y-1/2 -right-9 md:-right-10 text-primary-300 hover:text-primary-200 hover:translate-x-2 transition-all duration-100"
        onClick={setModalActive.bind(null, "create-transfer")}
      />
    </Card>
  );

  const CreateTransfer = () => (
    <Card className="w-full max-w-md p-6 relative h-fit py-4">
      <h2 className="text-xl font-bold">{createTransferMessages.title}</h2>
      <CloseModal handleOnClick={setModalOpen.bind(null, false)} />
      <TransferForm dict={dict} accounts={accounts} />
      <ChevronLeft
        className="size-10 md:size-8 cursor-pointer absolute top-1/2 -translate-y-1/2 -left-9 md:-left-10 text-primary-300 hover:text-primary-200 hover:-translate-x-2 transition-all duration-100"
        onClick={setModalActive.bind(null, "create-transaction")}
      />
    </Card>
  );

  return (
    <div
      className={` ${
        modalOpen ? "block" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full max-h-full bg-black/50 backdrop-blur-md px-10 md:px-0`}
    >
      {modalActive === "no-account" && <NoAccount />}
      {modalActive === "create-account" && <CreateAccount />}
      {modalActive === "create-transaction" && <CreateTransaction />}
      {modalActive === "create-transfer" && <CreateTransfer />}
      {modalActive === "menu" && <MenuModal />}
    </div>
  );
}
