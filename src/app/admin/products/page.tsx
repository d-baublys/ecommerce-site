import { Metadata } from "next";
import AdminProductsClient from "./AdminProductsClient";
import AdminLayout from "@/ui/layouts/AdminLayout";

export const metadata: Metadata = {
    title: "Manage products | Admin",
};

export default async function AdminProductsPage() {
    return (
        <AdminLayout subheaderText="Products">
            <AdminProductsClient />
        </AdminLayout>
    );
}
