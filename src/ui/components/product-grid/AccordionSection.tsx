"use client";

import { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

export default function AccordionSection({
    children,
    text,
}: {
    children: React.ReactNode;
    text: string;
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <div
                className="flex justify-between items-center py-4 border-t-1 cursor-pointer"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <div className="w-full">
                    <p>{text}</p>
                </div>
                <div>{isOpen ? <IoChevronUp /> : <IoChevronDown />}</div>
            </div>
            <div
                className={`flex shrink-0 overflow-hidden [transition:all_0.4s_ease] ${
                    isOpen ? "max-h-64" : "max-h-0"
                }`}
            >
                {children}
            </div>
        </>
    );
}
