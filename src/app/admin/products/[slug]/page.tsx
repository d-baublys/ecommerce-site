import { getProductData } from "@/lib/actions";
import DisplayTile from "@/ui/components/cards/DisplayTile";
import ProductAddEditForm from "@/ui/components/forms/ProductAddEditForm";
import AdminLayout from "@/ui/layouts/AdminLayout";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type AsyncParams = {
    params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
    title: "Edit product | Admin",
};

export default async function ProductViewEditPage({ params }: AsyncParams) {
    const { slug } = await params;
    const productFetch = await getProductData({ slug: decodeURIComponent(slug) });

    if (!productFetch.data.length) {
        notFound();
    }

    const [productData] = productFetch.data;

    return (
        <AdminLayout subheaderText="Edit Product" lastCrumbText={productData.name}>
            <div className="flex flex-col w-full gap-8">
                <Link href={`/products/${encodeURIComponent(productData.slug)}`}>
                    <DisplayTile productData={productData} />
                </Link>
                <ProductAddEditForm productData={productData} />
            </div>
        </AdminLayout>
    );
}
