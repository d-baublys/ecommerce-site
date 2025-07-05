import React from "react";
import {
    BagItem,
    Categories,
    PRICE_FILTER_OPTIONS,
    PriceFilterKey,
    Product,
    Sizes,
    VALID_CATEGORIES,
} from "./definitions";
import { processDateForClient, slugify } from "./utils";

export function createFakeProduct({
    idx = 0,
    overrides,
}: {
    idx?: number;
    overrides?: Partial<Product>;
} = {}): Product {
    idx += 1;
    const name = `Test Product ${idx}`;

    return {
        id: `test-id-${idx}`,
        name,
        gender: Object.keys(VALID_CATEGORIES)[0] as keyof typeof VALID_CATEGORIES,
        price: 2500,
        slug: slugify(name),
        src: `/nonexistent-img-${idx}.jpg`,
        alt: `Test product image ${idx}`,
        dateAdded: processDateForClient(),
        stock: { s: 8, m: 3, l: 12 },
        ...overrides,
    };
}

export function createFakeProductList() {
    const prices = [5500, 9900, 20100, 15000];
    const stocks = [
        { s: 1, m: 0, l: 0 },
        { s: 1, m: 1, l: 0 },
        { s: 1, m: 1, l: 0 },
        { s: 0, m: 0, l: 0 },
    ];
    const products = Array.from({ length: 4 }).map((_, idx) =>
        createFakeProduct({ idx, overrides: { price: prices[idx], stock: stocks[idx] } })
    );

    return products;
}

export function createLongProductList(): Product[] {
    return Array.from({ length: 10 }).map((_, idx) => createFakeProduct({ idx }));
}

export function getFilteredFakeProducts() {
    return createFakeProductList().filter((product) =>
        Object.values(product.stock).some((stockCount) => stockCount > 0)
    ); // in line with real database fetch excluding fully unstocked products
}

function createCustomBagItem(product: Product, size: Sizes, quantity: number): BagItem {
    return { product, size, quantity };
}

export function createFakeBagItems(): BagItem[] {
    const prices = [5500, 9900];
    const stocks = [
        { s: 1, m: 0, l: 0 },
        { s: 1, m: 3, l: 0 },
    ];
    const validCategories = Object.keys(VALID_CATEGORIES);
    const categories = [validCategories[0], validCategories[1]];
    const sizes = ["s", "m"];
    const quantities = [1, 2];

    const products = Array.from({ length: 2 }).map((_, idx) =>
        createFakeProduct({
            idx,
            overrides: {
                price: prices[idx],
                gender: categories[idx] as Categories,
                stock: stocks[idx],
            },
        })
    );

    const bagItems = Array.from({ length: 2 }).map((_, idx) =>
        createCustomBagItem(products[idx], sizes[idx] as Sizes, quantities[idx])
    );

    return bagItems;
}

export function getFakeUpdatedData(): Product[] {
    const prices = [5500, 9900];
    const validCategories = Object.keys(VALID_CATEGORIES);
    const categories = [validCategories[0], validCategories[1]];
    const stocks = [
        { s: 1, m: 0, l: 0 },
        { s: 1, m: 1, l: 0 },
    ];

    const products = Array.from({ length: 2 }).map((_, idx) =>
        createFakeProduct({
            idx: idx,
            overrides: {
                price: prices[idx],
                gender: categories[idx] as Categories,
                stock: stocks[idx],
            },
        })
    );

    return products;
}

class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: Error | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: null };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div data-testid="error-container">
                    <p>Error caught by boundary</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export function wrapWithErrorBoundary(children: React.ReactNode) {
    return <ErrorBoundary>{children}</ErrorBoundary>;
}

export function matchSizeLabel(size: Sizes, count: number) {
    return new RegExp(`${size.toUpperCase()}\\s\\(${count}\\)`);
}

export function matchPriceRangeLabel(filterKey: PriceFilterKey, count: number) {
    const pattern = isFinite(PRICE_FILTER_OPTIONS[filterKey].max)
        ? `[£$€]?${PRICE_FILTER_OPTIONS[filterKey].min / 100}-[£$€]?${
              PRICE_FILTER_OPTIONS[filterKey].max / 100 - 1
          }\\s\\(${count}\\)`
        : `Over\\s[£$€]?${PRICE_FILTER_OPTIONS[filterKey].min / 100}\\s\\(${count}\\)`;

    return new RegExp(pattern);
}

export function getConsoleErrorSpy() {
    return jest.spyOn(console, "error").mockImplementation(() => {});
}
