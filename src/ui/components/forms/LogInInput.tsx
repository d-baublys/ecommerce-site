"use client";

import { isolateInteraction } from "@/lib/utils";
import { useEffect, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

interface LogInInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    labelText: string;
    showRedOverride: boolean;
    isPasswordInput: boolean;
    overrideClasses?: string;
}

export default function LogInInput({
    type = "text",
    labelText,
    showRedOverride,
    isPasswordInput,
    overrideClasses,
    ...props
}: LogInInputProps) {
    const [showRed, setShowRed] = useState<boolean>();
    const [typeProp, setTypeProp] = useState(type);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = (e: React.MouseEvent) => {
        isolateInteraction(e);
        setIsPasswordVisible((prev) => !prev);
    };

    useEffect(() => {
        setShowRed(showRedOverride);
    }, [showRedOverride]);

    useEffect(() => {
        if (!isPasswordInput) return;

        setTypeProp(isPasswordVisible ? "text" : "password");
    }, [isPasswordVisible]);

    return (
        <label className="relative block group">
            <span
                className={`absolute left-0 translate-y-1/6 transition-all group-focus-within:-top-8 group-focus-within:text-sz-smallest pointer-events-none ${
                    showRed ? "text-red-500" : ""
                } ${props.value !== "" ? "-top-8 text-sz-smallest" : "top-0"}`}
            >
                {labelText}
            </span>
            <div
                className={`w-full border-b-2 p-1 outline-none cursor-text ${
                    showRed ? " border-red-500" : "focus-within:border-blue-700"
                } ${overrideClasses ?? ""}`}
            >
                <input
                    className="w-[calc(100%-2.25rem)] outline-none"
                    type={typeProp}
                    onFocus={() => setShowRed(false)}
                    onBlur={() => props.value === "" && setShowRed(true)}
                    {...props}
                ></input>
            </div>
            {isPasswordInput && (
                <button
                    type="button"
                    className="absolute right-0 top-0 lg:translate-y-1/12 -translate-x-1/6 p-1 rounded-circle cursor-pointer"
                    onClick={togglePasswordVisibility}
                >
                    {isPasswordVisible ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
            )}
            {showRed && (
                <div className="mt-1">
                    <p className="text-sz-smallest text-red-500">Please fill out this field.</p>
                </div>
            )}
        </label>
    );
}
