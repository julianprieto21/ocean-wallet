import { create } from "zustand";
// import { persist } from "zustand/middleware";

type ModalStore = {
  modalActive: string;
  setModalActive: (modalActive: string) => void;
  modalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
};

export const useModalStore = create<ModalStore>()(
  // persist(
  (set) => ({
    modalActive: "",
    setModalActive: (modalActive: string) => set({ modalActive }),
    modalOpen: false,
    setModalOpen: (isOpen: boolean) => set({ modalOpen: isOpen }),
  })
  // { name: "modal-store" }
  // )
);
