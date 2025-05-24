"use client";

import ProductTile from "@/ui/components/ProductTile";
import { useWishlistStore } from "@/stores/wishlistStore";
import SubHeader from "@/ui/components/SubHeader";

export default function Page() {
    const wishlist = useWishlistStore((state) => state.wishlist);
    const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
    const emptyWishlist = !wishlist.length;

    return (
        <div className="flex flex-col justify-center items-center grow w-full">
            <SubHeader subheaderText="My Wishlist" />
            <div className="flex flex-col grow justify-center items-center w-full max-w-[960px] h-full my-4 gap-4">
                {wishlist.map((product) => (
                    <ProductTile
                        key={product.id}
                        dataObj={product}
                        handleDelete={() => removeFromWishlist(product.id)}
                        productLink={`products/${product.slug}`}
                    />
                ))}
                {emptyWishlist && "Your wishlist is empty!"}
            </div>
        </div>
    );
}
