export const VALID_SIZES = ["xs", "s", "m", "l", "xl", "xxl"] as const;

export type Sizes = (typeof VALID_SIZES)[number];

export type Product = {
    id: string;
    name: string;
    gender: "mens" | "womens";
    price: number;
    slug: string;
    src: string;
    alt: string;
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

export type InventoryMode = "display" | "edit" | "add";
