"use client";

import { useRef } from "react";

export default function RoundedButtonBase({
    children,
    overrideClasses,
}: {
    children?: React.ReactNode;
    overrideClasses?: string;
}) {
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
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`rounded-btn relative flex justify-center items-center w-full px-6 py-2 rounded-full gap-2 text-sz-label-button lg:text-sz-label-button-lg cursor-pointer hover:scale-[103%] transition active:drop-shadow-(--button-shadow) ${
                overrideClasses ?? ""
            }`}
        >
            {children}
        </div>
    );
}
