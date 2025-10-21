import { getProducts } from "@/lib/actions";
import ProductAddEditForm from "@/ui/components/forms/ProductAddEditForm";
import AdminLayout from "@/ui/layouts/AdminLayout";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type AsyncParams = {
    params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
    title: "Edit product | Admin",
};

export default async function ProductViewEditPage({ params }: AsyncParams) {
    const { id } = await params;
    const productFetch = await getProducts({ id });

    if (!productFetch.data.length) {
        notFound();
    }

    const [productData] = productFetch.data;

    return (
        <AdminLayout subheaderText="Edit Product" lastCrumbText={productData.name}>
            <div className="flex flex-col w-full gap-8">
                <ProductAddEditForm productData={productData} />
            </div>
        </AdminLayout>
    );
}
