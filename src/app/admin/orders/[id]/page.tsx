import { getOrder } from "@/lib/actions";
import { OrderData } from "@/lib/definitions";
import ConfirmModal from "@/ui/components/overlays/ConfirmModal";
import AdminWrapper from "@/ui/layouts/AdminWrapper";
import OrdersPageTemplate from "@/ui/pages/OrdersPageTemplate";
import { Metadata } from "next";

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
    let orderData: OrderData[] = [];
    if (orderFetch.data) {
        orderData = [orderFetch.data];
    }

    return (
        <>
            <AdminWrapper>
                <OrdersPageTemplate orderData={orderData} subheaderText="Orders" />
            </AdminWrapper>
            <ConfirmModal promptText={"Are you sure you want to return this product?"} />
        </>
    );
}
