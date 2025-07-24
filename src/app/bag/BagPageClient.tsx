"use client";

import GoButton from "@/ui/components/buttons/GoButton";
import BagTile from "@/ui/components/cards/BagTile";
import { useBagStore } from "@/stores/bagStore";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { MergedBagItem, Product } from "@/lib/definitions";
import { getProductData } from "@/lib/actions";
import { stringifyConvertPrice } from "@/lib/utils";
import MainLayout from "@/ui/layouts/MainLayout";

export default function BagPageClient() {
    const [latestData, setLatestData] = useState<Product[]>();
    const [error, setError] = useState<Error | null>(null);

    const { bag, removeFromBag, hasHydrated } = useBagStore((state) => state);
    const emptyBag = !bag.length;
    const noStock = !useBagStore((state) => state.getTotalBagCount());
    const bagProductIds = bag.map((bagItem) => bagItem.product.id);

    const orderSubtotal = bag.reduce(
        (subTotal, bagItem) => subTotal + bagItem.product.price * bagItem.quantity,
        0
    );
    const shippingCost = !emptyBag && orderSubtotal ? 500 : 0;
    const orderTotal = orderSubtotal + shippingCost;

    useEffect(() => {
        if (!hasHydrated) return;

        const getData = async () => {
            try {
                const dataFetch = await getProductData({ id: { in: bagProductIds } });
                setLatestData(dataFetch.data);
            } catch {
                setError(new Error("Error fetching product data. Please try again later."));
            }
        };

        getData();
    }, [hasHydrated]);

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
                shippingCost,
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
        <MainLayout subheaderText="My Bag">
            <div className="flex flex-col md:flex-row w-full h-full">
                {!emptyBag ? (
                    <ul
                        id="bag-tile-container"
                        data-testid="bag-tile-ul"
                        className="flex flex-col w-full lg:gap-8"
                    >
                        {mergedItems.map((mergedItem) => (
                            <li
                                key={`${mergedItem.product.id}-${mergedItem.size}`}
                                className="w-full mb-8 lg:mb-0"
                            >
                                <BagTile
                                    bagItem={mergedItem}
                                    handleDelete={() =>
                                        removeFromBag(mergedItem.product.id, mergedItem.size)
                                    }
                                    productSlug={mergedItem.product.slug}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex justify-center items-center w-full h-full p-8 md:p-0">
                        <p>{"Your bag is empty!"}</p>
                    </div>
                )}
                <div className="flex flex-col px-8 py-6 w-full h-min md:w-2/5 md:ml-8 justify-evenly bg-background-lightest rounded-sm">
                    <p className="pb-6 font-semibold text-sz-subheading lg:text-sz-subheading-lg whitespace-nowrap">
                        Order Summary
                    </p>
                    <div>
                        <div className="flex justify-between py-3">
                            <p>Subtotal</p>
                            <p aria-label="Bag subtotal">£{stringifyConvertPrice(orderSubtotal)}</p>
                        </div>
                        <div className="flex justify-between py-3 border-b-2">
                            <p>Shipping</p>
                            <p aria-label="Shipping cost">
                                {shippingCost ? (
                                    <>
                                        <span>£</span>
                                        <span>{stringifyConvertPrice(shippingCost)}</span>
                                    </>
                                ) : (
                                    "-"
                                )}
                            </p>
                        </div>
                        <div className="flex justify-between py-3 font-semibold">
                            <p>Total</p>
                            <p aria-label="Bag total">£{stringifyConvertPrice(orderTotal)}</p>
                        </div>
                    </div>
                    {!(emptyBag || noStock) && (
                        <div className="flex pt-4 w-full justify-center">
                            <GoButton
                                onClick={handleCheckout}
                                predicate={!(emptyBag || noStock)}
                                disabled={emptyBag || noStock}
                            >
                                Checkout
                            </GoButton>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
