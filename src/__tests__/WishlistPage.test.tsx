import { getFilteredTestProducts } from "@/lib/test-factories";
import { render, screen, waitFor } from "@testing-library/react";
import { useWishlistStore } from "@/stores/wishlistStore";
import WishlistPage from "@/app/wishlist/page";
import { getManyFetchResolutionHelper } from "@/lib/test-utils";

jest.mock("next/navigation", () => ({
    usePathname: () => "/wishlist",
}));

jest.mock("@/lib/actions", () => ({
    getManyProducts: jest.fn(),
    getReservedItems: jest.fn(),
}));

const { clearWishlist } = useWishlistStore.getState();
const testProductList = getFilteredTestProducts();

const renderWishlistPage = () => render(<WishlistPage />);

const getAllTiles = () => screen.getAllByTestId("product-tile");

const setUpResolvedFetch = getManyFetchResolutionHelper(testProductList);

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
