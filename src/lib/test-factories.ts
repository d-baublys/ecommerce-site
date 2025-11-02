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
    Order,
    OrderItem,
} from "./types";
import { buildBagItem, slugify } from "./utils";
import { VALID_CATEGORIES } from "./constants";

export function buildTestProduct({
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
        gender: VALID_CATEGORIES[0].id,
        price: 2500,
        slug: slugify(name),
        src: `/nonexistent-img-${idx}.jpg`,
        alt: `Test product image ${idx}`,
        dateAdded: new Date(),
        stock: { s: 8, m: 3, l: 12 },
        ...overrides,
    };
}

export function buildTestProductList(): ClientProduct[] {
    const prices = [5500, 9900, 20100, 15000];
    const stocks = [
        { s: 1, m: 0, l: 0 },
        { s: 1, m: 1, l: 0 },
        { s: 1, m: 1, l: 0 },
        { s: 0, m: 0, l: 0 },
    ];
    const dates = ["2025-08-01", "2025-08-02", "2025-08-02", "2025-08-04"];
    const products = Array.from({ length: 4 }).map((_, idx) =>
        buildTestProduct({
            idx,
            overrides: { price: prices[idx], stock: stocks[idx], dateAdded: new Date(dates[idx]) },
        })
    );

    return products;
}

export function buildLongProductList(): Product[] {
    return Array.from({ length: 10 }).map((_, idx) => buildTestProduct({ idx }));
}

export function getFilteredTestProducts() {
    return buildTestProductList().filter((product) =>
        Object.values(product.stock).some((stockCount) => stockCount > 0)
    ); // in line with real database fetch excluding fully unstocked products
}

function buildTestBagItem(product: ClientProduct, size: Sizes, quantity: number): BagItem {
    return { ...buildBagItem(product, size), quantity };
}

export function buildTestBagItemList(): { bagItems: BagItem[]; products: ClientProduct[] } {
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
        buildTestProduct({
            idx,
            overrides: {
                price: prices[idx],
                gender: categories[idx] as Categories,
                stock: stocks[idx],
            },
        })
    );

    const bagItems = Array.from({ length: 2 }).map((_, idx) =>
        buildTestBagItem(products[idx], sizes[idx] as Sizes, quantities[idx])
    );

    return { bagItems, products };
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
        buildTestProduct({
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
    sizeMap?: never;
    quantityMap?: never;
};

type TestOrderParamsSimple = TestOrderBase & TestOrderNever;

type TestOrderParamsFull = TestOrderBase & {
    idx: number;
    productList: Product[];
    sizeMap: Sizes[];
    quantityMap: number[];
};

type TestOrderParams = TestOrderParamsFull | TestOrderParamsSimple;

export function buildTestOrderData(params: TestOrderParams = {}): ClientOrder {
    const { idx = 0, productList, sizeMap, quantityMap, overrides } = params;
    const products: Product[] | undefined = productList ? productList : [buildTestProduct()];
    const items = products.map((product, prodIdx) => ({
        name: product.name,
        price: product.price,
        id: `order-${idx}-${prodIdx}`,
        productId: product.id,
        size: productList && sizeMap ? sizeMap[prodIdx] : "m",
        quantity: productList && quantityMap ? quantityMap[prodIdx] : 2,
        orderId: idx,
        product,
    }));

    const orderCreateData = {
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

    if (orderCreateData.status === "pendingReturn" && !orderCreateData.returnRequestedAt) {
        throw new Error("Missing 'return requested date' for 'pending return' status");
    }

    if (
        orderCreateData.status === "refunded" &&
        !(orderCreateData.returnRequestedAt && orderCreateData.refundedAt)
    ) {
        throw new Error(
            "Missing 'return requested date' and 'refunded date' for 'refunded' status"
        );
    }

    return orderCreateData;
}

export function buildTestOrderList(): ClientOrder[] {
    const productList = buildTestProductList();
    const firstOrderList = productList.slice(0, 3);
    const secondOrderList = productList.slice(3);

    const productLists = [firstOrderList, secondOrderList];
    const sizeMaps: OrderItem["size"][][] = [["m", "l", "m"], ["l"]];
    const quantityMaps: OrderItem["quantity"][][] = [[2, 1, 1], [1]];

    return Array.from({ length: 2 }).map((_, orderIdx) =>
        buildTestOrderData({
            idx: orderIdx,
            productList: productLists[orderIdx],
            sizeMap: sizeMaps[orderIdx],
            quantityMap: quantityMaps[orderIdx],
        })
    );
}

export type TestOrderCypressParams = {
    testProductsData: CypressTestProductData[];
    idx?: Order["id"];
    sizeMap?: OrderItem["size"][];
    quantityMap?: OrderItem["quantity"][];
    overrides?: Partial<OrderCreateInput>;
};

export function buildTestOrderDataCypress({
    idx = 0,
    testProductsData,
    sizeMap,
    quantityMap,
    overrides,
}: TestOrderCypressParams): OrderCreateInput {
    let subTotal = 0;
    const shippingTotal = 500;

    const items: OrderCreateInput["items"] = testProductsData.map((product, prodIdx) => {
        const price = product.price;
        const quantity: number = quantityMap ? quantityMap[prodIdx] : 2;
        subTotal += price * quantity;
        return {
            productId: String(product.id),
            name: product.name,
            price,
            size: sizeMap ? sizeMap[prodIdx] : ("m" as Sizes),
            quantity,
        };
    });

    const orderCreateData: OrderCreateInput = {
        subTotal,
        shippingTotal,
        total: subTotal + shippingTotal,
        status: "paid" as OrderStatus,
        userId: 1,
        email: "test@example.com",
        createdAt: new Date("2025-08-01"),
        sessionId: `sessionId-${idx}`,
        paymentIntentId: `paymentIntentId-${idx}`,
        items,
        ...overrides,
    };

    if (orderCreateData.status === "pendingReturn" && !orderCreateData.returnRequestedAt) {
        throw new Error("Missing 'return requested date' for 'pending return' status");
    }

    if (
        orderCreateData.status === "refunded" &&
        !(orderCreateData.returnRequestedAt && orderCreateData.refundedAt)
    ) {
        throw new Error(
            "Missing 'return requested date' and 'refunded date' for 'refunded' status"
        );
    }

    return orderCreateData;
}
