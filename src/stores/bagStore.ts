import { BagItem } from "@/lib/definitions";
import { create } from "zustand";

type BagStore = {
    bag: BagItem[];
    addToBag: (item: BagItem) => void;
    removeFromBag: (id: string) => void;
    clearBag: () => void;
    updateQuantity: (id: string, quantity: number) => void;
};

export const useBagStore = create<BagStore>((set) => {
    return {
        bag: [],
        addToBag: (newItem) => {
            return set((state) => {
                const { product, size, quantity } = newItem;
                const currStock = product.stock[size];

                if (!currStock) return state;

                const existing = state.bag.find(
                    (bagItem) => bagItem.product.id === product.id && bagItem.size === size
                );

                if (existing) {
                    if (
                        existing.quantity >=
                        Number(process.env.NEXT_PUBLIC_SINGLE_ITEM_MAX_QUANTITY)
                    )
                        return state;

                    product.stock[size]! -= quantity;

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
                product.stock[size]! -= quantity;

                return { bag: [...state.bag, newItem] };
            });
        },
        removeFromBag: (id) => {
            return set((state) => {
                return {
                    bag: state.bag.filter((item) => {
                        return item.product.id !== id;
                    }),
                };
            });
        },
        clearBag: () => set({ bag: [] }),
        updateQuantity: (id, quantity) => {
            return set((state) => {
                return {
                    bag: state.bag.map((item) => {
                        return item.product.id === id ? { ...item, quantity } : item;
                    }),
                };
            });
        },
    };
});
