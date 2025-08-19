import { Metadata } from "next";
import { getOrders } from "@/lib/actions";
import AdminOrdersClient from "./AdminOrdersClient";
import MainWrapperWithSubheader from "@/ui/layouts/MainWrapperWithSubheader";
import AdminWrapper from "@/ui/layouts/AdminWrapper";

export const metadata: Metadata = {
    title: "Orders | Admin",
};

export default async function AdminProductsPage() {
    const orders = await getOrders();
    const ordersData = orders.data;

    return (
        <AdminWrapper>
            <MainWrapperWithSubheader subheaderText="Orders">
                <AdminOrdersClient ordersData={ordersData} />
            </MainWrapperWithSubheader>
        </AdminWrapper>
    );
}
