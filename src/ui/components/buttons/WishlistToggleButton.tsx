"use client";

import { Product } from "@/lib/definitions";
import RoundedButton from "@/ui/components/buttons/RoundedButton";
import WishlistToggleIcon from "@/ui/components/buttons/WishlistToggleIcon";
import { useWishlistToggle } from "@/hooks/useWishlistToggle";

export default function WishlistToggleButton({ product }: { product: Product }) {
    const parentHook = useWishlistToggle(product);
    const { isAnimated, toggleWishlist, inWishlist } = parentHook;

    return (
        <RoundedButton
            onClick={toggleWishlist}
            overrideClasses={`${isAnimated ? "[animation:small-pop-in_0.3s_ease]" : ""}`}
        >
            <span>{!inWishlist ? "Add to Wishlist" : "Remove from Wishlist"}</span>
            <div className="translate-y-[-1px]">
                <WishlistToggleIcon
                    product={product}
                    iconSize={16}
                    parentHook={parentHook}
                    overrideClasses={"!bg-transparent !p-0"}
                />
            </div>
        </RoundedButton>
    );
}
