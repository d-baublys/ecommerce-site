"use client";

import { useRef } from "react";

export interface RoundedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    overrideClasses?: string;
}

export default function RoundedButton({
    type = "button",
    overrideClasses,
    ...props
}: RoundedButtonProps) {
    const originAxisRef = useRef<"x" | "y">("x");

    const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        const currElement = e.currentTarget;

        if (!currElement) return;

        const { left, right, top, bottom } = currElement.getBoundingClientRect();
        const deltas = {
            left: e.clientX - left,
            right: right - e.clientX,
            top: e.clientY - top,
            bottom: bottom - e.clientY,
        };

        const origin = Object.entries(deltas).reduce(
            (closest, [direction, delta]) => {
                return delta < closest.delta ? { direction, delta } : closest;
            },
            { direction: "", delta: Infinity }
        );

        currElement.style.setProperty("--scale-x", "0");
        currElement.style.setProperty("--scale-y", "0");

        if (origin.direction === "left" || origin.direction === "right") {
            currElement.style.setProperty("--origin-x", origin.direction);
            currElement.style.setProperty("--scale-x", "1");
            originAxisRef.current = "x";
        } else {
            currElement.style.setProperty("--origin-y", origin.direction);
            currElement.style.setProperty("--scale-y", "1");
            originAxisRef.current = "y";
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
        const currElement = e.currentTarget;

        if (!currElement) return;

        originAxisRef.current === "x"
            ? currElement.style.setProperty("--scale-x", "0")
            : currElement.style.setProperty("--scale-y", "0");
    };

    return (
        <button
            type={type}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`rounded-btn relative flex justify-center items-center px-6 py-2 bg-white rounded-full border border-component-color gap-2 text-sz-label-button lg:text-sz-label-button-lg cursor-pointer hover:scale-[103%] transition active:drop-shadow-(--button-shadow) ${
                overrideClasses ?? ""
            }`}
            {...props}
        >
            {props.children}
        </button>
    );
}
