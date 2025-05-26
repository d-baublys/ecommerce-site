"use client";

import { useModalStore } from "@/stores/modalStore";
import GeneralButton from "./GeneralButton";

export default function ConfirmModal() {
    const { isOpen, resolve, closeModal } = useModalStore((state) => state);

    const handleConfirm = () => {
        resolve?.(true);
        closeModal();
    };

    const handleCancel = () => {
        resolve?.(false);
        closeModal();
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                id="modal-backdrop"
                className="fixed top-0 left-0 w-full min-h-screen bg-black opacity-75 "
            ></div>
            ;
            <div
                id="modal-container"
                onClick={handleCancel}
                className="fixed top-0 left-0 flex flex-col w-full justify-center items-center min-h-screen"
            >
                <div
                    id="modal"
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-col w-[500px] h-[250px] bg-contrasted justify-evenly p-8 rounded-2xl drop-shadow-2xl"
                >
                    <span className="text-center">
                        Are you sure you want to delete this product? This action cannot be undone.
                    </span>
                    <div className="flex justify-evenly items-center w-full gap-4">
                        <GeneralButton onClick={handleConfirm}>Confirm</GeneralButton>
                        <GeneralButton onClick={handleCancel}>Cancel</GeneralButton>
                    </div>
                </div>
            </div>
        </>
    );
}
