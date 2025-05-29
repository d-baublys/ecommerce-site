import { getProductData } from "@/lib/actions";
import { Categories } from "@/lib/definitions";
import ProductGrid from "@/ui/components/ProductGrid";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const products = await getProductData({ gender: slug as Categories });

    return <ProductGrid productData={products} category={slug as Categories} />;
}
