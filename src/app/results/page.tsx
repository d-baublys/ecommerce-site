import MainLayout from "@/ui/layouts/MainLayout";
import CategoryGridPage from "@/ui/pages/CategoryGridPage";
import { Metadata } from "next";

interface AsyncParams {
    searchParams: Promise<{ q: string }>;
}

export const metadata: Metadata = {
    title: "Search",
};

export default async function SearchResultsPage({ searchParams }: AsyncParams) {
    const params = await searchParams;
    let query = params.q;
    if (!query) query = "";

    const subheaderText = `Results for "${query}"`;

    return (
        <MainLayout subheaderText={subheaderText} noCrumbs>
            <CategoryGridPage category="all" options={{ noCategoryTabs: true }} query={query} />
        </MainLayout>
    );
}
