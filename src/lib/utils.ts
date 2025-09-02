import { Stock as PrismaStock, Product as PrismaProduct, Prisma } from "@prisma/client";
import {
    BagItem,
    Product,
    Sizes,
    VALID_CATEGORIES,
    VALID_SIZES,
    ProductSortKey,
    SORT_OPTIONS,
    REFUND_WINDOW,
    PrismaOrderNoStock,
    Order,
} from "./definitions";
import bcrypt from "bcryptjs";

export function debounce<T extends (...args: unknown[]) => void>(func: T, delay: number) {
    let timer: ReturnType<typeof setTimeout>;
    return function (...args: Parameters<T>) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

export function checkStock(productData: Product, productSize: Sizes, bag: BagItem[]): boolean {
    const stock = productData.stock[productSize as keyof typeof productData.stock] ?? 0;

    const existing = bag.find(
        (bagItem) => bagItem.product.id === productData.id && bagItem.size === productSize
    );

    const bagQuantity = existing?.quantity ?? 0;

    return !(
        bagQuantity >= Number(process.env.NEXT_PUBLIC_SINGLE_ITEM_MAX_QUANTITY) ||
        bagQuantity >= stock
    );
}

export function isValidSize(value: string): value is Sizes {
    return VALID_SIZES.includes(value as Sizes);
}

export function isUnique(value: string, stockObj: Product["stock"]) {
    return !Object.entries(stockObj).find(([size]) => size === value);
}

export function isValidStock(value: number): boolean {
    return value >= 0;
}

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function isValidPrice(value: string): boolean {
    return /^\d+(\.\d{1,2})?$/.test(value) && !isNaN(Number(value));
}

export function convertValidPrice(price: string): number {
    return Math.round(Number(price) * 100);
}

export function stringifyConvertPrice(price: number): string {
    return (price / 100).toFixed(2).toString();
}

export function slugify(name: string): string {
    return name.toLowerCase().split(" ").join("-");
}

export function formatImagePath(filePath: string): string {
    return `/${filePath}`;
}

export function createEmptyProduct(): Product {
    return {
        id: "",
        name: "",
        gender: Object.keys(VALID_CATEGORIES)[0] as keyof typeof VALID_CATEGORIES,
        price: 0,
        slug: "",
        src: "",
        alt: "",
        dateAdded: processDateForClient(),
        stock: {},
    };
}

export function convertPrismaProduct(product: PrismaProduct & { stock: PrismaStock[] }): Product {
    return {
        ...product,
        dateAdded: processDateForClient(product.dateAdded),
        stock: buildStockObjForClient(product.stock),
    };
}

export function convertMultiplePrismaProducts(
    products: (PrismaProduct & { stock: PrismaStock[] })[]
): Product[] {
    return products.reduce(
        (arr, current) => [...arr, convertPrismaProduct(current)],
        [] as Product[]
    );
}

export function convertPrismaOrders(data: PrismaOrderNoStock[]): Order[] {
    return data.map((order) => ({
        ...order,
        items: order.items.map((item) => ({
            ...item,
            product: {
                ...item.product,
                dateAdded: processDateForClient(item.product.dateAdded),
            },
        })),
    }));
}

export function convertClientProduct(product: Product): PrismaProduct {
    const { stock, ...rest } = product;
    return { ...rest, dateAdded: new Date(rest.dateAdded) };
}

export function containsClick(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string
): boolean {
    const element = document.getElementById(id);
    return element ? element.contains(e.target as Node) : false;
}

export function areProductListsEqual(listA: Product[], listB: Product[]): boolean {
    if (listA.length !== listB.length) return false;
    return listA.every((productA, idx) => productA.id === listB[idx].id);
}

function areStocksEqual(stockA: Product["stock"], stockB: Product["stock"]): boolean {
    const keysA = Object.keys(stockA) as Sizes[];
    const keysB = Object.keys(stockB) as Sizes[];

    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => stockA[key] === stockB[key]);
}

export function areProductsEqual(productA: Product, productB: Product): boolean {
    for (const key of Object.keys(productA) as (keyof Product)[]) {
        if (key === "stock") continue;

        if (productA[key] !== productB[key]) {
            return false;
        }
    }

    return areStocksEqual(productA.stock, productB.stock);
}

export function mapStockForPrisma(productData: Product): Prisma.StockCreateManyArgs["data"] {
    return Object.entries(productData.stock).map(([size, quantity]) => ({
        productId: productData.id,
        size: size as Sizes,
        quantity,
    }));
}

export function buildStockObjForClient(stock: PrismaStock[]): Product["stock"] {
    return stock.reduce((acc, stockItem) => {
        acc[stockItem.size] = stockItem.quantity;
        return acc;
    }, {} as Product["stock"]);
}

export function processDateForClient(date?: Date): string {
    return (date ? date : new Date()).toISOString().split("T")[0];
}

export function processDateForClientDate(date?: Date): string {
    return (date ? date : new Date())
        .toLocaleDateString("en-us", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
        .replace(/,/g, "");
}

export function pluralise(word: string, count: number): string {
    return count === 1 ? word : word + "s";
}

export function extractFilters<T extends string>(
    param: string | null,
    validValues: readonly T[] | T[]
): T[] {
    if (!param) return [];
    return param.split("|").filter((val): val is T => validValues.includes(val as T));
}

export function extractSort(param: string | null): ProductSortKey | "placeholder" {
    return param && param in SORT_OPTIONS ? (param as ProductSortKey) : "placeholder";
}

export function isolateInteraction(
    e: React.TouchEvent | React.MouseEvent | React.KeyboardEvent
): void {
    e.preventDefault();
}

export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function createBagItem(product: Product, size: Sizes): BagItem {
    return { product, size, quantity: 1 };
}

export function buildProductUrl(id: string, slug: string): string {
    return `/products/${id}/${encodeURIComponent(slug)}`;
}

export function buildAdminProductUrl(id: string): string {
    return `/admin/products/${id}`;
}

export function getAllTabbable(container: HTMLElement): NodeListOf<HTMLElement> {
    return container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
}

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

export function checkIsWithinReturnWindow(date: Date): boolean {
    return Date.now() - date.getTime() <= REFUND_WINDOW;
}

export function addReturnWindowDelta(date: Date): Date {
    return new Date(date.getTime() + REFUND_WINDOW);
}
