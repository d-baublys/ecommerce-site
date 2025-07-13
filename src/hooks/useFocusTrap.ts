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
            if (e.key !== "Tab") return;

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
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
        firstElement.focus();

        return () => {
            document.removeEventListener("keydown", handleTabPress);
            document.removeEventListener("keydown", handleEscPress);
        };
    }, [isOpen]);

    return containerRef;
}
