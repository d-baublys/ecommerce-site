import { getFilteredTestProducts } from "@/lib/test-factories";
import { render, screen, waitFor } from "@testing-library/react";
import { useWishlistStore } from "@/stores/wishlistStore";
import WishlistPage from "@/app/wishlist/page";

jest.mock("next/navigation", () => ({
    usePathname: () => "/wishlist",
}));

jest.mock("@/lib/actions", () => ({
    getProducts: jest.fn(),
    getReservedItems: jest.fn(),
}));

import { getFetchResolutionHelper } from "@/lib/test-utils";

const { clearWishlist } = useWishlistStore.getState();
const testProductList = getFilteredTestProducts();

const renderWishlistPage = () => render(<WishlistPage />);

const getAllTiles = () => screen.getAllByTestId("product-tile");

const setUpResolvedFetch = getFetchResolutionHelper(testProductList);

describe("WishlistPage", () => {
    beforeEach(() => {
        clearWishlist();
    });

    it("shows correct number of items", async () => {
        setUpResolvedFetch();
        renderWishlistPage();

        await waitFor(() => {
            expect(getAllTiles().length).toBe(3);
        });
    });

    it("shows fallback text when wishlist is empty", async () => {
        setUpResolvedFetch({ resolvedProducts: [] });
        renderWishlistPage();

        await waitFor(() => {
            expect(screen.getByText("Your wishlist is empty!")).toBeInTheDocument();
        });
    });
});
