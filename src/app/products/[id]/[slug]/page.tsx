import { notFound, redirect } from "next/navigation";
import { getProducts } from "@/lib/actions";
import ProductPageClient from "./ProductPageClient";
import MainLayout from "@/ui/layouts/MainLayout";
import { Metadata } from "next";
import { buildProductUrl } from "@/lib/utils";

type AsyncParams = {
    params: Promise<{ id: string; slug: string }>;
};

export async function generateMetadata({ params }: AsyncParams): Promise<Metadata> {
    const { id } = await params;
    const productFetch = await getProducts({ id });

    const [productData] = productFetch.data;
    const title = productData.name;

    return { title };
}

export default async function ProductPage({ params }: AsyncParams) {
    const { id, slug } = await params;
    const productFetch = await getProducts({ id });

    if (!productFetch.data.length) {
        notFound();
    }

    const [productData] = productFetch.data;

    if (productData.slug !== decodeURIComponent(slug)) {
        redirect(buildProductUrl(productData.id, productData.slug));
    }

    return (
        <MainLayout lastCrumbText={productData.name}>
            <ProductPageClient productData={productData} />
        </MainLayout>
    );
}
