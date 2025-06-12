import { notFound } from "next/navigation";
import { getProductData } from "@/lib/actions";
import ProductPageClient from "./ProductPageClient";
import MainLayout from "@/ui/layouts/MainLayout";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const productFetch = await getProductData({ slug: slug });

    if (!productFetch.data.length) {
        notFound();
    }

    const [productData] = productFetch.data;

    return (
        <MainLayout lastCrumbText={productData.name}>
            <ProductPageClient productData={productData} />
        </MainLayout>
    );
}
