"use client";

import { useWishlistStore } from "@/stores/wishlistStore";
import BaseGridPage from "@/ui/pages/BaseGridPage";
import MainLayout from "@/ui/layouts/MainLayout";
import { useEffect, useState } from "react";
import { ClientProduct } from "@/lib/types";
import { getManyProducts } from "@/lib/actions";

export default function WishlistPageClient() {
    const { wishlist, hasHydrated } = useWishlistStore((state) => state);
    const [products, setProducts] = useState<ClientProduct[]>();

    useEffect(() => {
        if (!hasHydrated) return;

        const getData = async () => {
            const productFetch = await getManyProducts({ where: { id: { in: wishlist } } });

            setProducts(productFetch.data);
        };

        getData();
    }, [wishlist, hasHydrated]);

    if (!products) return null;

    return (
        <MainLayout subheaderText="My Wishlist">
            <BaseGridPage
                displayedProducts={products}
                noProductMessage="Your wishlist is empty!"
                linkWhenEmptyList={true}
            />
        </MainLayout>
    );
}
