import { Metadata } from "next";
import WishlistPageClient from "./WishlistPageClient";

export const metadata: Metadata = {
    title: "My Wishlist",
};

export default function WishlistPage() {
    return <WishlistPageClient />;
}
