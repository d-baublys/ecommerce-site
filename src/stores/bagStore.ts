import { BagItem, Sizes } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type BagStore = {
    bag: BagItem[];
    addToBag: (item: BagItem) => boolean;
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
            addToBag: (newItem) => {
                const currentBag = get().bag;
                let permitted = true;
                let updatedBag = currentBag;
                const { product, size, quantity } = newItem;

                const existing = currentBag.find(
                    (bagItem) => bagItem.product.id === product.id && bagItem.size === size
                );

                if (existing) {
                    if (
                        !(
                            existing.quantity >=
                                Number(process.env.NEXT_PUBLIC_SINGLE_ITEM_MAX_QUANTITY) ||
                            existing.quantity >= product.stock[size]!
                        )
                    ) {
                        updatedBag = currentBag.map((existingItem) =>
                            existingItem.product.id === product.id && existingItem.size === size
                                ? {
                                      ...existing,
                                      quantity: existingItem.quantity + quantity,
                                  }
                                : existingItem
                        );
                    } else {
                        permitted = false;
                    }
                } else {
                    updatedBag = [...currentBag, newItem];
                }

                set({ bag: updatedBag });
                return permitted;
            },
            removeFromBag: (id, size) => {
                const currentBag = get().bag;
                let updatedBag = currentBag;
                updatedBag = currentBag.filter(
                    (item) => !(item.product.id === id && item.size === size)
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
                    item.product.id === id && item.size === size ? { ...item, quantity } : item
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
