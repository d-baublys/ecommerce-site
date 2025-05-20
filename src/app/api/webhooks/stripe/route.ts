import stripe from "@/lib/stripe";
import { updateData } from "@/lib/utils";
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

        for (const item of items) {
            await updateData(item.productId, item.size, item.quantity);
        }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
}
