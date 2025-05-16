import { BagItem, Sizes } from "@/lib/definitions";
import { create } from "zustand";

type BagStore = {
    bag: BagItem[];
    addToBag: (item: BagItem) => void;
    removeFromBag: (id: string, size: Sizes) => void;
    clearBag: () => void;
    updateQuantity: (id: string, size: Sizes, quantity: number) => void;
};

export const useBagStore = create<BagStore>((set) => {
    return {
        bag: [],
        addToBag: (newItem) => {
            return set((state) => {
                const { product, size, quantity } = newItem;

                const existing = state.bag.find(
                    (bagItem) => bagItem.product.id === product.id && bagItem.size === size
                );

                if (existing) {
                    if (
                        existing.quantity >=
                            Number(process.env.NEXT_PUBLIC_SINGLE_ITEM_MAX_QUANTITY) ||
                        existing.quantity >= product.stock[size]!
                    )
                        return state;

                    return {
                        bag: state.bag.map((existingItem) => {
                            return existingItem.product.id === product.id &&
                                existingItem.size === size
                                ? {
                                      ...existing,
                                      quantity: existingItem.quantity + quantity,
                                  }
                                : existingItem;
                        }),
                    };
                }

                return { bag: [...state.bag, newItem] };
            });
        },
        removeFromBag: (id, size) => {
            return set((state) => {
                return {
                    bag: state.bag.filter(
                        (item) => !(item.product.id === id && item.size === size)
                    ),
                };
            });
        },
        clearBag: () => set({ bag: [] }),
        updateQuantity: (id, size, quantity) => {
            return set((state) => {
                return {
                    bag: state.bag.map((item) =>
                        item.product.id === id && item.size === size ? { ...item, quantity } : item
                    ),
                };
            });
        },
    };
});
