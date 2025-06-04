import { getProductData } from "@/lib/actions";
import ProductAddEditForm from "@/ui/components/ProductAddEditForm";
import BagTile from "@/ui/components/BagTile";

export default async function ProductViewEditPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const productsFetch = await getProductData();
    const allData = productsFetch.data;

    const productData = allData.find((product) => product.slug === slug);

    return (
        <div className="flex flex-col gap-8">
            <BagTile dataObj={productData!} />
            <ProductAddEditForm productData={productData} />
        </div>
    );
}
