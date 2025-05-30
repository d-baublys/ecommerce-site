import { Categories } from "@/lib/definitions";
import ProductGrid from "@/ui/components/ProductGrid";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    return <ProductGrid category={slug as Categories} />;
}
