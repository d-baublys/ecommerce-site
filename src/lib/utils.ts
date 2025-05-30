import { Prisma, Stock } from "../../generated/prisma";
import { getProductData } from "./actions";
import {
    BagItem,
    Categories,
    PriceFilterKey,
    priceFiltersOptions,
    Product,
    PRODUCT_BASE_FIELDS,
    ProductBase,
    Sizes,
    VALID_CATEGORIES,
    VALID_SIZES,
} from "./definitions";

export function debounce<T extends (...args: unknown[]) => void>(func: T, delay: number) {
    let timer: ReturnType<typeof setTimeout>;
    return function (...args: Parameters<T>) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

export function getNetStock(productData: Product, productSize: Sizes, bag: BagItem[]) {
    const backendStock = productData.stock[productSize as keyof typeof productData.stock];

    const existing = bag.find(
        (bagItem) => bagItem.product.id === productData.id && bagItem.size === productSize
    );

    const bagQuantity = existing?.quantity ?? 0;

    return backendStock! - bagQuantity;
}

export function isValidSize(value: string): value is Sizes {
    return VALID_SIZES.includes(value as Sizes);
}

export function isUnique(value: string, stockObj: Product["stock"]) {
    return !Object.entries(stockObj).find(([size]) => size === value);
}

export function isValidStock(value: number) {
    return value >= 0;
}

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function isValidPrice(value: string) {
    return /^\d+(\.\d{1,2})?$/.test(value) && !isNaN(Number(value));
}

export function convertValidPrice(price: string) {
    return Math.round(Number(price) * 100);
}

export function stringifyConvertPrice(price: number) {
    return (price / 100).toFixed(2).toString();
}

export function slugify(name: string) {
    return name.toLowerCase().split(" ").join("-");
}

export function formatImagePath(filePath: string) {
    return `/${filePath}`;
}

export function createEmptyProduct(): Product {
    return {
        id: "",
        name: "",
        gender: VALID_CATEGORIES[0],
        price: 0,
        slug: "",
        src: "",
        alt: "",
        stock: {},
    };
}

export function containsClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) {
    const element = document.getElementById(id);
    return element ? element.contains(e.target as Node) : false;
}

export function areProductListsEqual(listA: Product[], listB: Product[]) {
    if (listA.length !== listB.length) return false;
    return listA.every((productA, idx) => productA.id === listB[idx].id);
}

function areStocksEqual(stockA: Product["stock"], stockB: Product["stock"]) {
    const keysA = Object.keys(stockA) as Sizes[];
    const keysB = Object.keys(stockB) as Sizes[];

    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => stockA[key] === stockB[key]);
}

export function areProductsEqual(productA: Product, productB: Product) {
    for (const key of Object.keys(productA) as (keyof Product)[]) {
        if (key === "stock") continue;

        if (productA[key] !== productB[key]) {
            return false;
        }
    }

    return areStocksEqual(productA.stock, productB.stock);
}

export function mapStockForDb(productData: Product) {
    return Object.entries(productData.stock).map(([size, quantity]) => ({
        productId: productData.id,
        size: size as Sizes,
        quantity,
    }));
}

export function buildStockObj(stock: Stock[]) {
    return stock.reduce((acc, stockItem) => {
        acc[stockItem.size] = stockItem.quantity;
        return acc;
    }, {} as Record<Sizes, number>);
}

export function extractProductFields(product: Product): ProductBase {
    const fields = {} as ProductBase;
    const keys = Object.keys(PRODUCT_BASE_FIELDS);
    for (const key of keys) {
        fields[key] = product[key as keyof ProductBase];
    }
    return fields;
}

export async function fetchFilteredProducts({
    category,
    sizeFilters = [],
    priceFilters = [],
}: {
    category: Categories;
    sizeFilters?: Sizes[];
    priceFilters?: string[];
}) {
    const filterQuery: Prisma.ProductWhereInput = {
        gender: category as Categories,
        stock: {
            some: {
                quantity: { gt: 0 },
            },
        },
    };

    if (sizeFilters.length > 0 && filterQuery.stock) {
        filterQuery.stock.some = {
            ...filterQuery.stock.some,
            size: { in: sizeFilters },
        };
    }

    if (priceFilters.length > 0) {
        filterQuery.OR = priceFilters.map((key) => {
            const { min, max } = priceFiltersOptions[key as PriceFilterKey];
            return { price: { gte: min, lt: max } };
        });
    }

    const productsFetch = await getProductData(filterQuery);

    if (!productsFetch.data) throw new Error("No products to display");

    return productsFetch.data;
}
