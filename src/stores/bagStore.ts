import { BagItem } from "@/lib/types";
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
                const existing = state.bag.find(
                    (currItem) =>
                        currItem.product.id === newItem.product.id && currItem.size === newItem.size
                );

                if (existing) {
                    return {
                        bag: state.bag.map((existingItem) => {
                            return existingItem.product.id === newItem.product.id
                                ? {
                                      ...existingItem,
                                      quantity: existingItem.quantity + newItem.quantity,
                                  }
                                : existingItem;
                        }),
                    };
                }
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
