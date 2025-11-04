"use server";

import { Prisma } from "@prisma/client";
import {
    ClientOrder,
    ClientProduct,
    ClientUser,
    Order,
    OrderCreateInput,
    OrderUpdateInput,
    Product,
    ReservedItemCreateInput,
    ReservedItem,
    User,
    UserCreateInput,
    GetManyActionResponse,
    CreateUpdateDeleteActionResponse,
    GetActionResponse,
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
    orderUpdateSchema,
    productCreateSchema,
    reservedItemCreateSchema,
    userCreateSchema,
} from "./schemas";

export async function createProduct(productData: ClientProduct): CreateUpdateDeleteActionResponse {
    const { id, ...netProduct } = productData;
    const parsedProduct = productCreateSchema.safeParse(netProduct);

    if (!parsedProduct.success) {
        return zodErrorResponse(parsedProduct);
    }

    try {
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
    const parsedData = clientProductSchema.safeParse(productData);

    if (!parsedData.success) {
        return zodErrorResponse(parsedData);
    }

    const { stock, ...netProduct } = parsedData.data;

    try {
        await prisma.$transaction([
            prisma.stock.deleteMany({
                where: { productId: parsedData.data.id },
            }),
            prisma.stock.createMany({
                data: mapStockForProductUpdate(parsedData.data),
            }),
            prisma.product.update({
                where: { id: parsedData.data.id },
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

export async function createFeaturedProducts(
    productData: ClientProduct[]
): CreateUpdateDeleteActionResponse {
    const parsedData = featuredProductCreateSchema.safeParse(
        productData.map((product) => ({
            productId: product.id,
        }))
    );

    if (!parsedData.success) {
        return zodErrorResponse(parsedData);
    }

    try {
        await prisma.featuredProduct.createMany({
            data: parsedData.data,
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

export async function createReservedItems(
    data: ReservedItemCreateInput
): CreateUpdateDeleteActionResponse<ReservedItem["id"][]> {
    const parsedData = reservedItemCreateSchema.safeParse(data);

    if (!parsedData.success) {
        return zodErrorResponse(parsedData);
    }

    try {
        const result = await prisma.reservedItem.createManyAndReturn({
            data: parsedData.data,
        });
        return { success: true, data: result.map((item) => item.id) };
    } catch (error) {
        console.error("Error creating reserved items: ", error);
        return { success: false };
    }
}

export async function getReservedItems({
    productIds,
}: {
    productIds: ReservedItem["productId"][];
}): GetManyActionResponse<ReservedItem> {
    try {
        const result = await prisma.reservedItem.findMany({
            where: { productId: { in: productIds } },
        });
        return { data: result };
    } catch (error) {
        console.error("Error fetching reserved items: ", error);
        throw new Error("Error fetching reserved items. Please try again later.");
    }
}

export async function deleteReservedItems(
    itemIds: ReservedItem["id"][]
): CreateUpdateDeleteActionResponse {
    try {
        await prisma.reservedItem.deleteMany({ where: { id: { in: itemIds } } });
        return { success: true };
    } catch (error) {
        console.error("Error deleting reserved items: ", error);
        return { success: false };
    }
}

export async function createOrder(orderData: OrderCreateInput): CreateUpdateDeleteActionResponse {
    const parsedData = orderCreateSchema.safeParse(orderData);

    if (!parsedData.success) {
        return zodErrorResponse(parsedData);
    }

    const { items, subTotal, shippingTotal, total, sessionId, email, paymentIntentId, userId } =
        parsedData.data;

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

    try {
        await prisma.$transaction(async (tx) => {
            for (const item of items) {
                const { productId, size, quantity } = item;

                const stockItem = await tx.stock.findFirst({
                    where: { productId, size },
                    select: { id: true, quantity: true },
                });

                if (!stockItem) {
                    throw new Error(
                        `Stock data for ${item.name} size "${size.toUpperCase()} not found`
                    );
                }

                const currentStock = stockItem.quantity;

                if (quantity > currentStock) {
                    throw new Error(
                        `Quantity exceeds stock for ${item.name} size "${size.toUpperCase()}"`
                    );
                }

                const updatedStock = currentStock - quantity;

                await tx.stock.update({
                    where: { id: stockItem.id },
                    data: { quantity: updatedStock },
                });
            }

            await prisma.order.create({ data: orderCreateData });
        });

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

export async function updateOrder(updatedData: OrderUpdateInput): CreateUpdateDeleteActionResponse {
    const parsedData = orderUpdateSchema.safeParse(updatedData);

    if (!parsedData.success) {
        return zodErrorResponse(parsedData);
    }

    const { id, status, returnRequestedAt, refundedAt } = parsedData.data;

    try {
        await prisma.order.update({
            where: { id },
            data: { status, returnRequestedAt, refundedAt },
        });
        return { success: true };
    } catch (error) {
        console.error("Error updating order: ", error);
        return { success: false };
    }
}

export async function createUser(userData: UserCreateInput): CreateUpdateDeleteActionResponse {
    const parsedData = userCreateSchema.safeParse(userData);

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
