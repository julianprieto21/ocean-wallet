import { Menu as MenuIcon } from "lucide-react";

export default function Menu() {
  return (
    <>
      <button title="Menu" type="button" className="absolute right-0">
        <MenuIcon className="size-8 flex-shrink-0 text-primary-300 hover:text-primary-400" />
      </button>
      <div className="absolute"></div>
    </>
  );
}
