"use client";

import { Card } from "./Card";
import { useModalStore } from "@/lib/store/useModal";
import { Dict } from "@/lib/types";
import { CloseModal } from "./Buttons";
import { AccountForm } from "./AccountForm";
import { TransactionForm } from "./TransactionForm";

type ModalProps = {
  messages: {
    title: string;
    message: string;
    button: string;
  };
};
export function Modal({ dict }: { dict: Dict }) {
  const { modalActive, modalOpen } = useModalStore((state) => state);
  return (
    <div
      className={` ${
        modalOpen ? "block" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full max-h-full bg-black/50 backdrop-blur-md`}
    >
      {modalActive === "no-account" && (
        <NoAccountModal messages={dict.modalMessages.no_account} />
      )}
      {modalActive === "create-account" && (
        <CreateAccountModal
          messages={dict.modalMessages.create_account}
          dict={dict}
        />
      )}
      {modalActive === "create-transaction" && (
        <CreateTransactionModal
          messages={dict.modalMessages.create_transactions}
          dict={dict}
        />
      )}
    </div>
  );
}

function NoAccountModal({ messages }: ModalProps) {
  const { setModalOpen, setModalActive } = useModalStore((state) => state);
  const handleOnClick = () => {
    setModalActive("create-account");
  };
  return (
    <Card className="w-full max-w-md p-6 relative h-fit py-4">
      <h2 className="text-xl font-bold">{messages.title}</h2>
      <CloseModal handleOnClick={setModalOpen.bind(null, false)} />
      <p className="mt-2 text-sm text-gray-500">{messages.message}</p>
      <button
        type="button"
        className="flex justify-center mt-10 w-full rounded-lg bg-primary-50 p-4 text-primary-300 hover:bg-primary-100 hover:text-primary-400"
        onClick={handleOnClick}
      >
        {messages.button}
      </button>
    </Card>
  );
}

function CreateAccountModal({ messages, dict }: ModalProps & { dict: Dict }) {
  const { setModalOpen } = useModalStore((state) => state);

  return (
    <Card className="w-full max-w-md p-6 relative h-fit py-4">
      <h2 className="text-xl font-bold">{messages.title}</h2>
      <CloseModal handleOnClick={setModalOpen.bind(null, false)} />
      <AccountForm dict={dict} />
    </Card>
  );
}

function CreateTransactionModal({
  messages,
  dict,
}: ModalProps & { dict: Dict }) {
  const { setModalOpen } = useModalStore((state) => state);

  return (
    <Card className="w-full max-w-md p-6 relative h-fit py-4">
      <h2 className="text-xl font-bold">{messages.title}</h2>
      <CloseModal handleOnClick={setModalOpen.bind(null, false)} />
      <TransactionForm dict={dict} />
    </Card>
  );
}
