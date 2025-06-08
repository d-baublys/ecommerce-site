"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ListButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    link?: string;
    relativeLink?: boolean;
    className?: string;
}

export default function ListButton({
    link,
    relativeLink,
    className: overrideClasses,
    ...props
}: ListButtonProps) {
    const pathname = usePathname();

    const buttonContent = () => (
        <button
            type="button"
            className={`flex items-center gap-2 w-full h-16 p-4 bg-white border-2 border-white hover:border-black active:drop-shadow-(--button-shadow) transition ${overrideClasses}`}
            {...props}
        >
            • {props.children}
        </button>
    );

    if (link)
        return <Link href={relativeLink ? `${pathname}${link}` : link}>{buttonContent()}</Link>;

    return buttonContent();
}
