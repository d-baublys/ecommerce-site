export type Sizes = "xs" | "s" | "m" | "l" | "xl" | "xxl";

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
