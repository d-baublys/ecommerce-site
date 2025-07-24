import { getFeaturedProducts } from "@/lib/actions";
import ManageFeaturedClient from "./ManageFeaturedClient";
import AdminLayout from "@/ui/layouts/AdminLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Manage featured products | Admin",
};

export default async function ManageFeaturedPage() {
    const listFetch = await getFeaturedProducts();
    const list = listFetch.data;

    return (
        <AdminLayout subheaderText="Manage Featured">
            <ManageFeaturedClient productData={list} />
        </AdminLayout>
    );
}
