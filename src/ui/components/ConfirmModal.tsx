"use client";

import { useModalStore } from "@/stores/modalStore";
import GeneralButton from "./GeneralButton";
import useBodyScrollLock from "@/hooks/useBodyScrollLock";
import DarkBackdrop from "./DarkBackdrop";

export default function ConfirmModal() {
    const { isModalOpen, resolve, closeModal } = useModalStore((state) => state);

    useBodyScrollLock(isModalOpen);

    const handleConfirm = () => {
        resolve?.(true);
        closeModal();
    };

    const handleCancel = () => {
        resolve?.(false);
        closeModal();
    };

    if (!isModalOpen) return null;

    return (
        <>
            <DarkBackdrop zIndex={100} />
            <div
                id="modal-container"
                onClick={handleCancel}
                className="fixed top-0 left-0 flex flex-col w-full justify-center items-center min-h-screen z-[200]"
            >
                <div
                    id="modal"
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-col w-[500px] h-[250px] bg-contrasted justify-evenly p-8 rounded-2xl drop-shadow-2xl"
                >
                    <p className="text-center">
                        Are you sure you want to delete this product? This action cannot be undone.
                    </p>
                    <div className="flex justify-evenly items-center w-full gap-4">
                        <GeneralButton onClick={handleConfirm}>Confirm</GeneralButton>
                        <GeneralButton onClick={handleCancel}>Cancel</GeneralButton>
                    </div>
                </div>
            </div>
        </>
    );
}
