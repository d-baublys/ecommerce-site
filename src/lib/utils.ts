import { Prisma } from "../../generated/prisma";
import { PrismaClient } from "../../generated/prisma";
import { Product, Sizes } from "./definitions";

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
    const prisma = new PrismaClient();

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
    });

    const products: Product[] = rawProducts.map((product) => ({
        ...product,
        stock: product.stock as Partial<Record<Sizes, number>>,
    }));

    return products;
}
