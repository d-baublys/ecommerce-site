"use server";

import { Prisma } from "../../generated/prisma";
import { ItemMetadata, OrderStatus, Product, Sizes } from "./definitions";
import { prisma } from "./prisma";
import { buildStockObj, extractProductFields, mapStockForDb, processDateForClient } from "./utils";

export async function productAdd(productData: Product) {
    try {
        await prisma.product.create({
            data: extractProductFields(productData),
        });
        await prisma.stock.createMany({
            data: mapStockForDb(productData),
        });

        return { success: true };
    } catch (error) {
        console.error("Error adding product: ", error);
        return { success: false };
    }
}

export async function getProductData(
    where?: Prisma.ProductWhereInput,
    orderBy?: Prisma.ProductOrderByWithRelationInput
) {
    try {
        const rawProducts = await prisma.product.findMany({
            where,
            include: { stock: true },
            orderBy: orderBy ? orderBy : { name: "asc" },
        });

        const products: Product[] = rawProducts.map((product) => ({
            ...product,
            dateAdded: processDateForClient(product.dateAdded),
            stock: buildStockObj(product.stock),
        }));

        return { data: products };
    } catch (error) {
        console.error("Error fetching product data: ", error);
        throw new Error("Error fetching product data. Please try again later.");
    }
}

export async function productUpdate(productData: Product) {
    try {
        await prisma.$transaction([
            prisma.stock.deleteMany({
                where: { productId: productData.id },
            }),
            prisma.stock.createMany({
                data: mapStockForDb(productData),
            }),
            prisma.product.update({
                where: { id: productData.id },
                data: extractProductFields(productData),
            }),
        ]);

        return { success: true };
    } catch (error) {
        console.error("Error updating product data: ", error);
        return { success: false };
    }
}

export async function updateStockOnPurchase(productId: string, size: Sizes, quantity: number) {
    const stockItem = await prisma.stock.findFirst({
        where: { productId, size },
        select: { id: true, quantity: true },
    });

    if (!stockItem || !stockItem.quantity) {
        throw new Error("Product not found or has no stock.");
    }

    const currentStock = stockItem.quantity;

    if (quantity > currentStock) {
        throw new Error(`Quantity exceeds stock for size ${size}`);
    }

    const updatedStock = currentStock - quantity;

    try {
        await prisma.stock.update({
            where: { id: stockItem.id },
            data: { quantity: updatedStock },
        });
        return { success: true };
    } catch (error) {
        console.error("Error updating stock data: ", error);
        return { success: false };
    }
}

export async function productDelete(id: string) {
    try {
        await prisma.$transaction([
            prisma.stock.deleteMany({
                where: { productId: id },
            }),
            prisma.product.delete({
                where: { id },
            }),
        ]);
        return { success: true };
    } catch {
        return { success: false };
    }
}

export async function createOrder(orderItems: ItemMetadata[], sessionId: string) {
    const orderTotal = orderItems.reduce((total, currentItem) => total + currentItem.price, 0);

    try {
        await prisma.order.create({
            data: {
                total: orderTotal,
                items: {
                    create: orderItems.map((item) => ({
                        productId: item.productId,
                        name: item.name,
                        price: item.price,
                        size: item.size,
                        quantity: item.quantity,
                    })),
                },
                sessionId,
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Error creating order: ", error);
        return { success: false };
    }
}

export async function getOrder(id: number) {
    try {
        const order = await prisma.order.findUnique({
            where: { id },
        });

        return { data: order };
    } catch (error) {
        console.error("Error fetching order data: ", error);
        throw new Error("Error fetching order data. Please try again later.");
    }
}

export async function updateOrder(orderId: number, status: OrderStatus) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
        return { success: true };
    } catch (error) {
        console.error("Error updating order: ", error);
        return { success: false };
    }
}

export async function createFeaturedProducts(dataObj: Product[]) {
    try {
        await prisma.featuredProduct.createMany({
            data: dataObj.map((product) => ({
                productId: product.id,
            })),
            skipDuplicates: true,
        });
        return { success: true };
    } catch (error) {
        console.error("Error creating featured products: ", error);
        return { success: false };
    }
}

export async function getFeaturedProducts() {
    try {
        const rawProducts = await prisma.featuredProduct.findMany({
            include: {
                product: {
                    include: {
                        stock: true,
                    },
                },
            },
        });

        const products: Product[] = rawProducts.map((item) => ({
            ...item.product,
            dateAdded: item.product.dateAdded.toString(),
            stock: buildStockObj(item.product.stock),
        }));

        return { data: products };
    } catch (error) {
        console.error("Error fetching featured products: ", error);
        throw new Error("Error fetching featured products. Please try again later.");
    }
}

export async function clearFeaturedProducts() {
    try {
        await prisma.featuredProduct.deleteMany();
        return { success: true };
    } catch (error) {
        console.error("Error deleting featured products: ", error);
        return { success: false };
    }
}
