import { Prisma } from "@prisma/client";
import { getProducts } from "./actions";
import { Categories, PriceFilterId, ProductSortId, Sizes } from "./types";
import { PRICE_FILTER_OPTIONS, SORT_OPTIONS } from "./constants";

export async function getFilteredProducts({
    category,
    sizeFilters = [],
    priceFilters = [],
    productSort,
    query,
}: {
    category: Categories | "all";
    sizeFilters?: Sizes[];
    priceFilters?: PriceFilterId[];
    productSort?: ProductSortId | "placeholder";
    query?: string;
}) {
    const filterQuery: Prisma.ProductWhereInput = {
        stock: {
            some: {
                quantity: { gt: 0 },
            },
        },
    };

    if (category !== "all") {
        filterQuery.gender = category as Categories;
    }

    if (sizeFilters.length > 0 && filterQuery.stock) {
        filterQuery.stock.some = {
            ...filterQuery.stock.some,
            size: { in: sizeFilters },
        };
    }

    if (priceFilters.length > 0) {
        filterQuery.OR = priceFilters.map((filterId) => {
            const { min, max } = PRICE_FILTER_OPTIONS[filterId];
            return isFinite(max) ? { price: { gte: min, lt: max } } : { price: { gte: min } };
        });
    }

    if (query) {
        filterQuery.name = { contains: query, mode: "insensitive" };
    }

    const orderBy =
        productSort && productSort !== "placeholder" ? SORT_OPTIONS[productSort].sort : undefined;

    const productsFetch = await getProducts(filterQuery, orderBy);

    return productsFetch.data;
}
