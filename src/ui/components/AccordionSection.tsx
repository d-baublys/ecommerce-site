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
        <div>
            <div
                className="flex justify-between items-center border cursor-pointer"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <div className="w-full py-4 ">{text}</div>
                <div>{isOpen ? <IoChevronUp /> : <IoChevronDown />}</div>
            </div>
            <div className={`flex flex-wrap gap-4 h-min shrink-0 overflow-hidden [transition:all_0.4s_ease] ${isOpen ? "max-h-72" : "max-h-0"}`}>{children}</div>
        </div>
    );
}
