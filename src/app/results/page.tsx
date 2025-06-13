import MainLayout from "@/ui/layouts/MainLayout";
import CategoryGridPage from "@/ui/pages/CategoryGridPage";

export default async function SearchResultsPage({ searchParams }: { searchParams: { q: string } }) {
    const params = await searchParams;
    let query = params.q;
    if (!query) query = "";

    const subheaderText = `Results for "${query}"`;

    return (
        <MainLayout subheaderText={subheaderText} noCrumbs>
            <CategoryGridPage category={"all"} options={{ noCategoryTabs: true }} query={query} />
        </MainLayout>
    );
}
