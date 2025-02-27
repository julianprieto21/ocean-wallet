"use client";
import { useModalStore } from "@/lib/store/modalStore";
import { Menu as MenuIcon } from "lucide-react";

export default function Menu() {
  const { setModalOpen, setModalActive } = useModalStore((state) => state);
  const OnClick = () => {
    setModalActive("menu");
    setModalOpen(true);
  };
  return (
    <>
      <button
        title="Menu"
        type="button"
        className="absolute right-0"
        onClick={OnClick}
      >
        <MenuIcon className="size-8 flex-shrink-0 text-primary-300 hover:text-primary-400" />
      </button>
      <div className="absolute"></div>
    </>
  );
}
