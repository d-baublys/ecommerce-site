import { Metadata } from "next";
import AdminLayout from "@/ui/layouts/AdminLayout";
import { getOrders } from "@/lib/actions";
import AdminOrdersClient from "./AdminOrdersClient";

export const metadata: Metadata = {
    title: "Orders | Admin",
};

export default async function AdminProductsPage() {
    const orders = await getOrders();
    const ordersData = orders.data;

    return (
        <AdminLayout subheaderText="Orders">
            {ordersData.length ? (
                <AdminOrdersClient ordersData={ordersData} />
            ) : (
                <p>No orders to show</p>
            )}
        </AdminLayout>
    );
}
