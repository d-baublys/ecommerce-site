"use client";

import { IoClose } from "react-icons/io5";

interface CloseButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
    size?: number;
}

export default function CloseButton({ size = 24, className, ...restProps }: CloseButtonProps) {
    return (
        <button
            type="button"
            className={`flex items-center rounded-circle ${className ?? ""}`}
            {...restProps}
        >
            <IoClose className="cursor-pointer" size={size} />
        </button>
    );
}
