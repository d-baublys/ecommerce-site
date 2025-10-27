import { Categories } from "@/lib/types";
import CategoryGridPage from "@/ui/pages/CategoryGridPage";
import MainLayout from "@/ui/layouts/MainLayout";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { VALID_CATEGORIES } from "@/lib/constants";

interface AsyncParams {
    params: Promise<{ categoryId: string }>;
}

export async function generateMetadata({ params }: AsyncParams): Promise<Metadata> {
    const { categoryId } = await params;

    const title =
        categoryId === "all"
            ? "All Products"
            : VALID_CATEGORIES.find((c) => c.id === categoryId)!.label;

    return { title };
}

export default async function CategoryPage({ params }: AsyncParams) {
    const { categoryId } = await params;

    if (!(categoryId === "all" || VALID_CATEGORIES.find((c) => c.id === categoryId))) {
        notFound();
    }

    const subheaderText =
        categoryId === "all"
            ? "All Products"
            : VALID_CATEGORIES.find((c) => c.id === categoryId)!.label;

    return (
        <MainLayout
            subheaderText={subheaderText}
            lastCrumbText={categoryId === "all" ? "All" : subheaderText}
        >
            <CategoryGridPage category={categoryId as Categories} />
        </MainLayout>
    );
}
