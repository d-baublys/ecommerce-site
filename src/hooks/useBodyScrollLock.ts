import { useEffect } from "react";

export default function useBodyScrollLock(lock: boolean) {
    useEffect(() => {
        if (lock) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.removeAttribute("style");
        }

        return () => document.body.removeAttribute("style");
    }, [lock]);
}
