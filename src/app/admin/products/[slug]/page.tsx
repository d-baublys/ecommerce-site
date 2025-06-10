import { getProductData } from "@/lib/actions";
import DisplayTile from "@/ui/components/DisplayTile";
import ProductAddEditForm from "@/ui/components/ProductAddEditForm";
import AdminLayout from "@/ui/layouts/AdminLayout";

export default async function ProductViewEditPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const productsFetch = await getProductData({ slug });
    const [productData] = productsFetch.data;

    return (
        <AdminLayout subheaderText="Edit Product">
            <div className="flex flex-col w-full gap-8">
                <DisplayTile productData={productData} />
                <ProductAddEditForm productData={productData} />
            </div>
        </AdminLayout>
    );
}
