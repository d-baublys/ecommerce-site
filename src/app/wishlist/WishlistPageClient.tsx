"use client";

import { useWishlistStore } from "@/stores/wishlistStore";
import BaseGridPage from "@/ui/pages/BaseGridPage";
import MainLayout from "@/ui/layouts/MainLayout";
import { useEffect, useState } from "react";
import { ReservedItem } from "@/lib/types";
import { getReservedItems } from "@/lib/actions";

export default function WishlistPageClient() {
    const wishlist = useWishlistStore((state) => state.wishlist);
    const [groupedReservedItems, setGroupedReservedItems] = useState<ReservedItem[]>([]);

    useEffect(() => {
        const getData = async () => {
            const result = await getReservedItems({
                productIds: wishlist.map((item) => item.id),
            });

            setGroupedReservedItems(result.data);
        };

        getData();
    }, []);

    return (
        <MainLayout subheaderText="My Wishlist">
            <BaseGridPage
                displayedProducts={wishlist}
                groupedReservedItems={groupedReservedItems}
                noProductMessage="Your wishlist is empty!"
                linkWhenEmptyList={true}
            />
        </MainLayout>
    );
}
