"use client";

import { useWishlistStore } from "@/stores/wishlistStore";
import BaseGridPage from "@/ui/components/BaseGridPage";

export default function Page() {
    const wishlist = useWishlistStore((state) => state.wishlist);

    return <BaseGridPage displayedProducts={wishlist} noProductMessage="Your wishlist is empty!" />;
}
