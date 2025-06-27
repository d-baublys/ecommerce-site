import { Prisma } from "../../generated/prisma";
import { getProductData } from "./actions";
import {
    Categories,
    PRICE_FILTER_OPTIONS,
    PriceFilterKey,
    ProductSortKey,
    Sizes,
    SORT_OPTIONS,
} from "./definitions";

export async function fetchFilteredProducts({
    category,
    sizeFilters = [],
    priceFilters = [],
    productSort,
    query,
}: {
    category: Categories | "all";
    sizeFilters?: Sizes[];
    priceFilters?: string[];
    productSort?: ProductSortKey | "placeholder";
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
        filterQuery.OR = priceFilters.map((key) => {
            const { min, max } = PRICE_FILTER_OPTIONS[key as PriceFilterKey];
            return isFinite(max) ? { price: { gte: min, lt: max } } : { price: { gte: min } };
        });
    }

    if (query) {
        filterQuery.name = { contains: query, mode: "insensitive" };
    }

    const orderBy =
        productSort && productSort !== "placeholder" ? SORT_OPTIONS[productSort].sort : undefined;

    const productsFetch = await getProductData(filterQuery, orderBy);

    return productsFetch.data;
}
