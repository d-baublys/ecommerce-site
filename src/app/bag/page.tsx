"use client";

import GoButton from "@/ui/components/GoButton";
import ProductTile from "@/ui/components/ProductTile";
import { useBagStore } from "@/stores/bagStore";
import { loadStripe } from "@stripe/stripe-js";

export default function Page() {
    const bag = useBagStore((state) => state.bag);
    const removeFromBag = useBagStore((state) => state.removeFromBag);

    const emptyBag = bag.length === 0;

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
                {bag.map((bagItem, idx) => (
                    <ProductTile
                        key={idx}
                        dataObj={bagItem}
                        handleDelete={() => removeFromBag(bagItem.product.id)}
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
