import { Categories, VALID_CATEGORIES } from "@/lib/definitions";
import CategoryGridPage from "@/ui/components/CategoryGridPage";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    if (!(slug in VALID_CATEGORIES || slug === "all")) {
        notFound();
    }

    return <CategoryGridPage category={slug as Categories} />;
}
