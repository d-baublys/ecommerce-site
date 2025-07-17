import {
    clearFeaturedProducts,
    createFeaturedProducts,
    createOrder,
    getFeaturedProducts,
    getOrder,
    getProductData,
    productAdd,
    productDelete,
    productUpdate,
    updateStockOnPurchase,
} from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { createFakeProduct, createFakeProductList, getConsoleErrorSpy } from "@/lib/test-utils";
import { FeaturedProduct, OrderItem, Sizes, Stock } from "../../generated/prisma";

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
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        order: {
            create: jest.fn(),
            findFirst: jest.fn(),
        },
        featuredProduct: {
            createMany: jest.fn(),
            findMany: jest.fn(),
            deleteMany: jest.fn(),
        },
        $transaction: jest.fn(),
    },
}));

describe("productAdd", () => {
    it("adds a product and its stock successfully", async () => {
        (prisma.product.create as jest.Mock).mockResolvedValue({});
        (prisma.stock.createMany as jest.Mock).mockResolvedValue({});

        const result = productAdd(createFakeProduct());
        await expect(result).resolves.toEqual({ success: true });
    });

    it("resolves with expected value on product creation failure", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.product.create as jest.Mock).mockRejectedValue(
            new Error("Product creation failed")
        );

        const result = productAdd(createFakeProduct());
        await expect(result).resolves.toEqual({ success: false });

        errorSpy.mockRestore();
    });
});

describe("getProductData", () => {
    it("returns product data successfully", async () => {
        const prismaProductList = createFakeProductList().map(({ dateAdded, ...rest }) => ({
            dateAdded: new Date(dateAdded),
            ...rest,
        }));

        prismaProductList.forEach((product) => {
            (product.stock as Stock[]) = Object.entries(product.stock).map(([size, count]) => ({
                size: size as Sizes,
                quantity: count,
                productId: product.id,
                id: `${product.id}-${size}`,
            }));
        });

        (prisma.product.findMany as jest.Mock).mockResolvedValue(prismaProductList);

        const clientProductList = createFakeProductList();
        const result = getProductData();
        await expect(result).resolves.toEqual({ data: clientProductList });
    });

    it("throws an error if fetch fails", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.product.findMany as jest.Mock).mockRejectedValue(new Error("Product fetch failed"));

        const result = getProductData();
        await expect(result).rejects.toThrow(
            "Error fetching product data. Please try again later."
        );

        errorSpy.mockRestore();
    });
});

describe("productUpdate", () => {
    it("updates product data successfully", async () => {
        (prisma.$transaction as jest.Mock).mockResolvedValue(true);

        const result = productUpdate(createFakeProduct());
        await expect(result).resolves.toEqual({ success: true });
    });

    it("rejects with expected value on transaction failure", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.$transaction as jest.Mock).mockRejectedValue(new Error("Transaction failed"));

        const result = productUpdate(createFakeProduct());
        await expect(result).resolves.toEqual({ success: false });

        errorSpy.mockRestore();
    });
});

describe("updateStockOnPurchase", () => {
    it("updates successfully with valid data", async () => {
        (prisma.stock.findFirst as jest.Mock).mockResolvedValue({ id: "test-id-1", quantity: 4 });
        (prisma.stock.update as jest.Mock).mockResolvedValue({});

        const result = updateStockOnPurchase("test-id-1", "m", 2);
        await expect(result).resolves.toEqual({ success: true });
    });

    it("throws an error if quantity exceeds stock", async () => {
        (prisma.stock.findFirst as jest.Mock).mockResolvedValue({ id: "test-id-1", quantity: 1 });

        const result = updateStockOnPurchase("test-id-1", "m", 2);
        await expect(result).rejects.toThrow('Quantity exceeds stock for size "M"');
    });

    it("throws an error if product is not found", async () => {
        (prisma.stock.findFirst as jest.Mock).mockResolvedValue(null);

        const result = updateStockOnPurchase("test-id-1", "m", 2);
        await expect(result).rejects.toThrow("Product not found or has no stock");
    });

    it("throws an error if product is no longer stocked", async () => {
        (prisma.stock.findFirst as jest.Mock).mockResolvedValue({ id: "test-id-1", quantity: 0 });

        const result = updateStockOnPurchase("test-id-1", "m", 2);
        await expect(result).rejects.toThrow("Product not found or has no stock");
    });

    it("resolves with expected value on database error", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.stock.findFirst as jest.Mock).mockResolvedValue({ id: "test-id-1", quantity: 4 });
        (prisma.stock.update as jest.Mock).mockRejectedValue(new Error("Database error"));

        const result = updateStockOnPurchase("test-id-1", "m", 2);
        await expect(result).resolves.toEqual({ success: false });

        errorSpy.mockRestore();
    });
});

describe("productDelete", () => {
    it("deletes product stock successfully", async () => {
        (prisma.$transaction as jest.Mock).mockResolvedValue(true);

        const result = productDelete(createFakeProduct().id);
        await expect(result).resolves.toEqual({ success: true });
    });

    it("resolves with expected value on transaction failure", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.$transaction as jest.Mock).mockRejectedValue(new Error("Transaction failed"));

        const result = productDelete(createFakeProduct().id);
        await expect(result).resolves.toEqual({ success: false });

        errorSpy.mockRestore();
    });
});

describe("createOrder", () => {
    it("creates order successfully", async () => {
        (prisma.order.create as jest.Mock).mockResolvedValue({});

        const product = createFakeProduct();
        const orderItem: OrderItem = {
            id: "test-order-1",
            productId: product.id,
            name: product.name,
            price: product.price,
            size: "m",
            quantity: 1,
            orderId: 1,
        };
        const result = createOrder({
            items: [orderItem],
            subTotal: 3000,
            shippingTotal: 500,
            total: 3500,
            sessionId: "123abc",
            email: "test@example.com",
            userId: 1,
        });
        await expect(result).resolves.toEqual({ success: true });
    });

    it("rejects on database error", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.order.create as jest.Mock).mockRejectedValue(new Error("Database error"));

        const result = createOrder({
            items: [],
            subTotal: 0,
            shippingTotal: 0,
            total: 0,
            sessionId: "123abc",
            email: "test@example.com",
        });
        await expect(result).resolves.toEqual({ success: false });

        errorSpy.mockRestore();
    });
});

describe("getOrder", () => {
    it("returns order data successfully", async () => {
        const product = createFakeProduct();
        const orderItem: OrderItem = {
            id: "test-order-1",
            productId: product.id,
            name: product.name,
            price: product.price,
            size: "m",
            quantity: 1,
            orderId: 1,
        };
        const order = {
            items: [orderItem],
            subTotal: 3000,
            shippingTotal: 500,
            total: 3500,
            sessionId: "123abc",
            email: "test@example.com",
        };

        (prisma.order.findFirst as jest.Mock).mockResolvedValue(order);

        const result = getOrder({ orderId: 1 });
        await expect(result).resolves.toEqual({ data: order });
    });

    it("throws an error if fetch fails", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.order.findFirst as jest.Mock).mockRejectedValue(new Error("Product fetch failed"));

        const result = getOrder({ orderId: 1 });
        await expect(result).rejects.toThrow("Error fetching order data. Please try again later.");

        errorSpy.mockRestore();
    });
});

describe("createFeaturedProducts", () => {
    it("creates featured products successfully", async () => {
        const productList = createFakeProductList();
        (prisma.featuredProduct.createMany as jest.Mock).mockResolvedValue({});

        const result = createFeaturedProducts(productList);
        await expect(result).resolves.toEqual({ success: true });
    });

    it("resolves with expected value on product creation failure", async () => {
        const errorSpy = getConsoleErrorSpy();
        const productList = createFakeProductList();
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
        const prismaProductList = createFakeProductList().map(({ dateAdded, ...rest }) => ({
            dateAdded: new Date(dateAdded),
            ...rest,
        }));

        prismaProductList.forEach((product) => {
            (product.stock as Stock[]) = Object.entries(product.stock).map(([size, count]) => ({
                size: size as Sizes,
                quantity: count,
                productId: product.id,
                id: `${product.id}-${size}`,
            }));
        });

        const prismaFeaturedList: FeaturedProduct[] = prismaProductList.map((product, idx) => ({
            id: `featured-product-${idx}`,
            productId: product.id,
            product,
        }));

        (prisma.featuredProduct.findMany as jest.Mock).mockResolvedValue(prismaFeaturedList);

        const clientProductList = createFakeProductList();
        const result = getFeaturedProducts();
        await expect(result).resolves.toEqual({ data: clientProductList });
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

describe("clearFeaturedProducts", () => {
    it("deletes featured products successfully", async () => {
        (prisma.featuredProduct.deleteMany as jest.Mock).mockResolvedValue(true);

        const result = clearFeaturedProducts();
        await expect(result).resolves.toEqual({ success: true });
    });

    it("resolves with expected value on deletion failure", async () => {
        const errorSpy = getConsoleErrorSpy();
        (prisma.featuredProduct.deleteMany as jest.Mock).mockRejectedValue(
            new Error("Product deletion failed")
        );

        const result = clearFeaturedProducts();
        await expect(result).resolves.toEqual({ success: false });

        errorSpy.mockRestore();
    });
});
