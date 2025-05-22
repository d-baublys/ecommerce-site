"use client";

import { useBagStore } from "@/stores/bagStore";
import { useEffect } from "react";

export function SuccessBagClearClient() {
    useEffect(() => {
        useBagStore.getState().clearBag();
    }, []);
    return null;
}
