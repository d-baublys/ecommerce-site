import { getProductData } from "@/lib/actions";
import AdminProductsClient from "./AdminProductsClient";
import AdminLayout from "@/ui/layouts/AdminLayout";

export default async function AdminProductsPage() {
    const productFetch = await getProductData();

    return (
        <AdminLayout subheaderText="Products">
            <AdminProductsClient productData={productFetch.data} />
        </AdminLayout>
    );
}
