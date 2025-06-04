import { getFeaturedProducts } from "@/lib/actions";
import ManageFeaturedClient from "./ManageFeaturedClient";

export default async function ManageFeaturedPage() {
    const listFetch = await getFeaturedProducts();
    const list = listFetch.data;

    return <ManageFeaturedClient productData={list} />;
}
