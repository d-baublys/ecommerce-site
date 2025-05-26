import { fetchData } from "@/lib/actions";
import ProductAddEditForm from "@/ui/components/ProductAddEditForm";
import ProductTile from "@/ui/components/ProductTile";

export default async function ProductViewEditPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const allData = await fetchData();
    const productData = allData.find((product) => product.slug === slug);

    return (
        <div className="flex flex-col gap-8">
            <ProductTile dataObj={productData!} />
            <ProductAddEditForm productData={productData} />
        </div>
    );
}
