import { getAllTabbable } from "@/lib/utils";
import { useEffect, useRef } from "react";

export function useFocusTrap(isOpen: boolean, handleClose: () => void) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!(isOpen && containerRef.current)) return;

        const modal = containerRef.current;
        const containerElements = getAllTabbable(modal);
        const firstElement = containerElements[0];
        const lastElement = containerElements[containerElements.length - 1];

        const handleTabPress = (e: KeyboardEvent) => {
            const currentActive = document.activeElement;

            if (!(e.key === "Tab" && currentActive instanceof HTMLElement)) return;

            if (
                e.shiftKey &&
                (currentActive === firstElement ||
                    !Array.from(containerElements).includes(currentActive))
            ) {
                e.preventDefault();
                lastElement.focus();
            } else if (
                !e.shiftKey &&
                (currentActive === lastElement ||
                    !Array.from(containerElements).includes(currentActive))
            ) {
                e.preventDefault();
                firstElement.focus();
            }
        };

        const handleEscPress = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;

            handleClose();
        };

        document.addEventListener("keydown", handleTabPress);
        document.addEventListener("keydown", handleEscPress);

        return () => {
            document.removeEventListener("keydown", handleTabPress);
            document.removeEventListener("keydown", handleEscPress);
        };
    }, [isOpen]);

    return containerRef;
}
