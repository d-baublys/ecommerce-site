"use client";

import { useWishlistStore } from "@/stores/wishlistStore";
import BaseGridPage from "@/ui/pages/BaseGridPage";
import MainLayout from "@/ui/layouts/MainLayout";
import { useEffect, useState } from "react";
import { ClientProduct, ReservedItem } from "@/lib/types";
import { getProducts, getReservedItems } from "@/lib/actions";

export default function WishlistPageClient() {
    const { wishlist, hasHydrated } = useWishlistStore((state) => state);
    const [products, setProducts] = useState<ClientProduct[]>();
    const [groupedReservedItems, setGroupedReservedItems] = useState<ReservedItem[]>();

    useEffect(() => {
        if (!hasHydrated) return;

        const getData = async () => {
            const productFetch = await getProducts({ id: { in: wishlist } });

            setProducts(productFetch.data);

            const reservedFetch = await getReservedItems({
                productIds: wishlist,
            });

            setGroupedReservedItems(reservedFetch.data);
        };

        getData();
    }, [wishlist, hasHydrated]);

    if (!products || !groupedReservedItems) return null;

    return (
        <MainLayout subheaderText="My Wishlist">
            <BaseGridPage
                displayedProducts={products}
                groupedReservedItems={groupedReservedItems}
                noProductMessage="Your wishlist is empty!"
                linkWhenEmptyList={true}
            />
        </MainLayout>
    );
}
