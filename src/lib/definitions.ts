export const PRODUCT_BASE_FIELDS = {
    id: null as unknown as string,
    name: null as unknown as string,
    gender: null as unknown as Categories,
    price: null as unknown as number,
    slug: null as unknown as string,
    src: null as unknown as string,
    alt: null as unknown as string,
};

export const VALID_SIZES = ["xs", "s", "m", "l", "xl", "xxl"] as const;

export const VALID_CATEGORIES = ["mens", "womens"] as const;

export type Sizes = (typeof VALID_SIZES)[number];

export type Categories = (typeof VALID_CATEGORIES)[number];

export type ProductBase = {
    [K in keyof typeof PRODUCT_BASE_FIELDS]: (typeof PRODUCT_BASE_FIELDS)[K];
};

export type Product = ProductBase & {
    stock: Partial<Record<Sizes, number>>;
};

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

export const priceFiltersOptions = {
    a: { min: 0, max: 5000 },
    b: { min: 5000, max: 10000 },
    c: { min: 10000, max: 15000 },
    d: { min: 15000, max: 20000 },
    e: { min: 20000, max: Infinity },
} as const;

export type PriceFilterKey = keyof typeof priceFiltersOptions;

export type PriceRange = (typeof priceFiltersOptions)[PriceFilterKey];
