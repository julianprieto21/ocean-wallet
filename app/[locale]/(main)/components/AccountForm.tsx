"use client";
import { createAccount } from "@/lib/actions";
import { useModalStore } from "@/lib/store/useModal";
import { Form } from "@/lib/types";
import { useRouter } from "next/navigation";
import { SubmitButton } from "./buttons";

export function AccountForm({ formDict }: { formDict: Form }) {
  const dict = formDict.accountForm;
  const pendingText = formDict.pending;
  const { setModalOpen } = useModalStore((state) => state);
  const router = useRouter();

  async function HandleSubmit(formData: FormData) {
    try {
      await createAccount(formData);
    } catch (error) {
      console.log(error);
    } finally {
      router.refresh();
      setTimeout(() => {
        setModalOpen(false);
      }, 1000);
    }
  }
  return (
    <form className="flex flex-col gap-2 mt-4" action={HandleSubmit}>
      <input
        type="text"
        name="name"
        required
        className="border-b border-primary-200 placeholder:text-primary-200 focus:border-primary-300 focus:placeholder:text-primary-300 transition-colors duration-74"
        placeholder={dict.name}
      />
      <input
        type="text"
        name="type"
        required
        className="border-b border-primary-200 placeholder:text-primary-200 focus:border-primary-300 focus:placeholder:text-primary-300 transition-colors duration-74"
        placeholder={dict.type}
      />
      <input
        type="text"
        name="provider"
        required
        className="border-b border-primary-200 placeholder:text-primary-200 focus:border-primary-300 focus:placeholder:text-primary-300 transition-colors duration-74"
        placeholder={dict.provider}
      />
      <input
        type="number"
        name="initial"
        min={0}
        defaultValue={0}
        required
        className="border-b border-primary-200 placeholder:text-primary-200 focus:border-primary-300 focus:placeholder:text-primary-300 transition-colors duration-74"
        placeholder={dict.initial}
      />
      <SubmitButton main={dict.create} loading={pendingText} />
    </form>
  );
}
