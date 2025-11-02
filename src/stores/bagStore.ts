import { BagItem, ClientProduct, Sizes } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { findBagItem, isBagAddPermitted } from "@/lib/utils";

type BagStore = {
    bag: BagItem[];
    addToBag: (product: ClientProduct, item: BagItem) => void;
    removeFromBag: (id: string, size: Sizes) => void;
    clearBag: () => void;
    updateQuantity: (id: string, size: Sizes, quantity: number) => void;
    getTotalBagCount: () => number;
    hasHydrated: boolean;
};

export const useBagStore = create<BagStore>()(
    persist(
        (set, get) => ({
            bag: [],
            addToBag: (product, newItem) => {
                const currentBag = get().bag;
                let updatedBag = currentBag;
                const { size, quantity: addedQuantity } = newItem;

                const existing = findBagItem(product.id, size, currentBag);

                if (existing) {
                    if (isBagAddPermitted(existing.quantity, product.stock[size]!)) {
                        updatedBag = currentBag.map((bagItem) =>
                            bagItem.productId === product.id && bagItem.size === size
                                ? {
                                      ...bagItem,
                                      quantity: bagItem.quantity + addedQuantity,
                                  }
                                : bagItem
                        );
                    }
                } else {
                    updatedBag = [...currentBag, newItem];
                }

                set({ bag: updatedBag });
            },
            removeFromBag: (id, size) => {
                const currentBag = get().bag;
                let updatedBag = currentBag;
                updatedBag = currentBag.filter(
                    (item) => !(item.productId === id && item.size === size)
                );

                setTimeout(() => {
                    set({ bag: updatedBag });
                }, 300);
            },
            clearBag: () => {
                set({ bag: [] });
            },
            updateQuantity: (id, size, quantity) => {
                const currentBag = get().bag;
                let updatedBag = currentBag;
                updatedBag = currentBag.map((item) =>
                    item.productId === id && item.size === size ? { ...item, quantity } : item
                );

                set({ bag: updatedBag });
            },
            getTotalBagCount: () => {
                return get().bag.reduce((total, item) => total + item.quantity, 0);
            },
            hasHydrated: false,
        }),
        {
            name: STORAGE_KEYS.BAG,
            onRehydrateStorage: () => (state) => {
                state!.hasHydrated = true;
            },
        }
    )
);
