"use server";

import { Prisma } from "@prisma/client";
import {
    ClientProduct,
    Order,
    OrderCreateInput,
    OrderStatus,
    Product,
    ProductCreateInput,
    StockCreateInput,
    User,
    UserCreateInput,
} from "./types";
import { prisma } from "./prisma";
import { convertMultiplePrismaProducts, hashPassword, mapStockForPrisma } from "./utils";
import { CredentialsError } from "./classes";
import {
    clientProductSchema,
    clientStockSchema,
    orderCreateSchema,
    productCreateSchema,
    userCreateSchema,
} from "./schemas";

export async function createProduct(productData: ProductCreateInput) {
    try {
        const { stock, ...rest } = productData;
        const parsedProduct = productCreateSchema.parse(rest);
        const parsedStock = clientStockSchema.parse(stock);

        const createdProduct = await prisma.product.create({
            data: parsedProduct,
        });
        await prisma.stock.createMany({
            data: mapStockForPrisma({
                ...parsedProduct,
                stock: parsedStock,
                id: createdProduct.id,
            }),
        });

        return { success: true };
    } catch (error) {
        console.error("Error adding product: ", error);
        return { success: false };
    }
}

export async function getProducts(
    where?: Prisma.ProductWhereInput,
    orderBy?: Prisma.ProductOrderByWithRelationInput
) {
    try {
        const rawProducts = await prisma.product.findMany({
            where,
            include: { stock: true },
            orderBy: orderBy ? orderBy : { name: "asc" },
        });

        const products: ClientProduct[] = convertMultiplePrismaProducts(rawProducts);

        return { data: products };
    } catch (error) {
        console.error("Error fetching product data: ", error);
        throw new Error("Error fetching product data. Please try again later.");
    }
}

export async function updateProduct(productData: ClientProduct) {
    try {
        const parsedData = clientProductSchema.parse(productData);
        const { stock, ...netProduct } = parsedData;

        await prisma.$transaction([
            prisma.stock.deleteMany({
                where: { productId: parsedData.id },
            }),
            prisma.stock.createMany({
                data: mapStockForPrisma(parsedData),
            }),
            prisma.product.update({
                where: { id: parsedData.id },
                data: netProduct,
            }),
        ]);

        return { success: true };
    } catch (error) {
        console.error("Error updating product data: ", error);
        return { success: false };
    }
}

export async function deleteProduct(id: Product["id"]) {
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

export async function updateStock({ productId, size, quantity }: StockCreateInput) {
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

export async function createFeaturedProducts(productData: ClientProduct[]) {
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

        const products: ClientProduct[] = convertMultiplePrismaProducts(
            rawProducts.map((item) => item.product)
        );

        return { data: products };
    } catch (error) {
        console.error("Error fetching featured products: ", error);
        throw new Error("Error fetching featured products. Please try again later.");
    }
}

export async function deleteFeaturedProducts() {
    try {
        await prisma.featuredProduct.deleteMany();
        return { success: true };
    } catch (error) {
        console.error("Error deleting featured products: ", error);
        return { success: false };
    }
}

export async function createOrder(orderData: OrderCreateInput) {
    try {
        const data = orderCreateSchema.parse(orderData);
        const { items, subTotal, shippingTotal, total, sessionId, email, paymentIntentId, userId } =
            data;

        const createObj: Prisma.OrderCreateInput = {
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
        };

        await prisma.order.create({ data: createObj });

        return { success: true };
    } catch (error) {
        console.error("Error creating order: ", error);
        return { success: false };
    }
}

type GetOrderParams = {
    sessionId?: Order["sessionId"];
    orderId?: Order["id"];
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

export async function getUserOrders({ userId }: { userId: Order["userId"] }) {
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

export async function getAllOrders(includeObj?: Prisma.OrderInclude) {
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
    orderId: Order["id"];
    status: OrderStatus;
    returnRequestedAt?: Order["returnRequestedAt"];
    refundedAt?: Order["refundedAt"];
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

export async function createUser(params: UserCreateInput) {
    const parsedData = userCreateSchema.safeParse(params);

    if (!parsedData.success) {
        throw new CredentialsError(parsedData.error.issues[0].message);
    }

    const { email, password, role } = parsedData.data;

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
