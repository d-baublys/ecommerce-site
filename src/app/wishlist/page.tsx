"use client";

import { useWishlistStore } from "@/stores/wishlistStore";
import BaseGridPage from "@/ui/pages/BaseGridPage";
import MainLayout from "@/ui/layouts/MainLayout";

export default function Page() {
    const wishlist = useWishlistStore((state) => state.wishlist);

    return (
        <MainLayout subheaderText="My Wishlist">
            <BaseGridPage displayedProducts={wishlist} noProductMessage="Your wishlist is empty!" />
        </MainLayout>
    );
}
