import { createLongProductList, getFilteredTestProducts } from "@/lib/test-factories";
import { render, screen, waitFor, within } from "@testing-library/react";

jest.mock("@/lib/actions", () => ({
    getProductData: jest.fn(),
    getFeaturedProducts: jest.fn(),
}));

import { getFeaturedProducts, getProducts } from "@/lib/actions";
import HomePage from "@/app/page";

const renderHomePage = async () => render(await HomePage());
const testFeaturedList = getFilteredTestProducts();
const testProductList = createLongProductList();

Element.prototype.scrollIntoView = jest.fn();
window.scrollTo = jest.fn();

describe("HomePage", () => {
    it("displays an extant featured product list", async () => {
        (getFeaturedProducts as jest.Mock).mockResolvedValue({ data: testFeaturedList });
        renderHomePage();

        await waitFor(() => {
            const featuredContainer = screen.getByTestId("carousel-slider");

            expect(within(featuredContainer).getAllByRole("listitem").length).toBe(3);
        });
    });

    it("displays a fallback slice of all products if featured product list doesn't exist", async () => {
        (getFeaturedProducts as jest.Mock).mockResolvedValue({ data: [] });
        (getProducts as jest.Mock).mockResolvedValue({ data: testProductList });
        renderHomePage();

        await waitFor(() => {
            const featuredContainer = screen.getByTestId("carousel-slider");

            expect(within(featuredContainer).getAllByRole("listitem").length).toBe(5);
        });
    });

    it("throws an error when first fetch fails", async () => {
        (getFeaturedProducts as jest.Mock).mockRejectedValue(new Error("Fetch failed"));
        (getProducts as jest.Mock).mockResolvedValue({ data: testProductList });

        expect(renderHomePage()).rejects.toThrow("Fetch failed");
    });

    it("displays fallback when both featured and product lists are empty", async () => {
        (getFeaturedProducts as jest.Mock).mockResolvedValue({ data: [] });
        (getProducts as jest.Mock).mockResolvedValue({ data: [] });
        renderHomePage();

        await waitFor(() => {
            expect(
                screen.getByText("No featured or fallback products to display")
            ).toBeInTheDocument();
        });
    });
});
