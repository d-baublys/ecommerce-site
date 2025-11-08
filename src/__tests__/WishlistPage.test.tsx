import { getFilteredTestProducts } from "@/lib/test-factories";
import { render, screen, waitFor } from "@testing-library/react";
import { useWishlistStore } from "@/stores/wishlistStore";
import WishlistPage from "@/app/wishlist/page";
import { Product, ReservedItem } from "@/lib/types";

jest.mock("next/navigation", () => ({
    usePathname: () => "/wishlist",
}));

jest.mock("@/lib/actions", () => ({
    getProducts: jest.fn(),
    getReservedItems: jest.fn(),
}));

import { getProducts, getReservedItems } from "@/lib/actions";

const { addToWishlist, clearWishlist } = useWishlistStore.getState();
const testProductList = getFilteredTestProducts();

const renderWishlistPage = () => render(<WishlistPage />);
const setUpTestWishlist = () =>
    testProductList.forEach((item) => {
        addToWishlist(item.id);
    });
const getAllTiles = () => screen.getAllByTestId("product-tile");

const setUpResolvedFetch = (
    resolvedProducts: Product[] = [],
    resolvedReserved: ReservedItem[] = []
) => {
    (getProducts as jest.Mock).mockResolvedValue({ data: resolvedProducts });
    (getReservedItems as jest.Mock).mockResolvedValue({ data: resolvedReserved });
};

describe("WishlistPage", () => {
    beforeEach(() => {
        clearWishlist();
    });

    it("shows correct number of items", async () => {
        setUpResolvedFetch(testProductList);
        renderWishlistPage();

        await waitFor(() => {
            expect(getAllTiles().length).toBe(3);
        });
    });

    it("shows fallback text when wishlist is empty", async () => {
        setUpResolvedFetch();
        renderWishlistPage();

        await waitFor(() => {
            expect(screen.getByText("Your wishlist is empty!")).toBeInTheDocument();
        });
    });
});
