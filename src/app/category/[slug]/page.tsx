import { Categories, VALID_CATEGORIES } from "@/lib/definitions";
import CategoryGridPage from "@/ui/pages/CategoryGridPage";
import MainLayout from "@/ui/layouts/MainLayout";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type AsyncParams = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: AsyncParams): Promise<Metadata> {
    const { slug } = await params;

    const title =
        slug === "all" ? "All Products" : VALID_CATEGORIES.find((c) => c.key === slug)!.label;

    return { title };
}

export default async function CategoryPage({ params }: AsyncParams) {
    const { slug } = await params;

    if (
        !(
            VALID_CATEGORIES.some((c) => Object.values(c).includes(slug as Categories)) ||
            slug === "all"
        )
    ) {
        notFound();
    }

    const subheaderText =
        slug === "all" ? "All Products" : VALID_CATEGORIES.find((c) => c.key === slug)!.label;

    return (
        <MainLayout
            subheaderText={subheaderText}
            lastCrumbText={slug === "all" ? "All" : subheaderText}
        >
            <CategoryGridPage category={slug as Categories} />
        </MainLayout>
    );
}
