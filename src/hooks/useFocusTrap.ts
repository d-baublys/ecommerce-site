import { useEffect, useRef } from "react";

export function useFocusTrap(isOpen: boolean, handleClose: () => void) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!(isOpen && containerRef.current)) return;

        const modal = containerRef.current;
        const containerElements = modal.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
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

        modal.addEventListener("keydown", handleTabPress);
        modal.addEventListener("keydown", handleEscPress);
        firstElement.focus();

        return () => {
            modal.removeEventListener("keydown", handleTabPress);
            modal.removeEventListener("keydown", handleEscPress);
        };
    }, [isOpen]);

    return containerRef;
}
