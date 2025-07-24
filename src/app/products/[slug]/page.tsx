import { notFound } from "next/navigation";
import { getProductData } from "@/lib/actions";
import ProductPageClient from "./ProductPageClient";
import MainLayout from "@/ui/layouts/MainLayout";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const { slug } = await params;
    const productFetch = await getProductData({ slug: decodeURIComponent(slug) });

    const [productData] = productFetch.data;
    const title = productData.name;

    return { title };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const productFetch = await getProductData({ slug: decodeURIComponent(slug) });

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
