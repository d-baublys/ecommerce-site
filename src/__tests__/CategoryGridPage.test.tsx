import {
    getConsoleErrorSpy,
    matchPriceRangeLabel,
    matchSizeLabel,
    wrapWithErrorBoundary,
} from "@/lib/test-utils";
import CategoryGridPage from "@/ui/pages/CategoryGridPage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getFilteredTestProducts } from "@/lib/test-factories";

jest.mock("@/lib/fetching-utils", () => ({
    getFilteredProducts: jest.fn(),
}));

jest.mock("@/lib/actions", () => ({
    getReservedItems: jest.fn(),
}));

const replaceMock = jest.fn();

jest.mock("next/navigation", () => ({
    useSearchParams: () => {
        const params = new URLSearchParams("sort=c");
        return {
            get: (key: string) => params.get(key),
        };
    },
    useRouter: () => ({
        replace: replaceMock,
    }),
    usePathname: () => "/category/all",
}));

import { getFilteredProducts } from "@/lib/fetching-utils";
import { getReservedItems } from "@/lib/actions";

const filteredTestProducts = getFilteredTestProducts();

const testComponent = <CategoryGridPage category="all" />;
const testComponentWithQuery = <CategoryGridPage category="all" query="testing-test" />;

const renderPage = () => render(testComponent);
const renderPageWithQuery = () => render(testComponentWithQuery);

const mockBothQuerysetsEmpty = () => {
    (getFilteredProducts as jest.Mock).mockResolvedValue([]);
    (getReservedItems as jest.Mock).mockResolvedValue({ data: [] });
};
const mockBothQuerysetsFull = () => {
    (getFilteredProducts as jest.Mock).mockResolvedValue(filteredTestProducts);
    (getReservedItems as jest.Mock).mockResolvedValue({ data: [] });
};
const mockFilterQuerysetEmpty = () => {
    (getFilteredProducts as jest.Mock).mockResolvedValueOnce(filteredTestProducts); // for allCategoryProducts
    (getFilteredProducts as jest.Mock).mockResolvedValueOnce([]); // for filteredProducts
    (getReservedItems as jest.Mock).mockResolvedValue({ data: [] });
};

describe("CategoryGridPage", () => {
    it("displays loading indicator while fetching", async () => {
        (getFilteredProducts as jest.Mock).mockImplementation(() => new Promise(() => {})); // never-resolving promise
        renderPage();

        expect(screen.getByLabelText("Loading indicator")).toBeInTheDocument();
    });

    it("throws an error when fetch fails", async () => {
        const errorSpy = getConsoleErrorSpy();
        (getFilteredProducts as jest.Mock).mockRejectedValue(new Error("Fetch Failed"));
        render(wrapWithErrorBoundary(testComponent));

        await waitFor(() => {
            expect(screen.getByText(/Error caught by boundary/)).toBeInTheDocument();
        });

        errorSpy.mockRestore();
    });

    it("shows correct number of products", async () => {
        mockBothQuerysetsFull();
        renderPage();

        await waitFor(() => {
            expect(screen.getByAltText("Test product image 1")).toBeInTheDocument();
            expect(screen.getByAltText("Test product image 2")).toBeInTheDocument();
            expect(screen.getByAltText("Test product image 3")).toBeInTheDocument();
            expect(screen.queryByAltText("Test product image 4")).not.toBeInTheDocument();
        });
    });

    it("shows correct fallback when no products match the filter", async () => {
        mockFilterQuerysetEmpty();
        renderPage();

        await waitFor(() => {
            expect(screen.getByText("No products matching your filter")).toBeInTheDocument();
        });
    });

    it("shows correct fallback when no products match the search query", async () => {
        mockBothQuerysetsEmpty();
        renderPageWithQuery();

        await waitFor(() => {
            expect(screen.getByText("No products matching your search")).toBeInTheDocument();
        });
    });

    it("shows correct fallback when there is no query and fetch returns no products", async () => {
        mockBothQuerysetsEmpty();
        renderPage();

        await waitFor(() => {
            expect(screen.getByText("No products to display")).toBeInTheDocument();
        });
    });

    it("renders filter button and slide-down menu", async () => {
        mockBothQuerysetsFull();
        renderPage();

        const filterBtn = await screen.findByRole("button", { name: "Filter" });
        fireEvent.click(filterBtn);

        await waitFor(() => {
            expect(screen.getByLabelText("Filter menu")).toBeInTheDocument();
        });
    });

    it("uses selected size filters for product fetching", async () => {
        mockBothQuerysetsFull();
        renderPage();

        (getFilteredProducts as jest.Mock).mockClear();

        const filterBtn = await screen.findByRole("button", { name: matchSizeLabel(2, "M") });
        fireEvent.click(filterBtn);

        await waitFor(() => {
            expect(getFilteredProducts).toHaveBeenCalledWith(
                expect.objectContaining({ sizeFilters: ["m"] })
            );

            expect(getFilteredProducts).toHaveBeenCalledTimes(1);
        });
    });

    it("uses selected price filters for product fetching", async () => {
        mockBothQuerysetsFull();
        renderPage();

        (getFilteredProducts as jest.Mock).mockClear();

        const filterBtn = await screen.findByRole("button", {
            name: matchPriceRangeLabel(1, "200"),
        });
        fireEvent.click(filterBtn);

        await waitFor(() => {
            expect(getFilteredProducts).toHaveBeenCalledWith(
                expect.objectContaining({ priceFilters: ["e"] })
            );

            expect(getFilteredProducts).toHaveBeenCalledTimes(1);
        });
    });

    it("uses selected product sort for product fetching", async () => {
        mockBothQuerysetsFull();
        renderPage();

        (getFilteredProducts as jest.Mock).mockClear();

        const sortSelect = await screen.findByLabelText("Sort By");
        fireEvent.change(sortSelect, { target: { value: "b" } });

        await waitFor(() => {
            expect(getFilteredProducts).toHaveBeenCalledWith(
                expect.objectContaining({ productSort: "b" })
            );

            expect(getFilteredProducts).toHaveBeenCalledTimes(1);
        });
    });

    it("doesn't render the aside or filter button when query is defined but fetch returns no products", async () => {
        mockBothQuerysetsEmpty();
        renderPageWithQuery();

        await waitFor(() => {
            expect(screen.queryByLabelText("Filtering aside")).not.toBeInTheDocument();
            expect(screen.queryByRole("button", { name: "Filter" })).not.toBeInTheDocument();
        });
    });

    it("renders all optional components by default", async () => {
        mockBothQuerysetsFull();
        renderPage();

        await waitFor(() => {
            expect(screen.getByLabelText("Category tabs")).toBeInTheDocument();
            expect(screen.getByLabelText("Filtering aside")).toBeInTheDocument();
            expect(screen.getByTestId("fixed-overlays")).toBeInTheDocument();
            expect(screen.getByLabelText("Sort By")).toBeInTheDocument();
        });
    });

    it("doesn't render optional components when specified", async () => {
        mockBothQuerysetsFull();
        render(
            <CategoryGridPage
                category="all"
                options={{ noCategoryTabs: true, noAside: true, noOverlays: true, noSorting: true }}
            />
        );

        await waitFor(() => {
            expect(screen.queryByLabelText("Category tabs")).not.toBeInTheDocument();
            expect(screen.queryByLabelText("Filtering aside")).not.toBeInTheDocument();
            expect(screen.queryByTestId("fixed-overlays")).not.toBeInTheDocument();
            expect(screen.queryByLabelText("Sort By")).not.toBeInTheDocument();
        });
    });

    it("uses URL parameters to fetch products on page load", async () => {
        mockBothQuerysetsFull();
        renderPage();

        await waitFor(() => {
            expect(getFilteredProducts).toHaveBeenCalledWith(
                expect.objectContaining({ productSort: "c" })
            );
        });
    });

    it("replaces URL parameters on filter selection", async () => {
        mockBothQuerysetsFull();
        renderPage();

        await waitFor(() => {
            fireEvent.click(screen.getByRole("button", { name: matchSizeLabel(2, "M") }));
            fireEvent.click(
                screen.getByRole("button", {
                    name: matchSizeLabel(3, "S"),
                })
            );
            fireEvent.click(
                screen.getByRole("button", {
                    name: matchPriceRangeLabel(2, "50", "99"),
                })
            );
            fireEvent.click(
                screen.getByRole("button", {
                    name: matchPriceRangeLabel(1, "200"),
                })
            );
            fireEvent.change(screen.getByLabelText("Sort By"), { target: { value: "b" } });
        });

        const lastCallArg = decodeURIComponent(replaceMock.mock.calls.at(-1)[0]);

        expect(lastCallArg).toContain("sort=b");
        expect(lastCallArg).toContain("p=b|e");
        expect(lastCallArg).toContain("s=m|s");
    });

    it("refetches products on query change", async () => {
        mockBothQuerysetsFull();
        const { rerender } = render(<CategoryGridPage category="all" query="first query" />);

        await waitFor(() => {
            expect(getFilteredProducts).toHaveBeenCalledWith(
                expect.objectContaining({ query: "first query" })
            );
        });

        rerender(<CategoryGridPage category="all" query="second query" />);

        await waitFor(() => {
            expect(getFilteredProducts).toHaveBeenCalledWith(
                expect.objectContaining({ query: "second query" })
            );
        });
    });
});
