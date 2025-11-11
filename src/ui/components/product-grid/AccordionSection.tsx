"use client";

import { ProductGridFilters } from "@/lib/types";
import { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

export default function AccordionSection({
    children,
    text,
    filters,
}: {
    children: React.ReactNode;
    text: string;
    filters: ProductGridFilters;
}) {
    const [isOpen, setIsOpen] = useState<boolean>(!!filters.length);
    const [isContentHidden, setIsContentHidden] = useState<boolean>(!filters.length);

    const handleSectionClick = () => {
        setTimeout(
            () => {
                setIsOpen((prev) => !prev);
            },
            isOpen ? 0 : 50
        );

        setTimeout(
            () => {
                setIsContentHidden((prev) => !prev);
            },
            isContentHidden ? 0 : 400
        );
    };

    return (
        <>
            <button
                className="flex justify-between items-center w-full py-4 border-t-1 cursor-pointer"
                onClick={handleSectionClick}
            >
                <div className="flex w-full">
                    <p>{text}</p>
                </div>
                <div>{isOpen ? <IoChevronUp /> : <IoChevronDown />}</div>
            </button>
            <div
                className={`flex shrink-0 overflow-hidden [transition:all_0.4s_ease] ${
                    isOpen ? "max-h-64" : "max-h-0"
                }`}
            >
                <div className={`${isContentHidden ? "hidden" : ""}`}>{children}</div>
            </div>
        </>
    );
}
