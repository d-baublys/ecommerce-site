import { getOrder } from "@/lib/actions";
import { Order } from "@/lib/definitions";
import { convertPrismaOrders } from "@/lib/utils";
import ConfirmModal from "@/ui/components/overlays/ConfirmModal";
import AdminWrapper from "@/ui/layouts/AdminWrapper";
import OrdersPageTemplate from "@/ui/pages/OrdersPageTemplate";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type AsyncParams = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: AsyncParams): Promise<Metadata> {
    const { id: orderId } = await params;

    return { title: `Order #${orderId}` };
}

export default async function IndividualOrderPage({ params }: AsyncParams) {
    const { id: orderId } = await params;

    const orderFetch = await getOrder({ orderId: Number(orderId) });

    if (!orderFetch.data) {
        notFound();
    }

    const orderData: Order[] = convertPrismaOrders([orderFetch.data]);

    return (
        <>
            <AdminWrapper>
                <OrdersPageTemplate orderData={orderData} subheaderText="Orders" />
            </AdminWrapper>
            <ConfirmModal promptText={"Are you sure you want to return this order?"} />
        </>
    );
}
