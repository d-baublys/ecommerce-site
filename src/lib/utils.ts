import { Prisma } from "../../generated/prisma";
import { BagItem, Product, Sizes } from "./definitions";
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
        select: {
            id: true,
            name: true,
            gender: true,
            price: true,
            slug: true,
            src: true,
            alt: true,
            stock: true,
        },
        orderBy: { name: "asc" },
    });

    const products: Product[] = rawProducts.map((product) => ({
        ...product,
        stock: product.stock as Partial<Record<Sizes, number>>,
    }));

    return products;
}

export async function updateData(productId: string, size: Sizes, quantity: number): Promise<void> {
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

export function getNetStock(productData: Product, productSize: Sizes, bag: BagItem[]) {
    const backendStock = productData.stock[productSize as keyof typeof productData.stock];

    const existing = bag.find(
        (bagItem) => bagItem.product.id === productData.id && bagItem.size === productSize
    );

    const bagQuantity = existing?.quantity ?? 0;

    return backendStock! - bagQuantity;
}
