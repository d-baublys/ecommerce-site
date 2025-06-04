"use client";

import GoButton from "@/ui/components/GoButton";
import BagTile from "@/ui/components/BagTile";
import { useBagStore } from "@/stores/bagStore";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { MergedBagItem, Product } from "@/lib/definitions";
import SubHeader from "@/ui/components/SubHeader";
import { getProductData } from "@/lib/actions";

export default function Page() {
    const [latestData, setLatestData] = useState<Product[]>();
    const [error, setError] = useState<Error | null>(null);

    const bag = useBagStore((state) => state.bag);
    const removeFromBag = useBagStore((state) => state.removeFromBag);
    const emptyBag = !bag.length;
    const noStock = !useBagStore((state) => state.getTotalBagCount());

    const bagProductIds = bag.map((bagItem) => bagItem.product.id);

    useEffect(() => {
        const getData = async () => {
            try {
                const dataFetch = await getProductData({ id: { in: bagProductIds } });
                setLatestData(dataFetch.data);
            } catch {
                setError(new Error("Error fetching product data. Please try again later."));
            }
        };

        getData();
    }, []);

    if (error) throw error;

    if (!latestData) return null;

    const latestDataMap = new Map(latestData.map((item) => [item.id, item.stock]));
    const mergedItems: MergedBagItem[] = bag.map((item) => {
        const latestSizeStock = latestDataMap.get(item.product.id)?.[item.size] ?? 0;

        return { ...item, latestSizeStock };
    });

    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

    const handleCheckout = async () => {
        const res = await fetch("/api/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bagItems: bag,
            }),
        });
        const data = await res.json();
        if (data.url) {
            await stripePromise;
            window.location.href = data.url;
        } else {
            setError(new Error("Error starting checkout. Please try again later."));
        }
    };

    return (
        <div className="flex flex-col justify-center items-center grow w-full">
            <SubHeader subheaderText="My Bag" />
            <div className="flex flex-col grow justify-center items-center w-full max-w-[960px] h-full my-4 gap-4">
                {!emptyBag && (
                    <ul>
                        {mergedItems.map((mergedItem) => (
                            <li key={`${mergedItem.product.id}-${mergedItem.size}`}>
                                <BagTile
                                    dataObj={mergedItem}
                                    handleDelete={() =>
                                        removeFromBag(mergedItem.product.id, mergedItem.size)
                                    }
                                    productLink={`products/${mergedItem.product.slug}`}
                                />
                            </li>
                        ))}
                    </ul>
                )}
                {!emptyBag && !noStock ? (
                    <GoButton onClick={handleCheckout} predicate={!emptyBag && !noStock}>
                        Proceed to Checkout
                    </GoButton>
                ) : (
                    emptyBag && <p>{"Your bag is empty!"}</p>
                )}
            </div>
        </div>
    );
}
