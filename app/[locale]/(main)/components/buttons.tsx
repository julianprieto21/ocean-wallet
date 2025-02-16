"use client";
import { useModalStore } from "@/lib/store/useModal";
import { ActionsDict } from "@/lib/types";
import { Plus, X } from "lucide-react";
import { useFormStatus } from "react-dom";

export function CreateAccount({ dict }: { dict: ActionsDict }) {
  const { setModalOpen, setModalActive } = useModalStore((state) => state);
  const handleOnClick = () => {
    setModalActive("create-account");
    setModalOpen(true);
  };
  return (
    <button
      type="button"
      className="flex flex-row items-center gap-2 text-xl text-primary-300 p-3 rounded-2xl mx-4 hover:bg-primary-250 hover:text-primary-400 transition-colors duration-75"
      onClick={handleOnClick}
    >
      <Plus className="size-7 flex-shrink-0" />
      <span className="">{dict.new_account}</span>
    </button>
  );
}

export function CreateTransaction() {
  return (
    <button
      title="Create Transaction"
      type="button"
      className="flex flex-row items-center text-xl text-primary-300 rounded-2xl hover:text-primary-400 transition-colors duration-75 flex-shrink-0"
    >
      <Plus className="size-10 flex-shrink-0" />
    </button>
  );
}

export function CloseModal({ handleOnClick }: { handleOnClick: () => void }) {
  return (
    <button
      title="Close Modal"
      type="button"
      className="absolute right-2 top-2 cursor-pointer text-gray-400 hover:text-gray-500"
      onClick={() => handleOnClick()}
    >
      <X className="size-6" />
    </button>
  );
}

type SubmitButtonProps = {
  main: string;
  loading: string;
};
export function SubmitButton({ main, loading }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex justify-center w-full rounded-lg bg-primary-50 p-4 text-primary-300 hover:bg-primary-100 hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? loading : main}
    </button>
  );
}
