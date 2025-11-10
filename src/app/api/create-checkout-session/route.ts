import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { BagItem, CheckoutSessionCreateInput } from "@/lib/types";
import { createCheckoutSession } from "@/lib/actions";
import { bagItemListSchema, userSchema } from "@/lib/schemas";
import { extractZodMessage } from "@/lib/utils";

export async function POST(req: Request) {
    const { bagItems, shippingCost, userId } = await req.json();

    const parsedBagItems = bagItemListSchema.safeParse(bagItems);
    const parsedUserId = userSchema.shape.id.safeParse(userId);

    if (!parsedBagItems.success) {
        console.error("Error parsing bag item data");
        return NextResponse.json(
            { error: "Error parsing bag item data" + extractZodMessage(parsedBagItems) },
            { status: 400 }
        );
    }

    if (!parsedUserId.success) {
        console.error("Error parsing user ID");
        return NextResponse.json(
            { error: "Error parsing user ID: " + extractZodMessage(parsedUserId) },
            { status: 400 }
        );
    }

    const lineItems = [
        ...parsedBagItems.data.map((bagItem: BagItem) => ({
            price_data: {
                currency: "gbp",
                product_data: {
                    name: bagItem.productName,
                },
                unit_amount: bagItem.price,
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

    const sessionLength = Number(process.env.NEXT_PUBLIC_CHECKOUT_SESSION_MAX_MINS);

    if (!sessionLength) {
        return NextResponse.json(
            { error: "Checkout session length env variable not set" },
            { status: 400 }
        );
    }

    const expiresAt = Date.now() + (sessionLength + 1) * (60 * 1000); // in ms, + 1 min buffer

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            metadata: {
                items: JSON.stringify(
                    bagItems.map((bagItem: BagItem) => ({
                        productId: bagItem.productId,
                        name: bagItem.productName,
                        price: bagItem.price,
                        size: bagItem.size,
                        quantity: bagItem.quantity,
                    }))
                ),
                shippingCost,
                userId,
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/bag`,
            expires_at: Math.floor(expiresAt / 1000) - 1, // in s, max session length less buffer
        });

        const sessionData: CheckoutSessionCreateInput = {
            id: session.id,
            userId,
            expiresAt: new Date(expiresAt),
            items: bagItems.map((bagItem: BagItem) => ({
                productId: bagItem.productId,
                size: bagItem.size,
                quantity: bagItem.quantity,
            })),
        };

        const checkoutCreate = await createCheckoutSession(sessionData);

        if (!checkoutCreate.success) {
            return NextResponse.json(
                { error: "Error creating checkout session data" },
                { status: 500 }
            );
        }

        return NextResponse.json({ url: session.url });
    } catch {
        return NextResponse.json({ error: "Stripe session creation failed" }, { status: 500 });
    }
}
