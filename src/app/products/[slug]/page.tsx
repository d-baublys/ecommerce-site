import { notFound } from "next/navigation";
import { getProductData } from "@/lib/actions";
import ProductPageClient from "./ProductPageClient";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const productFetch = await getProductData({ slug: slug });

    if (!productFetch.data) {
        notFound();
    }

    const [productData] = productFetch.data;

    return <ProductPageClient productData={productData} />;
}
