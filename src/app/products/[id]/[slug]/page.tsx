import { notFound, redirect } from "next/navigation";
import { getProduct, getReservedItems } from "@/lib/actions";
import ProductPageClient from "./ProductPageClient";
import MainLayout from "@/ui/layouts/MainLayout";
import { Metadata } from "next";
import { buildProductUrl } from "@/lib/utils";

interface AsyncParams {
    params: Promise<{ id: string; slug: string }>;
}

export async function generateMetadata({ params }: AsyncParams): Promise<Metadata> {
    const { id } = await params;
    const productFetch = await getProduct(id);

    if (!productFetch.data) {
        notFound();
    }

    const productData = productFetch.data;
    const title = productData.name;

    return { title };
}

export default async function ProductPage({ params }: AsyncParams) {
    const { id, slug } = await params;
    const productFetch = await getProduct(id);

    if (!productFetch.data) {
        notFound();
    }

    const productData = productFetch.data;

    if (productData.slug !== decodeURIComponent(slug)) {
        redirect(buildProductUrl(productData.id, productData.slug));
    }

    const reservedFetch = await getReservedItems({
        productIds: [productData.id],
    });

    return (
        <MainLayout lastCrumbText={productData.name}>
            <ProductPageClient productData={productData} reservedItems={reservedFetch.data} />
        </MainLayout>
    );
}
