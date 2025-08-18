import { getOrder } from "@/lib/actions";
import stripe from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { orderId } = await req.json();
        const order = await getOrder({ orderId });

        if (!order.data) {
            return NextResponse.json({ error: "Order data not found" }, { status: 400 });
        }
        const paymentIntentId = order.data?.paymentIntentId;

        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
        });

        return NextResponse.json({ success: true, refund });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
