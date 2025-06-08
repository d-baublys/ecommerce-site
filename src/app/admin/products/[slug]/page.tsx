import { getProductData } from "@/lib/actions";
import DisplayTile from "@/ui/components/DisplayTile";
import ProductAddEditForm from "@/ui/components/ProductAddEditForm";

export default async function ProductViewEditPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const productsFetch = await getProductData({ slug });
    const [productData] = productsFetch.data;

    return (
        <div className="flex flex-col gap-8">
            <DisplayTile productData={productData} />
            <ProductAddEditForm productData={productData} />
        </div>
    );
}
