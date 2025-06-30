import { PriceFilterKey, Product, Sizes } from "@/lib/definitions";
import { createTestProductList, matchPriceRangeLabel, matchSizeLabel } from "@/lib/test-utils";
import GridAside from "@/ui/components/product-grid/GridAside";
import { fireEvent, render, screen } from "@testing-library/react";

const mockProductList: Product[] = createTestProductList();
const filteredMockList: Product[] = mockProductList.filter((product) =>
    Object.values(product.stock).some((stockCount) => stockCount > 0)
); // parent would not pass list containing fully unstocked products

const mockSizeFiltersSetter = jest.fn();
const mockPriceFiltersSetter = jest.fn();

const renderGridAside = () => {
    render(
        <GridAside
            allCategoryProducts={filteredMockList}
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
                name: matchSizeLabel("s", 3),
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: matchSizeLabel("m", 2),
            })
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: matchSizeLabel("xs", 0),
            })
        ).not.toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: matchSizeLabel("l", 0),
            })
        ).not.toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: matchSizeLabel("xl", 0),
            })
        ).not.toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: matchSizeLabel("xxl", 0),
            })
        ).not.toBeInTheDocument();
    });

    it("shows correct number of price filters", () => {
        renderGridAside();

        expect(
            screen.getByRole("button", {
                name: matchPriceRangeLabel("b", 2),
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: matchPriceRangeLabel("e", 1),
            })
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: matchPriceRangeLabel("a", 0),
            })
        ).not.toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: matchPriceRangeLabel("c", 0),
            })
        ).not.toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: matchPriceRangeLabel("d", 0),
            })
        ).not.toBeInTheDocument();
    });

    it("toggles a size filter on when clicked", () => {
        const initialSizeFilters: Sizes[] = [];

        const { rerender } = render(
            <GridAside
                allCategoryProducts={filteredMockList}
                sizeFilters={initialSizeFilters}
                setSizeFilters={mockSizeFiltersSetter}
                priceFilters={[]}
                setPriceFilters={mockPriceFiltersSetter}
            />
        );

        const sizeButton = screen.getByRole("button", {
            name: matchSizeLabel("s", 3),
        });

        expect(sizeButton).not.toHaveClass("border-black");

        fireEvent.click(sizeButton);

        const updateFunc = mockSizeFiltersSetter.mock.calls[0][0];
        const updateResult = updateFunc(initialSizeFilters);

        expect(updateResult).toEqual(["s"]);

        rerender(
            <GridAside
                allCategoryProducts={filteredMockList}
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
                allCategoryProducts={filteredMockList}
                sizeFilters={initialSizeFilters}
                setSizeFilters={mockSizeFiltersSetter}
                priceFilters={[]}
                setPriceFilters={mockPriceFiltersSetter}
            />
        );

        const sizeButton = screen.getByRole("button", {
            name: matchSizeLabel("s", 3),
        });

        expect(sizeButton).toHaveClass("border-black");

        fireEvent.click(sizeButton);

        const toggleOffFunc = mockSizeFiltersSetter.mock.calls[0][0];
        const toggleOffResult = toggleOffFunc(initialSizeFilters);

        rerender(
            <GridAside
                allCategoryProducts={filteredMockList}
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
                allCategoryProducts={filteredMockList}
                sizeFilters={[]}
                setSizeFilters={mockSizeFiltersSetter}
                priceFilters={initialPriceFilters}
                setPriceFilters={mockPriceFiltersSetter}
            />
        );

        const priceRangeBtn = screen.getByRole("button", {
            name: matchPriceRangeLabel("b", 2),
        });

        expect(priceRangeBtn).not.toHaveClass("border-black");

        fireEvent.click(priceRangeBtn);

        const updateFunc = mockPriceFiltersSetter.mock.calls[0][0];
        const updateResult = updateFunc(initialPriceFilters);

        rerender(
            <GridAside
                allCategoryProducts={filteredMockList}
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
                allCategoryProducts={filteredMockList}
                sizeFilters={[]}
                setSizeFilters={mockSizeFiltersSetter}
                priceFilters={initialPriceFilters}
                setPriceFilters={mockPriceFiltersSetter}
            />
        );

        const sizeButton = screen.getByRole("button", {
            name: matchPriceRangeLabel("b", 2),
        });

        expect(sizeButton).toHaveClass("border-black");

        fireEvent.click(sizeButton);

        const toggleOffFunc = mockPriceFiltersSetter.mock.calls[0][0];
        const toggleOffResult = toggleOffFunc(initialPriceFilters);

        rerender(
            <GridAside
                allCategoryProducts={filteredMockList}
                sizeFilters={[]}
                setSizeFilters={mockSizeFiltersSetter}
                priceFilters={toggleOffResult}
                setPriceFilters={mockPriceFiltersSetter}
            />
        );

        expect(toggleOffResult).toEqual([]);
        expect(sizeButton).not.toHaveClass("border-black");
    });
});
