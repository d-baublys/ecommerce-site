import stripe from "@/lib/stripe";
import { createOrder, updateStockOnPurchase } from "@/lib/actions";
import { ItemMetadata } from "@/lib/definitions";
import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${(err as Error).message}`);

        return new Response(`Webhook signature verification failed: ${(err as Error).message}`, {
            status: 400,
        });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        if (!session.metadata?.items) {
            return new Response("Missing items metadata", { status: 400 });
        }

        let items: ItemMetadata[];

        try {
            items = JSON.parse(session.metadata.items);
        } catch {
            return new Response("Error parsing metadata JSON", { status: 400 });
        }

        const subTotal = items.reduce(
            (total, currentItem) => total + currentItem.price * currentItem.quantity,
            0
        );
        const shippingTotal = Number(session.metadata.shippingCost);
        const orderTotal = subTotal + shippingTotal;

        let userId; // to-do?
        const email = session.customer_details?.email;

        if (!email) return new Response("Customer email address not found", { status: 400 });

        const newOrder = await createOrder({
            items,
            subTotal,
            shippingTotal,
            total: orderTotal,
            sessionId: session.id,
            email,
            userId,
        });

        if (!newOrder.success) {
            return new Response("Error creating new order", { status: 400 });
        }

        for (const item of items) {
            const result = await updateStockOnPurchase(item.productId, item.size, item.quantity);
            if (!result.success) {
                return new Response("Error updating stock", { status: 400 });
            }
        }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
}
