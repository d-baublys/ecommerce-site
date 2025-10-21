import { Metadata } from "next";
import { getAllOrders } from "@/lib/actions";
import AdminOrdersClient from "./AdminOrdersClient";
import MainWrapperWithSubheader from "@/ui/layouts/MainWrapperWithSubheader";
import AdminWrapper from "@/ui/layouts/AdminWrapper";

export const metadata: Metadata = {
    title: "Orders | Admin",
};

export default async function AdminProductsPage() {
    const orders = await getAllOrders({ items: false });
    const ordersData = orders.data;

    return (
        <AdminWrapper>
            <MainWrapperWithSubheader subheaderText="Orders">
                <AdminOrdersClient ordersData={ordersData} />
            </MainWrapperWithSubheader>
        </AdminWrapper>
    );
}
