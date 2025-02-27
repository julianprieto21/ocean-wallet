import { Dict } from "@/lib/types";
import { CreateAccount, CreateTransaction, CreateTransfer } from "./Buttons";

export function ToolsBar({ dict }: { dict: Dict }) {
  return (
    <div className="flex md:hidden justify-between items-center w-full flex-shrink-0">
      <div className="flex items-start">
        <CreateAccount dict={dict.actions} />
      </div>
      <div className="flex justify-end gap-2">
        <CreateTransaction />
        <CreateTransfer />
      </div>
    </div>
  );
}
