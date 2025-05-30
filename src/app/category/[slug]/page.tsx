import { getProductData } from "@/lib/actions";
import { Categories } from "@/lib/definitions";
import ProductGrid from "@/ui/components/ProductGrid";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const productsFetch = await getProductData({ gender: slug as Categories });

    if (!productsFetch.data) throw new Error("No products to display");

    return <ProductGrid productData={productsFetch.data} category={slug as Categories} />;
}
