import { getProductData } from "@/lib/actions";
import AdminProductsClient from "./AdminProductsClient";

export default async function AdminProductsPage() {
    const productFetch = await getProductData();

    return <AdminProductsClient productData={productFetch.data} />;
}
