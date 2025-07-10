import { useEffect } from "react";

export function useRestoreFocus(
    isOpenState: boolean,
    elementRef: React.RefObject<HTMLElement | null>
) {
    useEffect(() => {
        if (!isOpenState && elementRef.current) {
            elementRef.current?.focus();

            setTimeout(() => {
                elementRef.current = null;
            }, 500);
        }
    }, [isOpenState]);
}
