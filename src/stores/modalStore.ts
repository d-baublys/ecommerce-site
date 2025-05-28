import { create } from "zustand";

type ModalStore = {
    isModalOpen: boolean;
    resolve: ((value: boolean) => void) | null;
    openModal: () => Promise<boolean>;
    closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
    isModalOpen: false,
    resolve: null,
    openModal: () =>
        new Promise<boolean>((resolveFn) => {
            set({
                isModalOpen: true,
                resolve: resolveFn,
            });
        }),
    closeModal: () => {
        set({
            isModalOpen: false,
            resolve: null,
        });
    },
}));
