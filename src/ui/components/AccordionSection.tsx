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
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <div className="w-full py-4 ">{text}</div>
                <div>{isOpen ? <IoChevronUp /> : <IoChevronDown />}</div>
            </div>
            <div
                className={`flex flex-wrap gap-4 h-min shrink-0 text-sm overflow-hidden [transition:all_0.4s_ease] ${
                    isOpen ? "max-h-64" : "max-h-0"
                }`}
            >
                <div className="w-full"></div>
                {children}
                <div className="w-full"></div>
            </div>
        </div>
    );
}
