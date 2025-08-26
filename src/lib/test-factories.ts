import { OrderStatus, Sizes as PrismaSizes } from "@prisma/client";
import {
    OrderData,
    CypressSeedTestProduct,
    Product,
    Sizes,
    VALID_CATEGORIES,
    Categories,
    BagItem,
} from "./definitions";
import { convertClientProduct, processDateForClient, slugify } from "./utils";

export function createFakeProduct({
    idx = 0,
    overrides,
}: {
    idx?: number;
    overrides?: Partial<Product>;
} = {}): Product {
    idx += 1;
    const name = `Test Product ${idx}`;

    return {
        id: `test-id-${idx}`,
        name,
        gender: Object.keys(VALID_CATEGORIES)[0] as keyof typeof VALID_CATEGORIES,
        price: 2500,
        slug: slugify(name),
        src: `/nonexistent-img-${idx}.jpg`,
        alt: `Test product image ${idx}`,
        dateAdded: processDateForClient(),
        stock: { s: 8, m: 3, l: 12 },
        ...overrides,
    };
}

export function createFakeProductList() {
    const prices = [5500, 9900, 20100, 15000];
    const stocks = [
        { s: 1, m: 0, l: 0 },
        { s: 1, m: 1, l: 0 },
        { s: 1, m: 1, l: 0 },
        { s: 0, m: 0, l: 0 },
    ];
    const products = Array.from({ length: 4 }).map((_, idx) =>
        createFakeProduct({ idx, overrides: { price: prices[idx], stock: stocks[idx] } })
    );

    return products;
}

export function createLongProductList(): Product[] {
    return Array.from({ length: 10 }).map((_, idx) => createFakeProduct({ idx }));
}

export function getFilteredFakeProducts() {
    return createFakeProductList().filter((product) =>
        Object.values(product.stock).some((stockCount) => stockCount > 0)
    ); // in line with real database fetch excluding fully unstocked products
}

function createCustomBagItem(product: Product, size: Sizes, quantity: number): BagItem {
    return { product, size, quantity };
}

export function createFakeBagItems(): BagItem[] {
    const prices = [5500, 9900];
    const stocks = [
        { s: 1, m: 0, l: 0 },
        { s: 1, m: 3, l: 0 },
    ];
    const validCategories = Object.keys(VALID_CATEGORIES);
    const categories = [validCategories[0], validCategories[1]];
    const sizes = ["s", "m"];
    const quantities = [1, 2];

    const products = Array.from({ length: 2 }).map((_, idx) =>
        createFakeProduct({
            idx,
            overrides: {
                price: prices[idx],
                gender: categories[idx] as Categories,
                stock: stocks[idx],
            },
        })
    );

    const bagItems = Array.from({ length: 2 }).map((_, idx) =>
        createCustomBagItem(products[idx], sizes[idx] as Sizes, quantities[idx])
    );

    return bagItems;
}

export function getFakeUpdatedData(): Product[] {
    const prices = [5500, 9900];
    const validCategories = Object.keys(VALID_CATEGORIES);
    const categories = [validCategories[0], validCategories[1]];
    const stocks = [
        { s: 1, m: 0, l: 0 },
        { s: 1, m: 1, l: 0 },
    ];

    const products = Array.from({ length: 2 }).map((_, idx) =>
        createFakeProduct({
            idx: idx,
            overrides: {
                price: prices[idx],
                gender: categories[idx] as Categories,
                stock: stocks[idx],
            },
        })
    );

    return products;
}

type FakeOrderBase = {
    idx?: number;
    overrides?: Partial<Omit<OrderData, "items">>;
};

type FakeOrderNever = {
    productList?: never;
    sizesArr?: never;
    quantitiesArr?: never;
};

type FakeOrderSimple = FakeOrderBase & FakeOrderNever;

type FakeOrderFull = FakeOrderBase & {
    idx: number;
    productList: Product[];
    sizesArr: Sizes[];
    quantitiesArr: number[];
};

export function createFakeOrder({
    idx = 0,
    productList,
    sizesArr,
    quantitiesArr,
    overrides,
}: FakeOrderSimple | FakeOrderFull = {}): OrderData {
    const products: Product[] = productList ? productList : [createFakeProduct()];
    const items: OrderData["items"] = products.map((product, prodIdx) => ({
        name: product.name,
        price: product.price,
        id: `order-${idx}-${prodIdx}`,
        productId: product.id,
        size: productList && sizesArr ? sizesArr[prodIdx] : "m",
        quantity: productList && quantitiesArr ? quantitiesArr[prodIdx] : 2,
        orderId: idx,
        product: convertClientProduct(product),
    }));

    return {
        id: idx,
        subTotal: 5000,
        shippingTotal: 500,
        total: 5500,
        status: "paid",
        userId: 1,
        email: "test@example.com",
        createdAt: new Date("2025-08-01"),
        returnRequestedAt: null,
        refundedAt: null,
        sessionId: `sessionId-${idx}`,
        paymentIntentId: `paymentIntentId-${idx}`,
        items,
        ...overrides,
    };
}

export function createFakeOrderList(): OrderData[] {
    const productList = createFakeProductList();
    const firstOrderList = productList.slice(0, 3);
    const secondOrderList = productList.slice(3);

    const productLists = [firstOrderList, secondOrderList];
    const sizesArr: Sizes[][] = [["m", "l", "m"], ["l"]];
    const quantitiesArr: number[][] = [[2, 1, 1], [1]];

    return Array.from({ length: 2 }).map((_, orderIdx) =>
        createFakeOrder({
            idx: orderIdx,
            productList: productLists[orderIdx],
            sizesArr: sizesArr[orderIdx],
            quantitiesArr: quantitiesArr[orderIdx],
        })
    );
}

export function createFakeOrderCypress({
    idx = 0,
    productsDataArr,
    sizesArr,
    quantitiesArr,
}: {
    idx?: number;
    productsDataArr: CypressSeedTestProduct[];
    sizesArr?: PrismaSizes[];
    quantitiesArr?: number[];
}) {
    const items = productsDataArr.map((product, prodIdx) => ({
        productId: String(product.id),
        name: product.name,
        price: product.price,
        size: sizesArr ? sizesArr[prodIdx] : ("m" as PrismaSizes),
        quantity: quantitiesArr ? quantitiesArr[prodIdx] : 2,
    }));

    return {
        subTotal: 5000,
        shippingTotal: 500,
        total: 5500,
        status: "paid" as OrderStatus,
        userId: 1,
        email: "test@example.com",
        createdAt: new Date("2025-08-01"),
        sessionId: `sessionId-${idx}`,
        paymentIntentId: `paymentIntentId-${idx}`,
        items: { create: items },
    };
}
