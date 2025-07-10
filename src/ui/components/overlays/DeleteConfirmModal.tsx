"use client";

import { useModalStore } from "@/stores/modalStore";
import PlainRoundedButton from "@/ui/components/buttons/PlainRoundedButton";
import Modal from "@/ui/components/overlays/Modal";

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
        <Modal handleClose={handleCancel} isOpenState={isModalOpen}>
            <div className="flex flex-col grow justify-evenly text-center">
                <p className="text-center">Are you sure you want to delete this product?</p>
                <p>This cannot be undone.</p>
                <div className="flex justify-center items-center w-full mt-4 gap-4 md:gap-8">
                    <PlainRoundedButton
                        onClick={handleConfirm}
                        overrideClasses="!bg-background-lightest"
                    >
                        Confirm
                    </PlainRoundedButton>
                    <PlainRoundedButton onClick={handleCancel}>Cancel</PlainRoundedButton>
                </div>
            </div>
        </Modal>
    );
}
