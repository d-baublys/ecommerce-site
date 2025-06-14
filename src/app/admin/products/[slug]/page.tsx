import { getProductData } from "@/lib/actions";
import DisplayTile from "@/ui/components/DisplayTile";
import ProductAddEditForm from "@/ui/components/ProductAddEditForm";
import AdminLayout from "@/ui/layouts/AdminLayout";
import { notFound } from "next/navigation";

export default async function ProductViewEditPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const productFetch = await getProductData({ slug: decodeURIComponent(slug) });

    if (!productFetch.data.length) {
        notFound();
    }

    const [productData] = productFetch.data;

    return (
        <AdminLayout subheaderText="Edit Product" lastCrumbText={productData.name}>
            <div className="flex flex-col w-full gap-8">
                <DisplayTile productData={productData} />
                <ProductAddEditForm productData={productData} />
            </div>
        </AdminLayout>
    );
}
