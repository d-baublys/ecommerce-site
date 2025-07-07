import { Product } from "@/lib/definitions";
import { isolateInteraction } from "@/lib/utils";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useEffect, useState } from "react";

export function useWishlistToggle(product: Product) {
    const [isAnimated, setIsAnimated] = useState<boolean>(false);

    const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore((state) => state);
    const inWishlist = wishlist.findIndex((item) => item.id === product.id) > -1;

    const [showFilled, setShowFilled] = useState<boolean>(inWishlist);

    useEffect(() => {
        setShowFilled(inWishlist);
    }, [wishlist]);

    const toggleWishlist = (e: React.TouchEvent | React.MouseEvent | React.KeyboardEvent) => {
        isolateInteraction(e);

        setIsAnimated(true);
        setTimeout(() => {
            setIsAnimated(false);
        }, 400);

        if (!inWishlist) {
            addToWishlist(product);
            setShowFilled(true);
        } else {
            setShowFilled(false);
            removeFromWishlist(product.id);
        }
    };

    return { inWishlist, isAnimated, showFilled, toggleWishlist };
}
