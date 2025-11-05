import { ClientProduct } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistStore = {
    wishlist: ClientProduct["id"][];
    addToWishlist: (id: ClientProduct["id"]) => void;
    removeFromWishlist: (id: ClientProduct["id"]) => void;
    clearWishlist: () => void;
    hasHydrated: boolean;
};

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            wishlist: [],
            addToWishlist: (id) => {
                const currentWishlist = get().wishlist;
                const updatedWishlist = [...currentWishlist, id];

                set({ wishlist: updatedWishlist });
            },
            removeFromWishlist: (id) => {
                const currentWishlist = get().wishlist;
                const updatedWishlist = currentWishlist.filter((wishlistId) => wishlistId !== id);

                setTimeout(() => {
                    set({ wishlist: updatedWishlist });
                }, 300);
            },
            clearWishlist: () => {
                set({ wishlist: [] });
            },
            hasHydrated: false,
        }),
        {
            name: STORAGE_KEYS.WISHLIST,
            onRehydrateStorage: () => (state) => {
                state!.hasHydrated = true;
            },
        }
    )
);
