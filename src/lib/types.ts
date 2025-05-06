type ProductBase = {
    id: string;
    name: string;
    price: number;
    slug: string;
    src: string;
    alt: string;
};

type MensSizes = "s" | "m" | "l" | "xl" | "xxl";
type WomensSizes = "xs" | "s" | "m" | "l" | "xl";

type MensStock = {
    [key in MensSizes]: number;
};

type WomensStock = {
    [key in WomensSizes]: number;
};

type MensProduct = ProductBase & {
    gender: "mens";
    stock: MensStock;
};

type WomensProduct = ProductBase & {
    gender: "womens";
    stock: WomensStock;
};

export type ProductType = MensProduct | WomensProduct;

type MensBagItem = {
    product: MensProduct;
    size: MensSizes;
    quantity: number;
};

type WomensBagItem = {
    product: WomensProduct;
    size: WomensSizes;
    quantity: number;
};

export type BagItem = MensBagItem | WomensBagItem;
