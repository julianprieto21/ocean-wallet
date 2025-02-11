import { ActionsDict } from "@/lib/types";
import { FiPlus as PlusIcon } from "react-icons/fi";

export function CreateAccount({ dict }: { dict: ActionsDict }) {
  return (
    <button
      type="button"
      className="flex flex-row items-center gap-2 text-xl text-primary-300 p-3 rounded-2xl mx-4 hover:bg-primary-250 hover:text-primary-400 transition-colors duration-75"
    >
      <PlusIcon className="size-7 flex-shrink-0" />
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
      <PlusIcon className="size-10 flex-shrink-0" />
    </button>
  );
}
