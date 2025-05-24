import { fetchData } from "@/lib/utils";
import ProductTile from "@/ui/components/ProductTile";
import ProductInventoryClient from "./ProductInventoryClient";

export default async function ProductStockPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const allData = await fetchData();
    const productData = allData.find((product) => product.slug === slug);

    return (
        <div className="flex flex-col gap-8">
            <ProductTile dataObj={productData!} />
            <ProductInventoryClient productData={productData!} />
        </div>
    );
}
