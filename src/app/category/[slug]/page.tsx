import { Categories, VALID_CATEGORIES } from "@/lib/definitions";
import ProductGrid from "@/ui/components/ProductGrid";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    if (!(slug in VALID_CATEGORIES || slug === "all")) {
        notFound();
    }

    return <ProductGrid category={slug as Categories} />;
}
