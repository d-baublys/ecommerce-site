"use client";

import BagTile from "@/ui/components/BagTile";
import { useWishlistStore } from "@/stores/wishlistStore";
import SubHeader from "@/ui/components/SubHeader";

export default function Page() {
    const wishlist = useWishlistStore((state) => state.wishlist);
    const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);

    return (
        <div className="flex flex-col justify-center items-center grow w-full">
            <SubHeader subheaderText="My Wishlist" />
            <div className="flex flex-col grow justify-center items-center w-full max-w-[960px] h-full my-4 gap-4">
                {wishlist.length > 0 ? (
                    <ul>
                        {wishlist.map((product) => (
                            <li key={product.id}>
                                <BagTile
                                    dataObj={product}
                                    handleDelete={() => removeFromWishlist(product.id)}
                                    productLink={`products/${product.slug}`}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>{"Your wishlist is empty!"}</p>
                )}
            </div>
        </div>
    );
}
