import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserOrders } from "@/lib/actions";
import { OrderData } from "@/lib/definitions";
import ConfirmModal from "@/ui/components/overlays/ConfirmModal";
import OrdersPageTemplate from "@/ui/pages/OrdersPageTemplate";

export const metadata: Metadata = {
    title: "My Orders",
};

export default async function OrdersPage() {
    const session = await auth();

    if (!(session && session.user)) {
        redirect("/login?redirect_after=orders");
    }

    if (session.user.id === undefined) throw new Error("User ID not found");

    const ordersFetch = await getUserOrders({ userId: Number(session.user.id) });
    const orderData: OrderData[] = ordersFetch.data;

    return (
        <>
            <OrdersPageTemplate orderData={orderData} subheaderText="My Orders" />
            <ConfirmModal promptText={"Are you sure you want to return this product?"} />
        </>
    );
}
