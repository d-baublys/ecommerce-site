import {
    deleteFeaturedProducts,
    createFeaturedProducts,
    createOrder,
    createUser,
    getFeaturedProducts,
    getOrder,
    getAllOrders,
    getManyProducts,
    getUser,
    getUserOrders,
    createProduct,
    deleteProduct,
    updateProduct,
    updateOrder,
    createCheckoutSession,
    deleteCheckoutSessions,
    getReservedItems,
    getProduct,
} from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import {
    buildReservedItem,
    buildTestOrderData,
    buildTestOrderList,
    buildTestProduct,
    buildTestProductList,
    fakeUuid,
} from "@/lib/test-factories";
import { getConsoleErrorSpy } from "@/lib/test-utils";
import { ClientOrder, ClientProduct, FeaturedProduct, Product, Sizes, Stock } from "@/lib/types";

jest.mock("@/lib/prisma", () => ({
    prisma: {
        stock: {
            createMany: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
            deleteMany: jest.fn(),
        },
        product: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        order: {
            create: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
        },
        featuredProduct: {
            createMany: jest.fn(),
            findMany: jest.fn(),
            deleteMany: jest.fn(),
        },
        user: {
            create: jest.fn(),
            findFirst: jest.fn(),
        },
        checkoutSession: {
            create: jest.fn(),
            deleteMany: jest.fn(),
        },
        reservedItem: {
            findMany: jest.fn(),
        },
        $transaction: jest.fn(),
    },
}));

describe("createProduct", () => {
    it("adds a product and its stock successfully", async () => {
        (prisma.product.create as jest.Mock).mockResolvedValue({});

        const result = createProduct(buildTestProduct());
        await expect(result).resolves.toEqual({ success: true });
    });

    it("resolves with expected value on product creation failure", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.product.create as jest.Mock).mockRejectedValue(
            new Error("Product creation failed")
        );

        const result = createProduct(buildTestProduct());
        await expect(result).resolves.toEqual({ success: false });

        errorSpy.mockRestore();
    });
});

describe("getProduct", () => {
    it("returns product data successfully", async () => {
        const product: ClientProduct = buildTestProduct();

        const prismaProduct: Product & { stock: Stock[] } = {
            ...product,
            stock: Object.entries(product.stock).map(([size, count]) => ({
                size: size as Sizes,
                quantity: count,
                productId: product.id,
                id: `${product.id}-${size}`,
            })),
        };

        (prisma.product.findUnique as jest.Mock).mockResolvedValue(prismaProduct);

        const result = getProduct(fakeUuid);
        await expect(result).resolves.toEqual({ data: product });
    });

    it("throws an error if fetch fails", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.product.findUnique as jest.Mock).mockRejectedValue(
            new Error("Product fetch failed")
        );

        const result = getProduct(fakeUuid);
        await expect(result).rejects.toThrow(
            "Error fetching product data. Please try again later."
        );

        errorSpy.mockRestore();
    });
});

describe("getManyProducts", () => {
    it("returns product data successfully", async () => {
        const productList: ClientProduct[] = buildTestProductList();

        const prismaProductList: (Product & { stock: Stock[] })[] = productList.map((product) => ({
            ...product,
            stock: Object.entries(product.stock).map(([size, count]) => ({
                size: size as Sizes,
                quantity: count,
                productId: product.id,
                id: `${product.id}-${size}`,
            })),
        }));

        (prisma.product.findMany as jest.Mock).mockResolvedValue(prismaProductList);

        const result = getManyProducts();
        await expect(result).resolves.toEqual({ data: productList });
    });

    it("throws an error if fetch fails", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.product.findMany as jest.Mock).mockRejectedValue(new Error("Product fetch failed"));

        const result = getManyProducts();
        await expect(result).rejects.toThrow(
            "Error fetching product data. Please try again later."
        );

        errorSpy.mockRestore();
    });
});

describe("updateProduct", () => {
    it("updates product data successfully", async () => {
        (prisma.$transaction as jest.Mock).mockResolvedValue(true);

        const result = updateProduct(buildTestProduct());
        await expect(result).resolves.toEqual({ success: true });
    });

    it("rejects with expected value on transaction failure", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.$transaction as jest.Mock).mockRejectedValue(new Error("Transaction failed"));

        const result = updateProduct(buildTestProduct());
        await expect(result).resolves.toEqual({ success: false });

        errorSpy.mockRestore();
    });
});

describe("deleteProduct", () => {
    it("deletes product stock successfully", async () => {
        (prisma.product.delete as jest.Mock).mockResolvedValue(true);

        const result = deleteProduct(buildTestProduct().id);
        await expect(result).resolves.toEqual({ success: true });
    });

    it("resolves with expected value on transaction failure", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.product.delete as jest.Mock).mockRejectedValue(
            new Error("Product deletion failed")
        );

        const result = deleteProduct(buildTestProduct().id);
        await expect(result).resolves.toEqual({ success: false });

        errorSpy.mockRestore();
    });
});

describe("createFeaturedProducts", () => {
    it("creates featured products successfully", async () => {
        const productList = buildTestProductList();
        (prisma.featuredProduct.createMany as jest.Mock).mockResolvedValue({});

        const result = createFeaturedProducts(productList);
        await expect(result).resolves.toEqual({ success: true });
    });

    it("resolves with expected value on product creation failure", async () => {
        const errorSpy = getConsoleErrorSpy();
        const productList = buildTestProductList();
        (prisma.featuredProduct.createMany as jest.Mock).mockRejectedValue(
            new Error("Product creation failed")
        );

        const result = createFeaturedProducts(productList);
        await expect(result).resolves.toEqual({ success: false });

        errorSpy.mockRestore();
    });
});

describe("getFeaturedProducts", () => {
    it("returns featured product data successfully", async () => {
        const productList: ClientProduct[] = buildTestProductList();

        const prismaProductList: (Product & { stock: Stock[] })[] = productList.map((product) => ({
            ...product,
            stock: Object.entries(product.stock).map(([size, count]) => ({
                size: size as Sizes,
                quantity: count,
                productId: product.id,
                id: `${product.id}-${size}`,
            })),
        }));

        const prismaFeaturedList: FeaturedProduct[] = prismaProductList.map((product, idx) => ({
            id: `featured-product-${idx}`,
            productId: product.id,
            product,
        }));

        (prisma.featuredProduct.findMany as jest.Mock).mockResolvedValue(prismaFeaturedList);

        const result = getFeaturedProducts();
        await expect(result).resolves.toEqual({ data: productList });
    });

    it("throws an error if fetch fails", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.featuredProduct.findMany as jest.Mock).mockRejectedValue(
            new Error("Product fetch failed")
        );

        const result = getFeaturedProducts();
        await expect(result).rejects.toThrow(
            "Error fetching featured products. Please try again later."
        );

        errorSpy.mockRestore();
    });
});

describe("deleteFeaturedProducts", () => {
    it("deletes featured products successfully", async () => {
        (prisma.featuredProduct.deleteMany as jest.Mock).mockResolvedValue(true);

        const result = deleteFeaturedProducts();
        await expect(result).resolves.toEqual({ success: true });
    });

    it("resolves with expected value on deletion failure", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.featuredProduct.deleteMany as jest.Mock).mockRejectedValue(
            new Error("Product deletion failed")
        );

        const result = deleteFeaturedProducts();
        await expect(result).resolves.toEqual({ success: false });

        errorSpy.mockRestore();
    });
});

describe("createCheckoutSession", () => {
    it("creates checkout session successfully", async () => {
        const inputData = {
            id: fakeUuid,
            userId: 1,
            expiresAt: new Date(),
            items: [
                {
                    size: "m" as Sizes,
                    quantity: 1,
                    productId: fakeUuid,
                },
            ],
        };
        (prisma.checkoutSession.create as jest.Mock).mockResolvedValue({});

        const result = createCheckoutSession(inputData);
        await expect(result).resolves.toEqual({ success: true });
    });

    it("resolves with expected value on checkout session creation failure", async () => {
        const errorSpy = getConsoleErrorSpy();
        const inputData = {
            id: fakeUuid,
            userId: 1,
            expiresAt: new Date(),
            items: [
                {
                    size: "m" as Sizes,
                    quantity: 1,
                    productId: fakeUuid,
                },
            ],
        };
        (prisma.checkoutSession.create as jest.Mock).mockRejectedValue(
            new Error("Error creating checkout session")
        );

        const result = createCheckoutSession(inputData);
        await expect(result).resolves.toEqual({ success: false });

        errorSpy.mockRestore();
    });
});

describe("deleteCheckoutSessions", () => {
    it("deletes checkout sessions successfully", async () => {
        (prisma.checkoutSession.deleteMany as jest.Mock).mockResolvedValue(true);

        const result = deleteCheckoutSessions(1);
        await expect(result).resolves.toEqual({ success: true });
    });

    it("resolves with expected value on deletion failure", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.checkoutSession.deleteMany as jest.Mock).mockRejectedValue(
            new Error("Error deleting checkout session")
        );

        const result = deleteCheckoutSessions(1);
        await expect(result).resolves.toEqual({ success: false });

        errorSpy.mockRestore();
    });
});

describe("getReservedItems", () => {
    it("returns reserved items successfully", async () => {
        const reservedItems = [buildReservedItem()];
        (prisma.reservedItem.findMany as jest.Mock).mockResolvedValue(reservedItems);

        const result = getReservedItems({ productIds: [fakeUuid] });
        await expect(result).resolves.toEqual({ data: reservedItems });
    });

    it("throws an error if fetch fails", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.reservedItem.findMany as jest.Mock).mockRejectedValue(
            new Error("Error fetching reserved items")
        );

        const result = getReservedItems({ productIds: [fakeUuid] });
        await expect(result).rejects.toThrow("Error fetching reserved items");

        errorSpy.mockRestore();
    });
});

describe("createOrder", () => {
    it("creates order successfully", async () => {
        (prisma.product.findMany as jest.Mock).mockResolvedValue([buildTestProduct()]);
        (prisma.$transaction as jest.Mock).mockResolvedValue({});

        const result = createOrder(buildTestOrderData());
        await expect(result).resolves.toEqual({ success: true });
    });

    it("rejects on database error", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.product.findMany as jest.Mock).mockResolvedValue([buildTestProduct()]);
        (prisma.$transaction as jest.Mock).mockRejectedValue(new Error("Database error"));

        const testOrder: ClientOrder = buildTestOrderData();
        const testOrderNoItems = { ...testOrder, items: [] };

        const result = createOrder(testOrderNoItems);
        await expect(result).resolves.toEqual({ success: false });

        errorSpy.mockRestore();
    });
});

describe("getOrder", () => {
    it("returns order data successfully", async () => {
        const testOrder = buildTestOrderData();

        (prisma.order.findFirst as jest.Mock).mockResolvedValue(testOrder);

        const result = getOrder({ orderId: 1 });
        await expect(result).resolves.toEqual({ data: testOrder });
    });

    it("throws an error if fetch fails", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.order.findFirst as jest.Mock).mockRejectedValue(new Error("Product fetch failed"));

        const result = getOrder({ orderId: 1 });
        await expect(result).rejects.toThrow("Error fetching order data. Please try again later.");

        errorSpy.mockRestore();
    });
});

describe("getUserOrders", () => {
    it("returns order data successfully", async () => {
        const testOrderList = buildTestOrderList();
        (prisma.order.findMany as jest.Mock).mockResolvedValue(testOrderList);

        const result = getUserOrders({ userId: 1 });
        await expect(result).resolves.toEqual({ data: testOrderList });
    });

    it("throws an error if fetch fails", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.order.findMany as jest.Mock).mockRejectedValue(new Error("Product fetch failed"));

        const result = getUserOrders({ userId: 1 });
        await expect(result).rejects.toThrow("Error fetching order data. Please try again later.");

        errorSpy.mockRestore();
    });
});

describe("getAllOrders", () => {
    it("returns order data successfully", async () => {
        const testOrderList = buildTestOrderList();
        (prisma.order.findMany as jest.Mock).mockResolvedValue(testOrderList);

        const result = getAllOrders();
        await expect(result).resolves.toEqual({ data: testOrderList });
    });

    it("throws an error if fetch fails", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.order.findMany as jest.Mock).mockRejectedValue(new Error("Product fetch failed"));

        const result = getAllOrders();
        await expect(result).rejects.toThrow("Error fetching order data. Please try again later.");

        errorSpy.mockRestore();
    });
});

describe("updateOrder", () => {
    it("updates successfully with valid data", async () => {
        (prisma.order.update as jest.Mock).mockResolvedValue({});

        const result = updateOrder({
            id: 1,
            status: "pendingReturn",
            returnRequestedAt: new Date(),
        });
        await expect(result).resolves.toEqual({ success: true });
    });

    it("resolves with expected value on database error", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.order.update as jest.Mock).mockRejectedValue(new Error("Database error"));

        const result = updateOrder({
            id: 1,
            status: "pendingReturn",
            returnRequestedAt: new Date(),
        });
        await expect(result).resolves.toEqual({ success: false });

        errorSpy.mockRestore();
    });
});

describe("createUser", () => {
    it("creates user account successfully", async () => {
        (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
        (prisma.user.create as jest.Mock).mockResolvedValue({});

        const result = createUser({
            email: "test@example.com",
            password: "testabc123",
        });
        await expect(result).resolves.toEqual({ success: true });
    });

    it("resolves with error message when provided email is invalid", async () => {
        const result = createUser({
            email: "testexample.com",
            password: "testabc123",
        });
        await expect(result).resolves.toEqual({ success: false, error: "Invalid email address." });
    });

    it("rejects when user existence data fetch fails", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.user.findFirst as jest.Mock).mockRejectedValue(
            new Error("Error checking for existing user.")
        );

        const result = createUser({
            email: "test@example.com",
            password: "testabc123",
        });
        await expect(result).rejects.toThrow("Error checking for existing user.");

        errorSpy.mockRestore();
    });

    it("resolves with error message when a user with the same email already exists", async () => {
        (prisma.user.findFirst as jest.Mock).mockResolvedValue({});

        const result = createUser({ email: "test@example.com", password: "testabc123" });
        await expect(result).resolves.toEqual({
            success: false,
            error: "An account with this email address already exists.",
        });
    });

    it("resolves with error message when password is too short", async () => {
        (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

        const result = createUser({ email: "test@example.com", password: "testabc" });
        await expect(result).resolves.toEqual({
            success: false,
            error: "Password must be at least 8 characters long.",
        });
    });

    it("rejects on database error", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
        (prisma.user.create as jest.Mock).mockRejectedValue(new Error("Error creating user."));

        const result = createUser({ email: "test@example.com", password: "testabc123" });
        await expect(result).resolves.toEqual({ success: false });

        errorSpy.mockRestore();
    });
});

describe("getUser", () => {
    it("returns user data successfully", async () => {
        (prisma.user.findFirst as jest.Mock).mockResolvedValue({});
        const email = "test@example.com";
        const userData = {
            id: undefined,
            email: undefined,
            password: undefined,
            role: undefined,
        };

        const result = getUser(email);
        await expect(result).resolves.toEqual({ data: userData });
    });

    it("throws an error if fetch fails", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.user.findFirst as jest.Mock).mockRejectedValue(
            new Error("Error fetching user data. Please try again later.")
        );
        const email = "test@example.com";

        const result = getUser(email);
        await expect(result).rejects.toThrow("Error fetching user data. Please try again later.");

        errorSpy.mockRestore();
    });
});
