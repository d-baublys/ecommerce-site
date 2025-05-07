"use client";

import GeneralButton from "@/components/GeneralButton";
import GoButton from "@/components/GoButton";
import { productList } from "@/lib/data";
import { BagItem } from "@/lib/types";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const placeholder: BagItem[] = [
    { product: productList[2], size: "l", quantity: 1 },
    { product: productList[3], size: "xl", quantity: 1 },
];

export default function Page() {
    const handleCheckout = async () => {
        const res = await fetch("/api/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bagItems: placeholder,
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
                Checkout
            </div>
            <div className="flex flex-col grow justify-center items-center w-full max-w-[960px] h-full my-4 gap-4">
                <div className="flex gap-4">
                    <Link href={"/bag"}>
                        <GeneralButton className="cursor-pointer">Back to Bag</GeneralButton>
                    </Link>
                    <GoButton onClick={handleCheckout} className="cursor-pointer">
                        Buy Now
                    </GoButton>
                </div>
            </div>
        </div>
    );
}
