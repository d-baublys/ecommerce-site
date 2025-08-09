import { Prisma } from "@prisma/client";

export const PRODUCT_BASE_FIELDS = {
    name: "",
    gender: "" as Categories,
    price: 0,
    slug: "",
    src: "",
    alt: "",
    dateAdded: "",
};

export const VALID_SIZES = ["xs", "s", "m", "l", "xl", "xxl"] as const;

export const VALID_CATEGORIES = { mens: "Men's", womens: "Women's" } as const;

export type ProductBase = typeof PRODUCT_BASE_FIELDS;

export type Product = ProductBase & {
    id: string;
    stock: Partial<Record<Sizes, number>>;
};

export type Sizes = (typeof VALID_SIZES)[number];

export type Categories = keyof typeof VALID_CATEGORIES;

export type BagItem = {
    product: Product;
    size: Sizes;
    quantity: number;
};

export type MergedBagItem = BagItem & { latestSizeStock: number };

export type ItemMetadata = {
    productId: string;
    name: string;
    price: number;
    size: Sizes;
    quantity: number;
};

export type OrderStatus = "paid" | "refunded";

export type ProductFormMode = "add" | "edit";

export type StockTableMode = ProductFormMode | "display";

export const PRICE_FILTER_OPTIONS = {
    a: { min: 0, max: 5000 },
    b: { min: 5000, max: 10000 },
    c: { min: 10000, max: 15000 },
    d: { min: 15000, max: 20000 },
    e: { min: 20000, max: Infinity },
};

export type PriceFilterKey = keyof typeof PRICE_FILTER_OPTIONS;

export const SORT_OPTIONS = {
    a: { sort: { price: "asc" as Prisma.SortOrder }, displayName: "Price (Low to High)" },
    b: { sort: { price: "desc" as Prisma.SortOrder }, displayName: "Price (High to Low)" },
    c: { sort: { dateAdded: "desc" as Prisma.SortOrder }, displayName: "Newest" },
};

export type ProductSortKey = keyof typeof SORT_OPTIONS;

export const FEATURED_COUNT = 5;

export const USER_ROLES = ["admin", "user"] as const;

export type UserRoleOptions = (typeof USER_ROLES)[number];

export type SearchBarConfig = {
    isGlobalSearch: boolean;
    showSuggestions: boolean;
    placeholderText?: string;
};

export class CredentialsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CredentialsError";
    }
}
