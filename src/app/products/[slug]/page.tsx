import { notFound } from "next/navigation";
import { getProductData } from "@/lib/actions";
import ProductPageClient from "./ProductPageClient";
import { Product } from "@/lib/definitions";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const productList: Product[] = await getProductData({ slug: slug });
    const [productData] = productList;

    if (!productData) {
        notFound();
    }

    return <ProductPageClient productData={productData} />;
}
