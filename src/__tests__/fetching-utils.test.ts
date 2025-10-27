import { Categories, PriceFilterId, ProductSortId, Sizes } from "@/lib/types";

jest.mock("@/lib/actions", () => ({
    getProducts: jest.fn(),
}));

import { getProducts } from "@/lib/actions";
import { fetchFilteredProducts } from "@/lib/fetching-utils";
import { buildTestProductList } from "@/lib/test-factories";

describe("fetchFilteredProducts", () => {
    beforeEach(() => {
        const productList = buildTestProductList();
        (getProducts as jest.Mock).mockResolvedValue({ data: productList });
    });

    it("calls at least with a basic stock filter", async () => {
        const category: Categories | "all" = "all";

        await fetchFilteredProducts({ category });
        expect(getProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                stock: {
                    some: {
                        quantity: {
                            gt: 0,
                        },
                    },
                },
            }),
            undefined
        );
    });

    it("calls with the expected category argument", async () => {
        const category: Categories | "all" = "mens";

        await fetchFilteredProducts({ category });
        expect(getProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                stock: {
                    some: {
                        quantity: {
                            gt: 0,
                        },
                    },
                },
                gender: "mens",
            }),
            undefined
        );
    });

    it("calls with the expected sizeFilters argument", async () => {
        const category: Categories | "all" = "all";
        const sizeFilters: Sizes[] = ["m"];

        await fetchFilteredProducts({ category, sizeFilters });
        expect(getProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                stock: {
                    some: {
                        quantity: {
                            gt: 0,
                        },
                        size: { in: ["m"] },
                    },
                },
            }),
            undefined
        );
    });

    it("calls with the expected priceFilters argument", async () => {
        const category: Categories | "all" = "all";
        const priceFilters: PriceFilterId[] = ["a", "e"];

        await fetchFilteredProducts({ category, priceFilters });
        expect(getProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                stock: {
                    some: {
                        quantity: {
                            gt: 0,
                        },
                    },
                },
                OR: [
                    {
                        price: { gte: 0, lt: 5000 },
                    },
                    {
                        price: { gte: 20000 },
                    },
                ],
            }),
            undefined
        );
    });

    it("calls with the expected query argument", async () => {
        const category: Categories | "all" = "all";
        const query = "test";

        await fetchFilteredProducts({ category, query });
        expect(getProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                stock: {
                    some: {
                        quantity: {
                            gt: 0,
                        },
                    },
                },
                name: { contains: "test", mode: "insensitive" },
            }),
            undefined
        );
    });

    it("calls with the expected productSort argument", async () => {
        const category: Categories | "all" = "all";
        const productSort: ProductSortId = "a";

        await fetchFilteredProducts({ category, productSort });
        expect(getProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                stock: {
                    some: {
                        quantity: {
                            gt: 0,
                        },
                    },
                },
            }),
            { price: "asc" }
        );
    });
});
