import { Product } from "@/lib/definitions";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistStore = {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (id: string) => void;
    clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            wishlist: [],
            addToWishlist: (newItem) => {
                const currentWishlist = get().wishlist;
                let updatedWishlist = currentWishlist;

                updatedWishlist = [...currentWishlist, newItem];

                set({ wishlist: updatedWishlist });
            },
            removeFromWishlist: (id) => {
                const currentWishlist = get().wishlist;
                let updatedWishlist = currentWishlist;

                updatedWishlist = currentWishlist.filter((product) => !(product.id === id));

                set({ wishlist: updatedWishlist });
            },
            clearWishlist: () => {
                set({ wishlist: [] });
            },
        }),
        { name: STORAGE_KEYS.WISHLIST }
    )
);
