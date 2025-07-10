"use client";

import { useFocusTrap } from "@/hooks/useFocusTrap";
import CloseButton from "@/ui/components/buttons/CloseButton";

export interface MenuProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    isOpenState: boolean;
    handleClose: () => void;
    overrideClasses?: string;
}

export default function SlideDownMenu({
    children,
    isOpenState,
    handleClose,
    overrideClasses,
    ...props
}: MenuProps) {
    const trapRef = useFocusTrap(isOpenState, handleClose);

    return (
        <div
            className={`fixed left-0 w-screen h-full bg-white [transition:all_0.3s_ease-in-out] overflow-auto z-[9999] ${
                overrideClasses ?? ""
            } ${isOpenState ? "top-0" : "top-[-250%]"}`}
            {...props}
            ref={trapRef}
            role="dialog"
            aria-modal="true"
        >
            {isOpenState && (
                <>
                    <div className="relative inset-0 mx-4 my-(--nav-height)">
                        <div className="flex justify-center pt-[5rem] h-min">{children}</div>
                    </div>
                    <div className="fixed top-10 right-4 sm:right-8 p-1 bg-background-lightest rounded-full z-[100]">
                        <CloseButton
                            title="Close menu"
                            aria-label="Close menu"
                            onClick={handleClose}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
