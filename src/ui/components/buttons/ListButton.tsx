"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ListButtonProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
    link?: string;
    relativeLink?: boolean;
    overrideClasses?: string;
}

export default function ListButton({
    link,
    relativeLink,
    overrideClasses,
    ...props
}: ListButtonProps) {
    const pathname = usePathname();

    // as div for valid wrapping by anchor
    const buttonContent = () => (
        <div
            className={`flex items-center gap-2 w-full h-16 p-4 bg-white border-2 border-background-lightest hover:border-black active:drop-shadow-(--button-shadow) transition ${overrideClasses}`}
            {...props}
        >
            • {props.children}
        </div>
    );

    if (link)
        return <Link href={relativeLink ? `${pathname}${link}` : link}>{buttonContent()}</Link>;

    return buttonContent();
}
