import { OrderStatus, Prisma } from "../../generated/prisma";
import { BagItem, ItemMetadata, Product, Sizes, VALID_SIZES } from "./definitions";
import { prisma } from "./prisma";

export function debounce(func: () => void, delay: number) {
    let timer: ReturnType<typeof setTimeout>;
    return function (...args: Parameters<typeof func>) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

export async function fetchData(where?: Prisma.ProductWhereInput): Promise<Product[]> {
    const rawProducts = await prisma.product.findMany({
        where,
        orderBy: { name: "asc" },
    });

    const products: Product[] = rawProducts.map((product) => ({
        ...product,
        stock: product.stock as Partial<Record<Sizes, number>>,
    }));

    return products;
}

export async function updateSingleProduct(
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

    const currentStock = product.stock as Record<Sizes, number>;
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

export async function updateOrder(orderId: number, status: OrderStatus) {
    await prisma.order.update({
        where: { id: orderId },
        data: { status },
    });
}

export async function updateProductStock(productId: string, stockObj: Product["stock"]) {
    await prisma.product.update({
        where: { id: productId },
        data: { stock: stockObj },
    });
}

export async function getOrder(id: number) {
    const order = prisma.order.findUnique({
        where: { id },
    });

    return order;
}

export function getNetStock(productData: Product, productSize: Sizes, bag: BagItem[]) {
    const backendStock = productData.stock[productSize as keyof typeof productData.stock];

    const existing = bag.find(
        (bagItem) => bagItem.product.id === productData.id && bagItem.size === productSize
    );

    const bagQuantity = existing?.quantity ?? 0;

    return backendStock! - bagQuantity;
}

export function isValidSize(value: string): value is Sizes {
    return VALID_SIZES.includes(value as Sizes);
}

export function isUnique(value: string, stockObj: Product["stock"]) {
    return !Object.entries(stockObj).find(([size]) => size === value);
}

export function isValidStock(value: number) {
    return value >= 0;
}
