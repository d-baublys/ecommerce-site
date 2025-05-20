"use client";

import ProductTile from "@/ui/components/ProductTile";
import { useWishlistStore } from "@/stores/wishlistStore";

export default function Page() {
    const wishlist = useWishlistStore.getState().wishlist;
    const handleDelete = useWishlistStore.getState().removeFromWishlist;

    return (
        <div className="flex flex-col justify-center items-center grow w-full">
            <div className="flex justify-center items-center w-full p-2 bg-background-lighter text-contrasted font-semibold md:text-xl">
                My Wishlist
            </div>
            <div className="flex flex-col grow justify-center items-center w-full max-w-[960px] h-full my-4 gap-4">
                {wishlist.map((product, idx) => {
                    return (
                        <ProductTile
                            key={idx}
                            dataObj={product}
                            handleDelete={() => handleDelete(product.id)}
                        />
                    );
                })}
                {wishlist.length && "Your wishlist is empty!"}
            </div>
        </div>
    );
}
