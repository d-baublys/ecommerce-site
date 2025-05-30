import { getProductData } from "@/lib/actions";
import AdminProductsClient from "./AdminProductsClient";

export default async function AdminProductsPage() {
    const productFetch = await getProductData();
    if (!productFetch.data) throw new Error("No products to display");

    return <AdminProductsClient productData={productFetch.data} />;
}
