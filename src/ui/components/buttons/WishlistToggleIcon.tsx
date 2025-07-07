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

    const buildOuterClasses = () =>
        `p-1 bg-white rounded-circle ${overrideClasses ?? ""} ${
            isAnimated ? "[animation:small-pop-in_0.3s_ease]" : ""
        }`;

    const renderCentralContent = () => (
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
    );

    if (parentHook !== undefined) {
        return <div className={buildOuterClasses()}>{renderCentralContent()}</div>;
    } else {
        return (
            <button
                type="button"
                className={buildOuterClasses()}
                onClick={toggleWishlist}
                title="Add or remove from wishlist"
                aria-label="Add or remove from wishlist"
            >
                {renderCentralContent()}
            </button>
        );
    }
}
