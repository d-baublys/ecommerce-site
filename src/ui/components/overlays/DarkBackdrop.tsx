"use client";

export default function DarkBackdrop({
    onClick,
    overrideClasses,
}: {
    onClick?: () => void;
    overrideClasses?: string;
}) {
    return (
        <div
            id="modal-backdrop"
            onClick={onClick}
            className={`fixed top-0 left-0 w-full min-h-screen bg-black opacity-75 z-[5000] ${
                overrideClasses ?? ""
            }`}
        ></div>
    );
}
