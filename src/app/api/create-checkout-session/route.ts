import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { BagItem } from "@/lib/definitions";

export async function POST(req: Request) {
    const { bagItems, shippingCost } = await req.json();

    const lineItems = [
        ...bagItems.map((bagItem: BagItem) => ({
            price_data: {
                currency: "gbp",
                product_data: {
                    name: bagItem.product.name,
                },
                unit_amount: bagItem.product.price,
            },
            quantity: bagItem.quantity,
        })),
        ...[
            {
                price_data: {
                    currency: "gbp",
                    product_data: {
                        name: "Shipping",
                    },
                    unit_amount: shippingCost,
                },
                quantity: 1,
            },
        ],
    ];

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            metadata: {
                items: JSON.stringify(
                    bagItems.map((bagItem: BagItem) => ({
                        productId: bagItem.product.id,
                        name: bagItem.product.name,
                        price: bagItem.product.price,
                        size: bagItem.size,
                        quantity: bagItem.quantity,
                    }))
                ),
                shippingCost,
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/bag`,
        });

        return NextResponse.json({ url: session.url });
    } catch {
        return NextResponse.json({ error: "Stripe session creation failed" }, { status: 500 });
    }
}
