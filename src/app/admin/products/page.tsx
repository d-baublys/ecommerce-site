import { getProductData } from "@/lib/actions";
import AdminProductsClient from "./AdminProductsClient";

export default async function AdminProductsPage() {
    const allProducts = await getProductData();

    return <AdminProductsClient productData={allProducts} />;
}
