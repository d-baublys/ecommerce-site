import { notFound } from "next/navigation";
import { fetchData } from "@/lib/utils";
import ProductContainer from "@/ui/components/ProductContainer";
import { Product } from "@/lib/definitions";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const productList: Product[] = await fetchData({ slug: slug });
    const [productData] = productList;

    if (!productData) {
        notFound();
    }

    return <ProductContainer productData={productData} />;
}
