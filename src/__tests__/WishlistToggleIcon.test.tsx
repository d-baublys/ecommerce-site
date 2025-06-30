import { Product } from "@/lib/definitions";
import { createTestProduct } from "@/lib/test-utils";
import WishlistToggleIcon from "@/ui/components/buttons/WishlistToggleIcon";
import { fireEvent, screen } from "@testing-library/dom";
import { render } from "@testing-library/react";

jest.mock("@/hooks/useWishlistToggle", () => ({
    useWishlistToggle: jest.fn(),
}));

import { useWishlistToggle } from "@/hooks/useWishlistToggle";

const mockToggleWishlist = jest.fn();
const mockProduct: Product = createTestProduct();

const renderIcon = () => render(<WishlistToggleIcon product={mockProduct} iconSize={24} />);

describe("WishlistToggleIcon", () => {
    it("shows only outline heart by default", () => {
        (useWishlistToggle as jest.Mock).mockReturnValue({
            inWishlist: false,
            isAnimated: false,
            showFilled: false,
            toggleWishlist: mockToggleWishlist,
        });

        renderIcon();

        expect(screen.getByTestId("outline-heart")).toBeInTheDocument();
        expect(screen.getByTestId("filled-heart")).not.toHaveClass("show-filled");
    });

    it("shows filled heart when product is in wishlist", () => {
        (useWishlistToggle as jest.Mock).mockReturnValue({
            inWishlist: true,
            isAnimated: false,
            showFilled: true,
            toggleWishlist: mockToggleWishlist,
        });

        renderIcon();

        expect(screen.getByTestId("outline-heart")).toBeInTheDocument();
        expect(screen.getByTestId("filled-heart")).toHaveClass("show-filled");
    });

    it("includes animation classes when isAnimated is true (on click)", () => {
        (useWishlistToggle as jest.Mock).mockReturnValue({
            inWishlist: true,
            isAnimated: true,
            showFilled: true,
            toggleWishlist: mockToggleWishlist,
        });

        const { container } = renderIcon();

        const parentDiv = container.firstChild;
        const childDiv = parentDiv?.firstChild;

        expect(parentDiv).toHaveClass(/small-pop-in/);
        expect(childDiv).toHaveClass(/big-pop-in/);
    });

    it("doesn't include animation classes after timeout", () => {
        (useWishlistToggle as jest.Mock).mockReturnValue({
            inWishlist: true,
            isAnimated: false,
            showFilled: true,
            toggleWishlist: mockToggleWishlist,
        });

        const { container } = renderIcon();

        const parentDiv = container.firstChild;
        const childDiv = parentDiv?.firstChild;

        expect(parentDiv).not.toHaveClass(/small-pop-in/);
        expect(childDiv).not.toHaveClass(/big-pop-in/);
    });

    it("calls toggleWishlist once on click", () => {
        (useWishlistToggle as jest.Mock).mockReturnValue({
            inWishlist: false,
            isAnimated: false,
            showFilled: false,
            toggleWishlist: mockToggleWishlist,
        });

        renderIcon();

        fireEvent.click(screen.getByLabelText("Add or remove from wishlist"));

        expect(mockToggleWishlist).toHaveBeenCalledTimes(1);
    });
});
