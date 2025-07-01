import { createTestProduct } from "@/lib/test-utils";
import { useWishlistStore } from "@/stores/wishlistStore";
import WishlistToggleButton from "@/ui/components/buttons/WishlistToggleButton";
import { fireEvent, render, waitFor } from "@testing-library/react";
import React, { act } from "react";

const mockProduct = createTestProduct();
const getLatestWishlist = () => useWishlistStore.getState().wishlist;
const { clearWishlist, addToWishlist } = useWishlistStore.getState();

describe("WishlistToggleButton", () => {
    beforeEach(() => {
        clearWishlist();
    });

    it("adds product to the wishlist when clicked & shows correct text", async () => {
        const { container } = render(<WishlistToggleButton product={mockProduct} />);
        const firstChild = container.firstChild;
        if (!(firstChild instanceof Element)) throw new Error();

        expect(firstChild).toHaveTextContent("Add to Wishlist");

        fireEvent.click(firstChild);

        await waitFor(() => {
            const wishlist = getLatestWishlist();

            expect(wishlist.some((item) => item.id === mockProduct.id)).toBe(true);
            expect(firstChild).toHaveTextContent("Remove from Wishlist");
        });
    });

    it("removes wishlist item clicked & shows correct text", async () => {
        addToWishlist(mockProduct);

        const { container } = render(<WishlistToggleButton product={mockProduct} />);
        const firstChild = container.firstChild;
        if (!(firstChild instanceof Element)) throw new Error();

        await waitFor(() => {
            expect(firstChild).toHaveTextContent("Remove from Wishlist");
        });

        fireEvent.click(firstChild);

        await waitFor(() => {
            const wishlist = getLatestWishlist();

            expect(wishlist.some((item) => item.id === mockProduct.id)).toBe(false);
            expect(firstChild).toHaveTextContent("Add to Wishlist");
        });
    });

    it("doesn't add duplicate items", async () => {
        const { container } = render(<WishlistToggleButton product={mockProduct} />);
        const firstChild = container.firstChild;
        if (!(firstChild instanceof Element)) throw new Error();

        fireEvent.click(firstChild);
        fireEvent.click(firstChild);

        await act(async () => {
            await new Promise((res) => setTimeout(res, 500)); // account for 300 ms removeFromWishlist timeout
        });

        const wishlist = getLatestWishlist();
        const occurrences = wishlist.filter((item) => item.id === mockProduct.id).length;

        expect(occurrences).toBe(0);
    });
});
