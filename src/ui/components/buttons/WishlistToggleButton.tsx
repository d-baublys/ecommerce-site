"use client";

import { Product } from "@/lib/definitions";
import WishlistToggleIcon from "@/ui/components/buttons/WishlistToggleIcon";
import { useWishlistToggle } from "@/hooks/useWishlistToggle";
import PlainRoundedButton from "@/ui/components/buttons/PlainRoundedButton";

export default function WishlistToggleButton({ product }: { product: Product }) {
    const parentHook = useWishlistToggle(product);
    const { isAnimated, toggleWishlist, inWishlist } = parentHook;

    return (
        <PlainRoundedButton
            onClick={toggleWishlist}
            overrideClasses={`!bg-background-lightest ${isAnimated ? "animate-small-pop-in" : ""}`}
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
        </PlainRoundedButton>
    );
}
