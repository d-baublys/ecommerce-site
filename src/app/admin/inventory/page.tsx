import { fetchData } from "@/lib/utils";
import AdminInventoryClient from "./AdminInventoryClient";
import SubHeader from "@/ui/components/SubHeader";

export default async function InventoryPage() {
    const allProducts = await fetchData();

    return (
        <div className="flex flex-col justify-center items-center grow w-full">
            <SubHeader subheaderText="Inventory" />
            <AdminInventoryClient productData={allProducts} />
        </div>
    );
}
