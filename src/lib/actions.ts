"use server";

import {
    Prisma,
    OrderStatus as PrismaOrderStatus,
    Stock as PrismaStock,
    Product as PrismaProduct,
    Order as PrismaOrder,
    User,
} from "@prisma/client";
import { CredentialsError, ItemMetadata, Product } from "./definitions";
import { prisma } from "./prisma";
import {
    convertClientProduct,
    convertMultiplePrismaProducts,
    hashPassword,
    mapStockForPrisma,
} from "./utils";

export async function productAdd(productData: Product) {
    try {
        const createdProduct = await prisma.product.create({
            data: convertClientProduct(productData),
        });
        await prisma.stock.createMany({
            data: mapStockForPrisma({ ...productData, id: createdProduct.id }),
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

        const products: Product[] = convertMultiplePrismaProducts(rawProducts);

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
                data: mapStockForPrisma(productData),
            }),
            prisma.product.update({
                where: { id: productData.id },
                data: convertClientProduct(productData),
            }),
        ]);

        return { success: true };
    } catch (error) {
        console.error("Error updating product data: ", error);
        return { success: false };
    }
}

export async function updateStockOnPurchase(
    productId: PrismaStock["productId"],
    size: PrismaStock["size"],
    quantity: PrismaStock["quantity"]
) {
    const stockItem = await prisma.stock.findFirst({
        where: { productId, size },
        select: { id: true, quantity: true },
    });

    if (!stockItem || !stockItem.quantity) {
        throw new Error("Product not found or has no stock.");
    }

    const currentStock = stockItem.quantity;

    if (quantity > currentStock) {
        throw new Error(`Quantity exceeds stock for size "${size.toUpperCase()}"`);
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

export async function productDelete(id: PrismaProduct["id"]) {
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

type CreateOrderParams = Prisma.OrderCreateArgs["data"] & { items: ItemMetadata[] };

export async function createOrder({
    items,
    subTotal,
    shippingTotal,
    total,
    sessionId,
    email,
    paymentIntentId,
    userId,
}: CreateOrderParams) {
    try {
        const createObj: Prisma.OrderCreateArgs = {
            data: {
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        name: item.name,
                        price: item.price,
                        size: item.size,
                        quantity: item.quantity,
                    })),
                },
                subTotal,
                shippingTotal,
                total,
                sessionId,
                email,
                paymentIntentId,
                userId,
            },
        };

        await prisma.order.create(createObj);

        return { success: true };
    } catch (error) {
        console.error("Error creating order: ", error);
        return { success: false };
    }
}

type GetOrderParams = {
    sessionId?: PrismaOrder["sessionId"];
    orderId?: PrismaOrder["id"];
};

export async function getOrder({ sessionId, orderId }: GetOrderParams) {
    const whereQuery = {
        ...(sessionId && { sessionId }),
        ...(orderId && { id: orderId }),
    };

    try {
        const order = await prisma.order.findFirst({
            where: whereQuery,
            include: { items: { include: { product: true } } },
        });

        return { data: order };
    } catch (error) {
        console.error("Error fetching order data: ", error);
        throw new Error("Error fetching order data. Please try again later.");
    }
}

export async function getUserOrders({ userId }: { userId: PrismaOrder["userId"] }) {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: Number(userId) },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: "desc" },
        });

        return { data: orders };
    } catch (error) {
        console.error("Error fetching order data: ", error);
        throw new Error("Error fetching order data. Please try again later.");
    }
}

export async function getOrders(includeObj?: Prisma.OrderInclude) {
    try {
        const orders = await prisma.order.findMany({
            include: includeObj ?? { items: { include: { product: true } } },
            orderBy: { createdAt: "desc" },
        });

        return { data: orders };
    } catch (error) {
        console.error("Error fetching order data: ", error);
        throw new Error("Error fetching order data. Please try again later.");
    }
}

interface UpdateOrderParams {
    orderId: PrismaOrder["id"];
    status: PrismaOrderStatus;
    returnRequestedAt?: PrismaOrder["returnRequestedAt"];
    refundedAt?: PrismaOrder["refundedAt"];
}

export async function updateOrder(params: UpdateOrderParams) {
    const { orderId, status, returnRequestedAt, refundedAt } = params;

    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status, returnRequestedAt, refundedAt },
        });
        return { success: true };
    } catch (error) {
        console.error("Error updating order: ", error);
        return { success: false };
    }
}

export async function createFeaturedProducts(productData: Product[]) {
    try {
        await prisma.featuredProduct.createMany({
            data: productData.map((product) => ({
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

        const products: Product[] = convertMultiplePrismaProducts(
            rawProducts.map((item) => item.product)
        );

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

export async function createUser(
    email: User["email"],
    password: User["password"],
    role: User["role"] = "user"
) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailPattern.test(email);

    if (!validEmail) {
        throw new CredentialsError("Invalid email address provided.");
    }

    let user;

    try {
        user = await prisma.user.findFirst({
            where: { email },
        });
    } catch (error) {
        console.error("Error checking for existing user: ", error);
        throw new Error("Error checking for existing user.");
    }

    if (user) {
        throw new CredentialsError("An account with this email address already exists.");
    }

    if (password.length < 8) {
        throw new CredentialsError("Your password must have a minimum of 8 characters.");
    }

    const hashedPassword = await hashPassword(password);

    try {
        await prisma.user.create({
            data: { email, password: hashedPassword, role },
        });
        return { success: true };
    } catch (error) {
        console.error("Error creating user: ", error);
        return { success: false };
    }
}

export async function getUser(email: User["email"]) {
    try {
        const result = await prisma.user.findFirst({
            where: { email },
        });
        return result
            ? { id: result.id, email: result.email, password: result.password, role: result.role }
            : null;
    } catch (error) {
        console.error("Error fetching user data: ", error);
        throw new Error("Error fetching user data. Please try again later.");
    }
}
