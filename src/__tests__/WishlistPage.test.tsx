import { getFilteredFakeProducts } from "@/lib/test-utils";
import { render, screen, waitFor, within } from "@testing-library/react";

jest.mock("next/navigation", () => ({
    usePathname: () => "/wishlist",
}));

import { useWishlistStore } from "@/stores/wishlistStore";
import WishlistPage from "@/app/wishlist/page";

const { addToWishlist, clearWishlist } = useWishlistStore.getState();
const fakeProductList = getFilteredFakeProducts();

const renderWishlistPage = () => render(<WishlistPage />);
const setUpFakeWishlist = () =>
    fakeProductList.forEach((item) => {
        addToWishlist(item);
    });
const getAllTiles = () => screen.getAllByTestId("product-tile");

describe("WishlistPage", () => {
    beforeEach(() => {
        clearWishlist();
    });

    it("shows correct number of items", async () => {
        setUpFakeWishlist();
        renderWishlistPage();

        await waitFor(() => {
            expect(getAllTiles().length).toBe(3);
        });
    });

    it("shows fallback text when bag is empty", async () => {
        renderWishlistPage();

        await waitFor(() => {
            expect(screen.getByText("Your wishlist is empty!")).toBeInTheDocument();
        });
    });
});
