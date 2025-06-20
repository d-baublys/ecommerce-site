"use client";

import { useState } from "react";

interface LogInInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    labelText: string;
    overrideClasses?: string;
}

export default function LogInInput({
    type = "text",
    labelText,
    overrideClasses,
    ...props
}: LogInInputProps) {
    const [showRed, setShowRed] = useState<boolean>();

    return (
        <label className="relative block group">
            <span
                className={`absolute left-0 translate-y-1/6 transition-all group-focus-within:-top-8 group-focus-within:text-sz-smallest ${
                    showRed ? "text-red-500" : ""
                } ${props.value !== "" ? "-top-8 text-sz-smallest" : "top-0"}`}
            >
                {labelText}
            </span>
            <input
                className={`w-full border-b-2 p-1 outline-none ${
                    showRed ? " border-red-500" : "focus:border-blue-700"
                } ${overrideClasses}`}
                onFocus={() => setShowRed(false)}
                onBlur={() => props.value === "" && setShowRed(true)}
                {...props}
            ></input>
            {showRed && (
                <div className="mt-1">
                    <p className="text-sz-smallest text-red-500">Please fill out this field.</p>
                </div>
            )}
        </label>
    );
}
