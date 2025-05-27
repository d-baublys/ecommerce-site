"use server";

import { Prisma } from "../../generated/prisma";
import { ItemMetadata, OrderStatus, Product, Sizes } from "./definitions";
import { prisma } from "./prisma";

export async function productAdd(productData: Product) {
    try {
        await prisma.product.create({
            data: {
                name: productData.name,
                gender: productData.gender,
                price: productData.price,
                slug: productData.slug,
                src: productData.src,
                alt: productData.alt,
                stock: productData.stock,
            },
        });
        return { success: true };
    } catch {
        return { success: false };
    }
}

export async function getProductData(
    where?: Prisma.ProductWhereInput,
    select?: Prisma.ProductSelect
): Promise<Product[]> {
    const rawProducts = await prisma.product.findMany({
        where,
        select,
        orderBy: { name: "asc" },
    });

    const products: Product[] = rawProducts.map((product) => ({
        ...product,
        stock: product.stock as Product["stock"],
    }));

    return products;
}

export async function productUpdate(productData: Product) {
    try {
        await prisma.product.update({
            where: { id: productData.id },
            data: {
                name: productData.name,
                gender: productData.gender,
                price: productData.price,
                slug: productData.slug,
                src: productData.src,
                alt: productData.alt,
                stock: productData.stock,
            },
        });
        return { success: true };
    } catch {
        return { success: false };
    }
}

export async function updateStockOnPurchase(
    productId: string,
    size: Sizes,
    quantity: number
): Promise<void> {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { stock: true },
    });

    if (!product || !product.stock) {
        throw new Error("Product not found or has no stock.");
    }

    const currentStock = product.stock as Product["stock"];
    const currentSizeStock = currentStock[size] ?? 0;

    if (quantity > currentSizeStock) {
        throw new Error(`Quantity exceeds stock for size ${size}`);
    }

    const updatedStock = {
        ...currentStock,
        [size]: currentSizeStock - quantity,
    };

    await prisma.product.update({
        where: { id: productId },
        data: {
            stock: updatedStock,
        },
    });
}

export async function productDelete(id: string) {
    try {
        await prisma.product.delete({
            where: { id },
        });
        return { success: true };
    } catch {
        return { success: false };
    }
}

export async function createOrder(orderItems: ItemMetadata[], sessionId: string) {
    const orderTotal = orderItems.reduce((total, currentItem) => total + currentItem.price, 0);

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
}

export async function getOrder(id: number) {
    const order = prisma.order.findUnique({
        where: { id },
    });

    return order;
}

export async function updateOrder(orderId: number, status: OrderStatus) {
    await prisma.order.update({
        where: { id: orderId },
        data: { status },
    });
}

export async function createFeaturedProducts(dataObj: Product[]) {
    await prisma.featuredProduct.createMany({
        data: dataObj.map((product) => ({
            productId: product.id,
        })),
        skipDuplicates: true,
    });
}

export async function getFeaturedProducts() {
    const rawProducts = await prisma.featuredProduct.findMany({
        include: {
            product: true,
        },
    });

    const products: Product[] = rawProducts.map((item) => ({
        ...item.product,
        stock: item.product.stock as Product["stock"],
    }));

    return products;
}

export async function clearFeaturedProducts() {
    await prisma.featuredProduct.deleteMany();
}
