import AdminProductsClient from "./AdminProductsClient";
import AdminLayout from "@/ui/layouts/AdminLayout";

export default async function AdminProductsPage() {
    return (
        <AdminLayout subheaderText="Products">
            <AdminProductsClient />
        </AdminLayout>
    );
}
