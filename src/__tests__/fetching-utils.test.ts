import { Categories, PriceFilterId, ProductSortId, Sizes } from "@/lib/types";

jest.mock("@/lib/actions", () => ({
    getManyProducts: jest.fn(),
}));

import { getManyProducts } from "@/lib/actions";
import { getFilteredProducts } from "@/lib/fetching-utils";
import { buildTestProductList } from "@/lib/test-factories";

describe("getFilteredProducts", () => {
    beforeEach(() => {
        const productList = buildTestProductList();
        (getManyProducts as jest.Mock).mockResolvedValue({ data: productList });
    });

    it("calls at least with a basic stock filter", async () => {
        const category: Categories | "all" = "all";

        await getFilteredProducts({ category });
        expect(getManyProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    stock: {
                        some: {
                            quantity: {
                                gt: 0,
                            },
                        },
                    },
                },
                orderBy: undefined,
            })
        );
    });

    it("calls with the expected category argument", async () => {
        const category: Categories | "all" = "mens";

        await getFilteredProducts({ category });
        expect(getManyProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    stock: {
                        some: {
                            quantity: {
                                gt: 0,
                            },
                        },
                    },
                    gender: "mens",
                },
                orderBy: undefined,
            })
        );
    });

    it("calls with the expected sizeFilters argument", async () => {
        const category: Categories | "all" = "all";
        const sizeFilters: Sizes[] = ["m"];

        await getFilteredProducts({ category, sizeFilters });
        expect(getManyProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    stock: {
                        some: {
                            quantity: {
                                gt: 0,
                            },
                            size: { in: ["m"] },
                        },
                    },
                },
                orderBy: undefined,
            })
        );
    });

    it("calls with the expected priceFilters argument", async () => {
        const category: Categories | "all" = "all";
        const priceFilters: PriceFilterId[] = ["a", "e"];

        await getFilteredProducts({ category, priceFilters });
        expect(getManyProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
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
                },
                orderBy: undefined,
            })
        );
    });

    it("calls with the expected query argument", async () => {
        const category: Categories | "all" = "all";
        const query = "test";

        await getFilteredProducts({ category, query });
        expect(getManyProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    stock: {
                        some: {
                            quantity: {
                                gt: 0,
                            },
                        },
                    },
                    name: { contains: "test", mode: "insensitive" },
                },
                orderBy: undefined,
            })
        );
    });

    it("calls with the expected productSort argument", async () => {
        const category: Categories | "all" = "all";
        const productSort: ProductSortId = "a";

        await getFilteredProducts({ category, productSort });
        expect(getManyProducts).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    stock: {
                        some: {
                            quantity: {
                                gt: 0,
                            },
                        },
                    },
                },
                orderBy: { price: "asc" },
            })
        );
    });
});
