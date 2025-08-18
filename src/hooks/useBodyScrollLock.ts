import { useEffect } from "react";

export default function useBodyScrollLock(lock: boolean) {
    useEffect(() => {
        if (lock) {
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
        } else {
            document.body.removeAttribute("style");
            document.body.removeAttribute("position");
        }

        return () => document.body.removeAttribute("style");
    }, [lock]);
}
