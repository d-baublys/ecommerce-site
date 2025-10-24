import {
    CypressTestProductData,
    Sizes,
    Categories,
    BagItem,
    Product,
    ClientProduct,
    ClientOrder,
    OrderCreateInput,
    OrderStatus,
} from "./types";
import { slugify } from "./utils";
import { VALID_CATEGORIES } from "./constants";

export function createTestProduct({
    idx = 0,
    overrides,
}: {
    idx?: number;
    overrides?: Partial<ClientProduct>;
} = {}): ClientProduct {
    idx += 1;
    const name = `Test Product ${idx}`;

    return {
        id: `aaaaaaaa-aaaa-1aaa-aaaa-aaaaaaaaaaa${idx}`,
        name,
        gender: VALID_CATEGORIES[0].key,
        price: 2500,
        slug: slugify(name),
        src: `/nonexistent-img-${idx}.jpg`,
        alt: `Test product image ${idx}`,
        dateAdded: new Date(),
        stock: { s: 8, m: 3, l: 12 },
        ...overrides,
    };
}

export function createTestProductList(): ClientProduct[] {
    const prices = [5500, 9900, 20100, 15000];
    const stocks = [
        { s: 1, m: 0, l: 0 },
        { s: 1, m: 1, l: 0 },
        { s: 1, m: 1, l: 0 },
        { s: 0, m: 0, l: 0 },
    ];
    const dates = ["2025-08-01", "2025-08-02", "2025-08-02", "2025-08-04"];
    const products = Array.from({ length: 4 }).map((_, idx) =>
        createTestProduct({
            idx,
            overrides: { price: prices[idx], stock: stocks[idx], dateAdded: new Date(dates[idx]) },
        })
    );

    return products;
}

export function createLongProductList(): Product[] {
    return Array.from({ length: 10 }).map((_, idx) => createTestProduct({ idx }));
}

export function getFilteredTestProducts() {
    return createTestProductList().filter((product) =>
        Object.values(product.stock).some((stockCount) => stockCount > 0)
    ); // in line with real database fetch excluding fully unstocked products
}

function createCustomBagItem(product: ClientProduct, size: Sizes, quantity: number): BagItem {
    return { product, size, quantity };
}

export function createTestBagItems(): BagItem[] {
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
        createTestProduct({
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

export function getTestUpdatedData(): ClientProduct[] {
    const prices = [5500, 9900];
    const validCategories = Object.keys(VALID_CATEGORIES);
    const categories = [validCategories[0], validCategories[1]];
    const stocks = [
        { s: 1, m: 0, l: 0 },
        { s: 1, m: 1, l: 0 },
    ];

    const products = Array.from({ length: 2 }).map((_, idx) =>
        createTestProduct({
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

type TestOrderBase = {
    idx?: number;
    overrides?: Partial<ClientOrder>;
};

type TestOrderNever = {
    productList?: never;
    sizesArr?: never;
    quantitiesArr?: never;
};

type TestOrderParamsSimple = TestOrderBase & TestOrderNever;

type TestOrderParamsFull = TestOrderBase & {
    idx: number;
    productList: Product[];
    sizesArr: Sizes[];
    quantitiesArr: number[];
};

type TestOrderParams = TestOrderParamsFull | TestOrderParamsSimple;

export function createTestOrder(params: TestOrderParams = {}): ClientOrder {
    const { idx = 0, productList, sizesArr, quantitiesArr, overrides } = params;
    const products: Product[] | undefined = productList ? productList : [createTestProduct()];
    const items = products.map((product, prodIdx) => ({
        name: product.name,
        price: product.price,
        id: `order-${idx}-${prodIdx}`,
        productId: product.id,
        size: productList && sizesArr ? sizesArr[prodIdx] : "m",
        quantity: productList && quantitiesArr ? quantitiesArr[prodIdx] : 2,
        orderId: idx,
        product,
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

export function createTestOrderList(): ClientOrder[] {
    const productList = createTestProductList();
    const firstOrderList = productList.slice(0, 3);
    const secondOrderList = productList.slice(3);

    const productLists = [firstOrderList, secondOrderList];
    const sizesArr: Sizes[][] = [["m", "l", "m"], ["l"]];
    const quantitiesArr: number[][] = [[2, 1, 1], [1]];

    return Array.from({ length: 2 }).map((_, orderIdx) =>
        createTestOrder({
            idx: orderIdx,
            productList: productLists[orderIdx],
            sizesArr: sizesArr[orderIdx],
            quantitiesArr: quantitiesArr[orderIdx],
        })
    );
}

export type TestOrderCypressParams = {
    productsDataArr: CypressTestProductData[];
    idx?: number;
    sizesArr?: Sizes[];
    quantitiesArr?: number[];
    overrides?: Partial<OrderCreateInput>;
};

export function createTestOrderCypress({
    idx = 0,
    productsDataArr,
    sizesArr,
    quantitiesArr,
    overrides,
}: TestOrderCypressParams): OrderCreateInput {
    let subTotal = 0;
    const shippingTotal = 500;

    const items: OrderCreateInput["items"] = productsDataArr.map((product, prodIdx) => {
        const price = product.price;
        const quantity: number = quantitiesArr ? quantitiesArr[prodIdx] : 2;
        subTotal += price * quantity;
        return {
            productId: String(product.id),
            name: product.name,
            price,
            size: sizesArr ? sizesArr[prodIdx] : ("m" as Sizes),
            quantity,
        };
    });

    const dataObj = {
        subTotal,
        shippingTotal,
        total: subTotal + shippingTotal,
        status: "paid" as OrderStatus,
        user: { connect: { id: 1 } },
        email: "test@example.com",
        createdAt: new Date("2025-08-01"),
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
