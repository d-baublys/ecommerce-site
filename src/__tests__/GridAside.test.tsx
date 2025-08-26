import { PriceFilterKey, Product, Sizes } from "@/lib/definitions";
import { createFakeProductList } from "@/lib/test-factories";
import { matchPriceRangeLabel, matchSizeLabel } from "@/lib/test-utils";
import GridAside from "@/ui/components/product-grid/GridAside";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

const fakeProductList: Product[] = createFakeProductList();
const filteredFakeProducts: Product[] = fakeProductList.filter((product) =>
    Object.values(product.stock).some((stockCount) => stockCount > 0)
); // parent would not pass list containing fully unstocked products

const mockSizeFiltersSetter = jest.fn();
const mockPriceFiltersSetter = jest.fn();

const renderGridAside = () => {
    render(
        <GridAside
            allCategoryProducts={filteredFakeProducts}
            sizeFilters={[]}
            setSizeFilters={mockSizeFiltersSetter}
            priceFilters={[]}
            setPriceFilters={mockPriceFiltersSetter}
        />
    );
};

describe("GridAside", () => {
    it("shows correct number of size filters", () => {
        renderGridAside();

        expect(
            screen.getByRole("button", {
                name: matchSizeLabel(3, "S"),
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: matchSizeLabel(2, "M"),
            })
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: matchSizeLabel(2, "XS"),
            })
        ).not.toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: matchSizeLabel(0, "L"),
            })
        ).not.toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: matchSizeLabel(0, "XL"),
            })
        ).not.toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: matchSizeLabel(0, "XXL"),
            })
        ).not.toBeInTheDocument();
    });

    it("shows correct number of price filters", () => {
        renderGridAside();

        expect(
            screen.getByRole("button", {
                name: matchPriceRangeLabel(2, "50", "99"),
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: matchPriceRangeLabel(1, "200"),
            })
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: matchPriceRangeLabel(0, "0", "49"),
            })
        ).not.toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: matchPriceRangeLabel(0, "100", "149"),
            })
        ).not.toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: matchPriceRangeLabel(0, "150", "199"),
            })
        ).not.toBeInTheDocument();
    });

    it("toggles a size filter on when clicked", () => {
        const initialSizeFilters: Sizes[] = [];

        const { rerender } = render(
            <GridAside
                allCategoryProducts={filteredFakeProducts}
                sizeFilters={initialSizeFilters}
                setSizeFilters={mockSizeFiltersSetter}
                priceFilters={[]}
                setPriceFilters={mockPriceFiltersSetter}
            />
        );

        const sizeButton = screen.getByRole("button", {
            name: matchSizeLabel(3, "S"),
        });

        expect(sizeButton).not.toHaveClass("border-black");

        fireEvent.click(sizeButton);

        const updateFunc = mockSizeFiltersSetter.mock.calls[0][0];
        const updateResult = updateFunc(initialSizeFilters);

        expect(updateResult).toEqual(["s"]);

        rerender(
            <GridAside
                allCategoryProducts={filteredFakeProducts}
                sizeFilters={updateResult}
                setSizeFilters={mockSizeFiltersSetter}
                priceFilters={[]}
                setPriceFilters={mockPriceFiltersSetter}
            />
        );

        expect(sizeButton).toHaveClass("border-black");
    });

    it("toggles an active size filter off when clicked", () => {
        const initialSizeFilters: Sizes[] = ["s"];

        const { rerender } = render(
            <GridAside
                allCategoryProducts={filteredFakeProducts}
                sizeFilters={initialSizeFilters}
                setSizeFilters={mockSizeFiltersSetter}
                priceFilters={[]}
                setPriceFilters={mockPriceFiltersSetter}
            />
        );

        const sizeButton = screen.getByRole("button", {
            name: matchSizeLabel(3, "S"),
        });

        expect(sizeButton).toHaveClass("border-black");

        fireEvent.click(sizeButton);

        const toggleOffFunc = mockSizeFiltersSetter.mock.calls[0][0];
        const toggleOffResult = toggleOffFunc(initialSizeFilters);

        rerender(
            <GridAside
                allCategoryProducts={filteredFakeProducts}
                sizeFilters={toggleOffResult}
                setSizeFilters={mockSizeFiltersSetter}
                priceFilters={[]}
                setPriceFilters={mockPriceFiltersSetter}
            />
        );

        expect(toggleOffResult).toEqual([]);
        expect(sizeButton).not.toHaveClass("border-black");
    });

    it("toggles a price filter on when clicked", () => {
        const initialPriceFilters: PriceFilterKey[] = [];

        const { rerender } = render(
            <GridAside
                allCategoryProducts={filteredFakeProducts}
                sizeFilters={[]}
                setSizeFilters={mockSizeFiltersSetter}
                priceFilters={initialPriceFilters}
                setPriceFilters={mockPriceFiltersSetter}
            />
        );

        const priceRangeBtn = screen.getByRole("button", {
            name: matchPriceRangeLabel(2, "50", "99"),
        });

        expect(priceRangeBtn).not.toHaveClass("border-black");

        fireEvent.click(priceRangeBtn);

        const updateFunc = mockPriceFiltersSetter.mock.calls[0][0];
        const updateResult = updateFunc(initialPriceFilters);

        rerender(
            <GridAside
                allCategoryProducts={filteredFakeProducts}
                sizeFilters={[]}
                setSizeFilters={mockSizeFiltersSetter}
                priceFilters={updateResult}
                setPriceFilters={mockPriceFiltersSetter}
            />
        );

        expect(updateResult).toEqual(["b"]);
        expect(priceRangeBtn).toHaveClass("border-black");
    });

    it("toggles an active price filter off when clicked", () => {
        const initialPriceFilters: PriceFilterKey[] = ["b"];

        const { rerender } = render(
            <GridAside
                allCategoryProducts={filteredFakeProducts}
                sizeFilters={[]}
                setSizeFilters={mockSizeFiltersSetter}
                priceFilters={initialPriceFilters}
                setPriceFilters={mockPriceFiltersSetter}
            />
        );

        const sizeButton = screen.getByRole("button", {
            name: matchPriceRangeLabel(2, "50", "99"),
        });

        expect(sizeButton).toHaveClass("border-black");

        fireEvent.click(sizeButton);

        const toggleOffFunc = mockPriceFiltersSetter.mock.calls[0][0];
        const toggleOffResult = toggleOffFunc(initialPriceFilters);

        rerender(
            <GridAside
                allCategoryProducts={filteredFakeProducts}
                sizeFilters={[]}
                setSizeFilters={mockSizeFiltersSetter}
                priceFilters={toggleOffResult}
                setPriceFilters={mockPriceFiltersSetter}
            />
        );

        expect(toggleOffResult).toEqual([]);
        expect(sizeButton).not.toHaveClass("border-black");
    });

    it("has no accessibility violations", async () => {
        const { container } = render(
            <GridAside
                allCategoryProducts={filteredFakeProducts}
                sizeFilters={[]}
                setSizeFilters={mockSizeFiltersSetter}
                priceFilters={[]}
                setPriceFilters={mockPriceFiltersSetter}
            />
        );

        await waitFor(async () => {
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});
