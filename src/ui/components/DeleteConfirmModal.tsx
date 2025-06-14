"use client";

import { useModalStore } from "@/stores/modalStore";
import RoundedButton from "./RoundedButton";
import Modal from "./Modal";

export default function DeleteConfirmModal() {
    const { isModalOpen, resolve, closeModal } = useModalStore((state) => state);

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
        <Modal handleClose={handleCancel} scrollPredicate={isModalOpen}>
            <div className="flex flex-col grow justify-evenly text-center">
                <p className="text-center">Are you sure you want to delete this product?</p>
                <p>This cannot be undone.</p>
                <div className="flex justify-center items-center w-full mt-4 gap-4 md:gap-8">
                    <RoundedButton onClick={handleConfirm}>Confirm</RoundedButton>
                    <RoundedButton onClick={handleCancel}>Cancel</RoundedButton>
                </div>
            </div>
        </Modal>
    );
}
