import { fetchData } from "@/lib/actions";
import AdminProductsClient from "./AdminProductsClient";
import SubHeader from "@/ui/components/SubHeader";

export default async function AdminProductsPage() {
    const allProducts = await fetchData();

    return (
        <div className="flex flex-col justify-center items-center grow w-full">
            <SubHeader subheaderText="Administration" />
            <AdminProductsClient productData={allProducts} />
        </div>
    );
}
