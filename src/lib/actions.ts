"use server";

import { Prisma } from "@prisma/client";
import {
    ClientOrder,
    ClientProduct,
    ClientUser,
    Order,
    OrderCreateInput,
    OrderStatus,
    Product,
    StockUpdateInput,
    User,
    UserCreateInput,
} from "./types";
import { prisma } from "./prisma";
import {
    convertMultiplePrismaProducts,
    hashPassword,
    mapStockForProductCreate,
    mapStockForProductUpdate,
    zodErrorResponse,
} from "./utils";
import {
    clientProductSchema,
    featuredProductCreateSchema,
    orderCreateSchema,
    productCreateSchema,
    stockUpdateSchema,
    userCreateSchema,
} from "./schemas";
import {
    CreateUpdateDeleteActionResponse,
    GetActionResponse,
    GetManyActionResponse,
} from "./types/actions";

export async function createProduct(productData: ClientProduct): CreateUpdateDeleteActionResponse {
    try {
        const { id, ...netProduct } = productData;
        const parsedProduct = productCreateSchema.safeParse(netProduct);

        if (!parsedProduct.success) {
            return zodErrorResponse(parsedProduct);
        }

        await prisma.product.create({
            data: {
                ...parsedProduct.data,
                stock: {
                    createMany: { data: mapStockForProductCreate(parsedProduct.data.stock) },
                },
            },
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
): GetManyActionResponse<ClientProduct> {
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

export async function updateProduct(productData: ClientProduct): CreateUpdateDeleteActionResponse {
    try {
        const parsedProduct = clientProductSchema.safeParse(productData);

        if (!parsedProduct.success) {
            return zodErrorResponse(parsedProduct);
        }

        const { stock, ...netProduct } = parsedProduct.data;

        await prisma.$transaction([
            prisma.stock.deleteMany({
                where: { productId: parsedProduct.data.id },
            }),
            prisma.stock.createMany({
                data: mapStockForProductUpdate(parsedProduct.data),
            }),
            prisma.product.update({
                where: { id: parsedProduct.data.id },
                data: netProduct,
            }),
        ]);

        return { success: true };
    } catch (error) {
        console.error("Error updating product data: ", error);
        return { success: false };
    }
}

export async function deleteProduct(id: Product["id"]): CreateUpdateDeleteActionResponse {
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

export async function updateStock(params: StockUpdateInput): CreateUpdateDeleteActionResponse {
    const parsedData = stockUpdateSchema.safeParse(params);

    if (!parsedData.success) {
        return zodErrorResponse(parsedData);
    }

    const { productId, size, quantity } = parsedData.data;

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

export async function createFeaturedProducts(
    productData: ClientProduct[]
): CreateUpdateDeleteActionResponse {
    const parsedArray = featuredProductCreateSchema.safeParse(
        productData.map((product) => ({
            productId: product.id,
        }))
    );

    if (!parsedArray.success) {
        return zodErrorResponse(parsedArray);
    }

    try {
        await prisma.featuredProduct.createMany({
            data: parsedArray.data,
            skipDuplicates: true,
        });
        return { success: true };
    } catch (error) {
        console.error("Error creating featured products: ", error);
        return { success: false };
    }
}

export async function getFeaturedProducts(): GetManyActionResponse<ClientProduct> {
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

export async function deleteFeaturedProducts(): CreateUpdateDeleteActionResponse {
    try {
        await prisma.featuredProduct.deleteMany();
        return { success: true };
    } catch (error) {
        console.error("Error deleting featured products: ", error);
        return { success: false };
    }
}

export async function createOrder(orderData: OrderCreateInput): CreateUpdateDeleteActionResponse {
    try {
        const parsedOrder = orderCreateSchema.safeParse(orderData);

        if (!parsedOrder.success) {
            return zodErrorResponse(parsedOrder);
        }

        const { items, subTotal, shippingTotal, total, sessionId, email, paymentIntentId, userId } =
            parsedOrder.data;

        const orderCreateData: Prisma.OrderCreateArgs["data"] = {
            items: {
                createMany: {
                    data: items.map((item) => ({
                        productId: item.productId,
                        name: item.name,
                        price: item.price,
                        size: item.size,
                        quantity: item.quantity,
                    })),
                },
            },
            subTotal,
            shippingTotal,
            total,
            sessionId,
            email,
            paymentIntentId,
            userId,
        };

        await prisma.order.create({ data: orderCreateData });

        return { success: true };
    } catch (error) {
        console.error("Error creating order: ", error);
        return { success: false };
    }
}

interface GetOrderParams {
    sessionId?: Order["sessionId"];
    orderId?: Order["id"];
}

export async function getOrder({
    sessionId,
    orderId,
}: GetOrderParams): GetActionResponse<ClientOrder> {
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

export async function getUserOrders({
    userId,
}: {
    userId: User["id"];
}): GetManyActionResponse<ClientOrder> {
    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: "desc" },
        });

        return { data: orders };
    } catch (error) {
        console.error("Error fetching order data: ", error);
        throw new Error("Error fetching order data. Please try again later.");
    }
}

export async function getAllOrders(): GetManyActionResponse<Order> {
    try {
        const orders = await prisma.order.findMany({
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

export async function updateOrder(params: UpdateOrderParams): CreateUpdateDeleteActionResponse {
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

export async function createUser(params: UserCreateInput): CreateUpdateDeleteActionResponse {
    const parsedData = userCreateSchema.safeParse(params);

    if (!parsedData.success) {
        return zodErrorResponse(parsedData);
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
        return {
            success: false,
            error: "An account with this email address already exists.",
        };
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

export async function getUser(email: User["email"]): GetActionResponse<ClientUser> {
    try {
        const result = await prisma.user.findFirst({
            where: { email },
        });
        return { data: result };
    } catch (error) {
        console.error("Error fetching user data: ", error);
        throw new Error("Error fetching user data. Please try again later.");
    }
}
