"use client";

import useBodyScrollLock from "@/hooks/useBodyScrollLock";
import DarkBackdrop from "./DarkBackdrop";
import CloseButton from "./CloseButton";

export interface ModalProps {
    children: React.ReactNode;
    handleClose: () => void;
    scrollPredicate: boolean;
    hasCloseButton?: boolean;
    overrideClasses?: string;
}

export default function Modal({
    children,
    handleClose,
    scrollPredicate,
    hasCloseButton,
    overrideClasses,
}: ModalProps) {
    useBodyScrollLock(scrollPredicate);

    return (
        <>
            <DarkBackdrop zIndex={1000} />
            <div
                id="modal-container"
                onClick={handleClose}
                className="fixed top-0 left-0 flex flex-col w-full justify-center items-center min-h-screen z-[1500] px-4"
            >
                <div
                    id="modal"
                    onClick={(e) => e.stopPropagation()}
                    className={`relative flex min-w-[300px] w-full max-w-[400px] h-[250px] bg-white p-8 rounded-2xl drop-shadow-2xl [animation:popIn_0.3s_ease] ${overrideClasses}`}
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
