"use client";

import useBodyScrollLock from "@/hooks/useBodyScrollLock";
import DarkBackdrop from "@/ui/components/overlays/DarkBackdrop";
import CloseButton from "@/ui/components/buttons/CloseButton";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export interface ModalProps {
    children: React.ReactNode;
    handleClose: () => void;
    isOpenState: boolean;
    hasCloseButton?: boolean;
    overrideClasses?: string;
}

export default function Modal({
    children,
    handleClose,
    isOpenState,
    hasCloseButton,
    overrideClasses,
}: ModalProps) {
    useBodyScrollLock(isOpenState);

    const trapRef = useFocusTrap(isOpenState, handleClose);

    return (
        <>
            <DarkBackdrop />
            <div
                id="modal-container"
                onClick={handleClose}
                className="fixed top-0 left-0 flex flex-col w-full justify-center items-center min-h-screen z-[9999] px-4"
            >
                <div
                    id="modal"
                    onClick={(e) => e.stopPropagation()}
                    className={`relative flex min-w-[300px] w-full max-w-[400px] h-[250px] bg-white p-8 rounded-2xl drop-shadow-2xl [animation:small-pop-in_0.3s_ease] ${
                        overrideClasses ?? ""
                    }`}
                    ref={trapRef}
                    role="dialog"
                    aria-modal="true"
                >
                    {hasCloseButton && (
                        <div className="absolute top-0 right-0 p-4">
                            <CloseButton onClick={handleClose} />
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </>
    );
}
