export const PRODUCT_BASE_FIELDS = {
    id: "",
    name: "",
    gender: "" as Categories,
    price: 0,
    slug: "",
    src: "",
    alt: "",
};

export const VALID_SIZES = ["xs", "s", "m", "l", "xl", "xxl"] as const;

export const VALID_CATEGORIES = { mens: "Men's", womens: "Women's" } as const;

export type ProductBase = typeof PRODUCT_BASE_FIELDS;

export type Product = ProductBase & {
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

export const priceFiltersOptions = {
    a: { min: 0, max: 5000 },
    b: { min: 5000, max: 10000 },
    c: { min: 10000, max: 15000 },
    d: { min: 15000, max: 20000 },
    e: { min: 20000, max: Infinity },
} as const;

export type PriceFilterKey = keyof typeof priceFiltersOptions;

export type PriceRange = (typeof priceFiltersOptions)[PriceFilterKey];
