import { create } from "zustand";

type ModalStore = {
    isOpen: boolean;
    resolve: ((value: boolean) => void) | null;
    openModal: () => Promise<boolean>;
    closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
    isOpen: false,
    resolve: null,
    openModal: () =>
        new Promise<boolean>((resolveFn) => {
            set({
                isOpen: true,
                resolve: resolveFn,
            });
        }),
    closeModal: () => {
        set({
            isOpen: false,
            resolve: null,
        });
    },
}));
