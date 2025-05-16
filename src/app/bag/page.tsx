"use client";

import GoButton from "@/ui/components/GoButton";
import ProductTile from "@/ui/components/ProductTile";
import { useBagStore } from "@/stores/bagStore";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { Product } from "@/lib/definitions";

export default function Page() {
    const [latestData, setLatestData] = useState<Product[]>();
    const bag = useBagStore((state) => state.bag);
    const removeFromBag = useBagStore((state) => state.removeFromBag);

    const emptyBag = bag.length === 0;

    const bagProductIds = bag.map((bagItem) => bagItem.product.id);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    where: { id: { in: bagProductIds } },
                    select: { id: true, stock: true },
                }),
            });

            const data = await res.json();
            setLatestData(data);
        };

        fetchData();
    }, []);

    if (!latestData) return;

    const latestDataMap = new Map(latestData.map((item) => [item.id, item.stock]));
    const mergedItems = bag.map((item) => {
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
            alert("Error starting checkout");
        }
    };

    return (
        <div className="flex flex-col justify-center items-center grow w-full">
            <div className="flex justify-center items-center w-full p-2 bg-background-lighter text-contrasted font-semibold md:text-xl">
                My Bag
            </div>
            <div className="flex flex-col grow justify-center items-center w-full max-w-[960px] h-full my-4 gap-4">
                {mergedItems.map((mergedItem, idx) => (
                    <ProductTile
                        key={idx}
                        dataObj={mergedItem}
                        handleDelete={() => removeFromBag(mergedItem.product!.id, mergedItem.size)}
                    />
                ))}
                {!emptyBag ? (
                    <GoButton onClick={handleCheckout}>Proceed to Checkout</GoButton>
                ) : (
                    "Your bag is empty!"
                )}
            </div>
        </div>
    );
}
