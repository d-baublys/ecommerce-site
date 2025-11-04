import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { BagItem, ReservedItemCreateInput } from "@/lib/types";
import { createReservedItems } from "@/lib/actions";
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

    const expiresAt = Date.now() + 31 * (60 * 1000); // 30 mins + 1 min buffer

    const reservedItems: ReservedItemCreateInput = parsedBagItems.data.map((item) => ({
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
        expiresAt: new Date(expiresAt),
    }));

    const result = await createReservedItems(reservedItems);

    if (!result.success) {
        return NextResponse.json({ error: "Error creating reserved items" }, { status: 500 });
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
                reservedItemIds: JSON.stringify(result.data),
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/bag`,
            expires_at: Math.floor(expiresAt / 1000) - 1, // 30 mins
        });

        return NextResponse.json({ url: session.url });
    } catch {
        return NextResponse.json({ error: "Stripe session creation failed" }, { status: 500 });
    }
}
