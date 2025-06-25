"use client";

import { useWishlistToggle } from "@/hooks/useWishlistToggle";
import { Product } from "@/lib/definitions";
import { IoHeart, IoHeartOutline } from "react-icons/io5";

export default function WishlistToggleIcon({
    product,
    iconSize,
    parentHook,
    overrideClasses,
}: {
    product: Product;
    iconSize: number;
    parentHook?: ReturnType<typeof useWishlistToggle>;
    overrideClasses?: string;
}) {
    const { isAnimated, showFilled, toggleWishlist } = parentHook ?? useWishlistToggle(product);

    return (
        <div
            className={`p-1 bg-white [border-radius:50%] ${overrideClasses ?? ""} ${
                isAnimated ? "[animation:small-pop-in_0.3s_ease]" : ""
            }`}
            onClick={toggleWishlist}
            aria-label="Add or remove from wishlist"
        >
            <div
                className={`relative flex justify-center items-center translate-y-[1px] aspect-square text-black ${
                    isAnimated ? "[animation:big-pop-in_0.3s_ease_0.1s]" : ""
                }`}
            >
                <IoHeart
                    data-testid="filled-heart"
                    size={iconSize}
                    className={`absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] filled-heart ${
                        showFilled ? "show-filled" : ""
                    }`}
                />
                <IoHeartOutline data-testid="outline-heart" size={iconSize} />
            </div>
        </div>
    );
}
