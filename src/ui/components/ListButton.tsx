"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ListButton({
    text,
    classes,
    onClick,
    link,
    relativeLink,
}: {
    text: string;
    classes?: string;
    onClick?: () => void;
    link?: string;
    relativeLink?: boolean;
}) {
    const pathname = usePathname();

    const buttonContent = () => (
        <button
            className={`flex items-center gap-2 w-full h-16 p-4 bg-contrasted border-2 border-contrasted hover:border-black active:drop-shadow-(--button-shadow) transition ${classes}`}
            onClick={onClick}
        >
            • {text}
        </button>
    );

    if (link)
        return <Link href={relativeLink ? `${pathname}${link}` : link}>{buttonContent()}</Link>;

    return buttonContent();
}
