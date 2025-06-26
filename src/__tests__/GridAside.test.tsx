import { PRICE_FILTER_OPTIONS, PriceFilterKey, Product, Sizes } from "@/lib/definitions";
import { createTestProductList } from "@/lib/test-utils";
import GridAside from "@/ui/components/product-grid/GridAside";
import { fireEvent, render, screen } from "@testing-library/react";

describe("GridAside", () => {
    const mockProductList: Product[] = createTestProductList();
    const filteredMockList: Product[] = mockProductList.filter((product) =>
        Object.values(product.stock).some((stockCount) => stockCount > 0)
    ); // parent would not pass list containing fully unstocked products

    const renderGridAside = () => {
        render(
            <GridAside
                allCategoryProducts={filteredMockList}
                sizeFilters={[]}
                setSizeFilters={jest.fn()}
                priceFilters={[]}
                setPriceFilters={jest.fn()}
            />
        );
    };

    const matchSizeLabel = (size: Sizes, count: number) => {
        return new RegExp(`${size.toUpperCase()}\\s\\(${count}\\)`);
    };

    const matchPriceRangeLabel = (filterKey: PriceFilterKey, count: number) => {
        const pattern = isFinite(PRICE_FILTER_OPTIONS[filterKey].max)
            ? `[£$€]?${PRICE_FILTER_OPTIONS[filterKey].min / 100}-[£$€]?${
                  PRICE_FILTER_OPTIONS[filterKey].max / 100 - 1
              }\\s\\(${count}\\)`
            : `Over\\s[£$€]?${PRICE_FILTER_OPTIONS[filterKey].min / 100}\\s\\(${count}\\)`;

        return new RegExp(pattern);
    };

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
        const mockSizeFiltersSetter = jest.fn();
        const initialSizeFilters: Sizes[] = [];

        render(
            <GridAside
                allCategoryProducts={filteredMockList}
                sizeFilters={initialSizeFilters}
                setSizeFilters={mockSizeFiltersSetter}
                priceFilters={[]}
                setPriceFilters={jest.fn()}
            />
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: matchSizeLabel("s", 3),
            })
        );

        const updateFunc = mockSizeFiltersSetter.mock.calls[0][0];
        const updateResult = updateFunc(initialSizeFilters);

        expect(updateResult).toEqual(["s"]);
    });

    it("toggles an active size filter off when clicked", () => {
        const mockSizeFiltersSetter = jest.fn();
        const initialSizeFilters: Sizes[] = [];

        const { rerender } = render(
            <GridAside
                allCategoryProducts={filteredMockList}
                sizeFilters={initialSizeFilters}
                setSizeFilters={mockSizeFiltersSetter}
                priceFilters={[]}
                setPriceFilters={jest.fn()}
            />
        );

        const sizeButton = screen.getByRole("button", {
            name: matchSizeLabel("s", 3),
        });

        fireEvent.click(sizeButton);

        const toggleOnFunc = mockSizeFiltersSetter.mock.calls[0][0];
        const toggleOnResult = toggleOnFunc(initialSizeFilters);

        rerender(
            <GridAside
                allCategoryProducts={filteredMockList}
                sizeFilters={toggleOnResult}
                setSizeFilters={mockSizeFiltersSetter}
                priceFilters={[]}
                setPriceFilters={jest.fn()}
            />
        );

        fireEvent.click(sizeButton);

        const toggleOffFunc = mockSizeFiltersSetter.mock.calls[1][0];
        const toggleOffResult = toggleOffFunc(["s"]);

        expect(toggleOffResult).toEqual([]);
    });

    it("toggles a price filter on when clicked", () => {
        const mockPriceFiltersSetter = jest.fn();
        const initialPriceFilters: PriceFilterKey[] = [];

        render(
            <GridAside
                allCategoryProducts={filteredMockList}
                sizeFilters={[]}
                setSizeFilters={jest.fn()}
                priceFilters={initialPriceFilters}
                setPriceFilters={mockPriceFiltersSetter}
            />
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: matchPriceRangeLabel("b", 2),
            })
        );

        const updateFunc = mockPriceFiltersSetter.mock.calls[0][0];
        const updateResult = updateFunc(initialPriceFilters);

        expect(updateResult).toEqual(["b"]);
    });

    it("toggles an active price filter off when clicked", () => {
        const mockPriceFiltersSetter = jest.fn();
        const initialPriceFilters: PriceFilterKey[] = [];

        const { rerender } = render(
            <GridAside
                allCategoryProducts={filteredMockList}
                sizeFilters={[]}
                setSizeFilters={jest.fn()}
                priceFilters={initialPriceFilters}
                setPriceFilters={mockPriceFiltersSetter}
            />
        );

        const sizeButton = screen.getByRole("button", {
            name: matchPriceRangeLabel("b", 2),
        });

        fireEvent.click(sizeButton);

        const toggleOnFunc = mockPriceFiltersSetter.mock.calls[0][0];
        const toggleOnResult = toggleOnFunc(initialPriceFilters);

        rerender(
            <GridAside
                allCategoryProducts={filteredMockList}
                sizeFilters={[]}
                setSizeFilters={jest.fn()}
                priceFilters={toggleOnResult}
                setPriceFilters={mockPriceFiltersSetter}
            />
        );

        fireEvent.click(sizeButton);

        const toggleOffFunc = mockPriceFiltersSetter.mock.calls[1][0];
        const toggleOffResult = toggleOffFunc(["b"]);

        expect(toggleOffResult).toEqual([]);
    });
});
