import { createLongProductList, getFilteredFakeProducts } from "@/lib/test-utils";
import { render, screen, waitFor, within } from "@testing-library/react";

jest.mock("@/lib/actions", () => ({
    getProductData: jest.fn(),
    getFeaturedProducts: jest.fn(),
}));

import { getFeaturedProducts, getProductData } from "@/lib/actions";
import HomePage from "@/app/page";

const renderHomePage = async () => render(await HomePage());
const fakeFeaturedList = getFilteredFakeProducts();
const fakeProductList = createLongProductList();

Element.prototype.scrollIntoView = jest.fn();
Element.prototype.scrollTo = jest.fn();

describe("HomePage", () => {
    it("displays an extant featured product list", async () => {
        (getFeaturedProducts as jest.Mock).mockResolvedValue({ data: fakeFeaturedList });
        renderHomePage();

        await waitFor(() => {
            const featuredContainer = screen.getByTestId("carousel-slider");

            expect(within(featuredContainer).getAllByRole("listitem").length).toBe(3);
        });
    });

    it("displays a fallback slice of all products if featured product list doesn't exist", async () => {
        (getFeaturedProducts as jest.Mock).mockResolvedValue({ data: [] });
        (getProductData as jest.Mock).mockResolvedValue({ data: fakeProductList });
        renderHomePage();

        await waitFor(() => {
            const featuredContainer = screen.getByTestId("carousel-slider");

            expect(within(featuredContainer).getAllByRole("listitem").length).toBe(5);
        });
    });

    it("throws an error when first fetch fails", async () => {
        (getFeaturedProducts as jest.Mock).mockRejectedValue(new Error("Fetch failed"));
        (getProductData as jest.Mock).mockResolvedValue({ data: fakeProductList });

        expect(renderHomePage()).rejects.toThrow("Fetch failed");
    });

    it("displays fallback when both featured and product lists are empty", async () => {
        (getFeaturedProducts as jest.Mock).mockResolvedValue({ data: [] });
        (getProductData as jest.Mock).mockResolvedValue({ data: [] });
        renderHomePage();

        await waitFor(() => {
            expect(
                screen.getByText("No featured or fallback products to display")
            ).toBeInTheDocument();
        });
    });
});
