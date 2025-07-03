import { createFakeProduct } from "@/lib/test-utils";
import WishlistToggleIcon from "@/ui/components/buttons/WishlistToggleIcon";
import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";

import { useWishlistStore } from "@/stores/wishlistStore";
import { useWishlistToggle } from "@/hooks/useWishlistToggle";
import { act } from "react";

const fakeProduct = createFakeProduct();
const getLatestWishlist = () => useWishlistStore.getState().wishlist;
const { clearWishlist, addToWishlist } = useWishlistStore.getState();

const renderIcon = () => render(<WishlistToggleIcon product={fakeProduct} iconSize={24} />);

describe("WishlistToggleIcon", () => {
    beforeEach(() => {
        clearWishlist();
    });

    it("includes animation classes on click", () => {
        renderIcon();

        const parent = screen.getByLabelText("Add or remove from wishlist");
        const child = parent.firstChild;

        fireEvent.click(parent);

        expect(parent).toHaveClass(/small-pop-in/);
        expect(child).toHaveClass(/big-pop-in/);
    });

    it("doesn't include animation classes after timeout", async () => {
        renderIcon();

        const parent = screen.getByLabelText("Add or remove from wishlist");
        const child = parent.firstChild;

        fireEvent.click(parent);

        await waitFor(() => {
            expect(parent).not.toHaveClass(/small-pop-in/);
            expect(child).not.toHaveClass(/big-pop-in/);
        });
    });

    it("adds product to wishlist & shows filled heart when initially clicked ", async () => {
        renderIcon();
        const icon = screen.getByLabelText("Add or remove from wishlist");

        expect(screen.getByTestId("outline-heart")).toBeInTheDocument();
        expect(screen.getByTestId("filled-heart")).not.toHaveClass("show-filled");

        fireEvent.click(icon);

        await waitFor(() => {
            const wishlist = getLatestWishlist();

            expect(wishlist.some((item) => item.id === fakeProduct.id)).toBe(true);
            expect(screen.getByTestId("outline-heart")).toBeInTheDocument();
            expect(screen.getByTestId("filled-heart")).toHaveClass("show-filled");
        });
    });

    it("removes item from store & hides filled heart when clicking wishlisted item", async () => {
        addToWishlist(fakeProduct);

        renderIcon();
        const icon = screen.getByLabelText("Add or remove from wishlist");

        await waitFor(() => {
            expect(screen.getByTestId("outline-heart")).toBeInTheDocument();
            expect(screen.getByTestId("filled-heart")).toHaveClass("show-filled");
        });

        fireEvent.click(icon);

        await waitFor(() => {
            const wishlist = getLatestWishlist();

            expect(wishlist.some((item) => item.id === fakeProduct.id)).toBe(false);
            expect(screen.getByTestId("outline-heart")).toBeInTheDocument();
            expect(screen.getByTestId("filled-heart")).not.toHaveClass("show-filled");
        });
    });

    it("doesn't add duplicate items", async () => {
        renderIcon();
        const icon = screen.getByLabelText("Add or remove from wishlist");

        fireEvent.click(icon);
        fireEvent.click(icon);

        await act(async () => {
            await new Promise((res) => setTimeout(res, 500)); // account for 300 ms removeFromWishlist timeout
        });

        const wishlist = getLatestWishlist();
        const occurrences = wishlist.filter((item) => item.id === fakeProduct.id).length;

        expect(occurrences).toBe(0);
    });

    it("toggles when parentHook is provided", () => {
        const mockToggleWishlist = jest.fn();
        const parentHook: ReturnType<typeof useWishlistToggle> = {
            inWishlist: false,
            isAnimated: false,
            showFilled: false,
            toggleWishlist: mockToggleWishlist,
        };

        render(<WishlistToggleIcon product={fakeProduct} iconSize={24} parentHook={parentHook} />);

        const icon = screen.getByLabelText("Add or remove from wishlist");
        fireEvent.click(icon);

        expect(mockToggleWishlist).toHaveBeenCalled();
    });
});
