import { OrderStatus, Prisma, Sizes as PrismaSizes } from "@prisma/client";
import {
    CypressTestProductData,
    Sizes,
    Categories,
    BagItem,
    Order,
    PrismaOrderNoStock,
    Product,
} from "./types";
import { convertClientProduct, processDateForClient, slugify } from "./utils";
import { VALID_CATEGORIES } from "./constants";

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
        gender: VALID_CATEGORIES[0].key,
        price: 2500,
        slug: slugify(name),
        src: `/nonexistent-img-${idx}.jpg`,
        alt: `Test product image ${idx}`,
        dateAdded: processDateForClient(),
        stock: { s: 8, m: 3, l: 12 },
        ...overrides,
    };
}

export function createFakeProductList(): Product[] {
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
    overrides?: Partial<Order>;
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

type FakeOrderParams = FakeOrderFull | FakeOrderSimple;

type FakeOrderObjBaseParams = FakeOrderBase & {
    idx?: number;
    productList?: Product[];
    sizesArr?: Sizes[];
    quantitiesArr?: number[];
};

type FakeOrderObjClientParams = FakeOrderObjBaseParams & { variant: "client" };
type FakeOrderObjPrismaParams = FakeOrderObjBaseParams & { variant: "prisma" };

function getFakeOrderObj(inputs: FakeOrderObjClientParams): Order;
function getFakeOrderObj(inputs: FakeOrderObjPrismaParams): PrismaOrderNoStock;
function getFakeOrderObj(inputs: FakeOrderObjClientParams | FakeOrderObjPrismaParams) {
    const { variant, idx = 0, productList, sizesArr, quantitiesArr, overrides } = inputs;
    const products: Product[] | undefined = productList ? productList : [createFakeProduct()];
    const items = products.map((product, prodIdx) => ({
        name: product.name,
        price: product.price,
        id: `order-${idx}-${prodIdx}`,
        productId: product.id,
        size: productList && sizesArr ? sizesArr[prodIdx] : "m",
        quantity: productList && quantitiesArr ? quantitiesArr[prodIdx] : 2,
        orderId: idx,
        product: variant === "prisma" ? convertClientProduct(product) : product,
    }));

    const dataObj = {
        id: idx,
        subTotal: 5000,
        shippingTotal: 500,
        total: 5500,
        status: "paid" as OrderStatus,
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

    if (dataObj.status === "pendingReturn" && !dataObj.returnRequestedAt) {
        throw new Error("Missing 'return requested date' for 'pending return' status");
    }

    if (dataObj.status === "refunded" && !(dataObj.returnRequestedAt && dataObj.refundedAt)) {
        throw new Error(
            "Missing 'return requested date' and 'refunded date' for 'refunded' status"
        );
    }

    return dataObj;
}

export function createFakeOrderClient({
    idx = 0,
    productList,
    sizesArr,
    quantitiesArr,
    overrides,
}: FakeOrderParams = {}): Order {
    return getFakeOrderObj({
        variant: "client",
        idx,
        productList,
        sizesArr,
        quantitiesArr,
        overrides,
    });
}

export function createFakeOrderPrisma({
    idx = 0,
    productList,
    sizesArr,
    quantitiesArr,
    overrides,
}: FakeOrderParams = {}): PrismaOrderNoStock {
    return getFakeOrderObj({
        variant: "prisma",
        idx,
        productList,
        sizesArr,
        quantitiesArr,
        overrides,
    });
}
export function createFakeOrderList({ variant }: { variant: "client" }): Order[];
export function createFakeOrderList({ variant }: { variant: "prisma" }): PrismaOrderNoStock[];
export function createFakeOrderList({
    variant,
}: {
    variant: "prisma" | "client";
}): (Order | PrismaOrderNoStock)[] {
    const productList = createFakeProductList();
    const firstOrderList = productList.slice(0, 3);
    const secondOrderList = productList.slice(3);

    const productLists = [firstOrderList, secondOrderList];
    const sizesArr: Sizes[][] = [["m", "l", "m"], ["l"]];
    const quantitiesArr: number[][] = [[2, 1, 1], [1]];

    return Array.from({ length: 2 }).map((_, orderIdx) =>
        variant === "client"
            ? createFakeOrderClient({
                  idx: orderIdx,
                  productList: productLists[orderIdx],
                  sizesArr: sizesArr[orderIdx],
                  quantitiesArr: quantitiesArr[orderIdx],
              })
            : createFakeOrderPrisma({
                  idx: orderIdx,
                  productList: productLists[orderIdx],
                  sizesArr: sizesArr[orderIdx],
                  quantitiesArr: quantitiesArr[orderIdx],
              })
    );
}

export type FakeOrderCypressParams = {
    productsDataArr: CypressTestProductData[];
    idx?: number;
    sizesArr?: PrismaSizes[];
    quantitiesArr?: number[];
    overrides?: Partial<Prisma.OrderUncheckedCreateInput>;
};

export function createFakeOrderCypress({
    idx = 0,
    productsDataArr,
    sizesArr,
    quantitiesArr,
    overrides,
}: FakeOrderCypressParams): Prisma.OrderUncheckedCreateInput {
    let subTotal = 0;
    const shippingTotal = 500;

    const items = productsDataArr.map((product, prodIdx) => {
        const price = product.price;
        const quantity: number = quantitiesArr ? quantitiesArr[prodIdx] : 2;
        subTotal += price * quantity;
        return {
            productId: String(product.id),
            name: product.name,
            price,
            size: sizesArr ? sizesArr[prodIdx] : ("m" as PrismaSizes),
            quantity,
        };
    });

    const dataObj = {
        subTotal,
        shippingTotal,
        total: subTotal + shippingTotal,
        status: "paid" as OrderStatus,
        userId: 1,
        email: "test@example.com",
        createdAt: new Date("2025-08-01"),
        sessionId: `sessionId-${idx}`,
        paymentIntentId: `paymentIntentId-${idx}`,
        items: { create: items },
        ...overrides,
    };

    if (dataObj.status === "pendingReturn" && !dataObj.returnRequestedAt) {
        throw new Error("Missing 'return requested date' for 'pending return' status");
    }

    if (dataObj.status === "refunded" && !(dataObj.returnRequestedAt && dataObj.refundedAt)) {
        throw new Error(
            "Missing 'return requested date' and 'refunded date' for 'refunded' status"
        );
    }

    return dataObj;
}
