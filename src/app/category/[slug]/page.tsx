import { Categories, VALID_CATEGORIES } from "@/lib/definitions";
import CategoryGridPage from "./CategoryGridPage";
import MainLayout from "@/ui/layouts/MainLayout";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    if (!(slug in VALID_CATEGORIES || slug === "all")) {
        notFound();
    }

    const subheaderText = slug === "all" ? "All Products" : VALID_CATEGORIES[slug as Categories];

    return (
        <MainLayout subheaderText={subheaderText}>
            <CategoryGridPage category={slug as Categories} />
        </MainLayout>
    );
}
