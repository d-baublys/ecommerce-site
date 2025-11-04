import {
    BagItem,
    Product,
    Sizes,
    ProductSortId,
    ClientProduct,
    Stock,
    ClientStock,
    StockCreateInput,
    StockUpdateInput,
    ReservedItem,
} from "./types";
import bcrypt from "bcryptjs";
import { REFUND_WINDOW, SORT_OPTIONS, VALID_CATEGORIES } from "./constants";
import { ZodSafeParseError } from "zod";

export function debounce<T extends (...args: unknown[]) => void>(func: T, delay: number) {
    let timer: ReturnType<typeof setTimeout>;
    return function (...args: Parameters<T>) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

export function findBagItem(
    productId: ClientProduct["id"],
    size: Sizes,
    bag: BagItem[]
): BagItem | undefined {
    return bag.find((bagItem) => bagItem.productId === productId && bagItem.size === size);
}

export function isBagAddPermitted(
    currentBagQty: BagItem["quantity"],
    stockQty: number,
    totalReservedItems?: number
) {
    return !(
        currentBagQty >= Number(process.env.NEXT_PUBLIC_SINGLE_ITEM_MAX_QUANTITY) ||
        currentBagQty >= stockQty - (totalReservedItems ?? 0)
    );
}

export function calculateTotalReservedQty(items: ReservedItem[]): number {
    return items.reduce((total, curr) => total + curr.quantity, 0);
}

type SizeCheckResult = { success: true } | { success: false; error: "nil" | "limit" };

export function checkSizeAvailable(
    productData: ClientProduct,
    size: Sizes,
    bag: BagItem[],
    reservedItems: ReservedItem[]
): SizeCheckResult {
    const stockQty = productData.stock[size as Sizes] ?? 0;
    const itemInBag = findBagItem(productData.id, size, bag);
    const currentQty = itemInBag?.quantity ?? 0;
    const totalReservedItems = calculateTotalReservedQty(reservedItems);

    let result: SizeCheckResult = { success: true };
    const permitted = isBagAddPermitted(currentQty, stockQty, totalReservedItems);

    if (!permitted) {
        const error: "nil" | "limit" =
            currentQty >= Number(process.env.NEXT_PUBLIC_SINGLE_ITEM_MAX_QUANTITY)
                ? "limit"
                : "nil";

        result = {
            success: false,
            error,
        };
    }

    return result;
}

export function isUnique(sizeKey: Sizes, stockData: ClientStock) {
    return !Object.keys(stockData).includes(sizeKey);
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

export function formatImageName(fileName: string): string {
    return `/${fileName}`;
}

export function stripImagePath(filePath: string): string {
    return filePath.split("/").slice(-1)[0];
}

export function createEmptyProduct(): ClientProduct {
    return {
        id: "",
        name: "",
        gender: VALID_CATEGORIES[0].id,
        price: 0,
        slug: "",
        src: "",
        alt: "",
        dateAdded: new Date(),
        stock: {},
    };
}

export function convertPrismaProduct(product: Product & { stock: Stock[] }): ClientProduct {
    return {
        ...product,
        stock: buildStockForClient(product.stock),
    };
}

export function convertMultiplePrismaProducts(
    products: (Product & { stock: Stock[] })[]
): ClientProduct[] {
    return products.reduce(
        (arr, current) => [...arr, convertPrismaProduct(current)],
        [] as ClientProduct[]
    );
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

function areStocksEqual(stockA: ClientStock, stockB: ClientStock): boolean {
    const keysA = Object.keys(stockA) as Sizes[];
    const keysB = Object.keys(stockB) as Sizes[];

    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => stockA[key] === stockB[key]);
}

export function areProductsEqual(productA: ClientProduct, productB: ClientProduct): boolean {
    for (const key of Object.keys(productA) as (keyof ClientProduct)[]) {
        if (key === "stock") continue;

        if (productA[key] !== productB[key]) {
            return false;
        }
    }

    return areStocksEqual(productA.stock, productB.stock);
}

export function mapStockForProductCreate(stock: ClientStock): StockCreateInput[] {
    return Object.entries(stock).map(([size, quantity]) => ({
        size: size as Sizes,
        quantity,
    }));
}

export function mapStockForProductUpdate(product: ClientProduct): StockUpdateInput[] {
    return Object.entries(product.stock).map(([size, quantity]) => ({
        size: size as Sizes,
        quantity,
        productId: product.id,
    }));
}

export function buildStockForClient(stock: Stock[]): ClientStock {
    return stock.reduce((acc, stockItem) => {
        acc[stockItem.size] = stockItem.quantity;
        return acc;
    }, {} as ClientStock);
}

export function processDateForClient(date?: Date): string {
    const validDate = date instanceof Date && !isNaN(date.getTime()) ? date : new Date();
    return validDate.toISOString().split("T")[0];
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

export function extractSort(param: string | null): ProductSortId | "placeholder" {
    return param && param in SORT_OPTIONS ? (param as ProductSortId) : "placeholder";
}

export function isolateInteraction(
    e: React.TouchEvent | React.MouseEvent | React.KeyboardEvent
): void {
    e.preventDefault();
}

export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildBagItem(product: ClientProduct, size: Sizes): BagItem {
    return {
        productId: product.id,
        productName: product.name,
        price: product.price,
        size,
        quantity: 1,
    };
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

export function extractZodMessage(safeParseError: ZodSafeParseError<unknown>): string {
    return safeParseError.error.issues[0].message;
}

export function zodErrorResponse(safeParseError: ZodSafeParseError<unknown>): {
    success: false;
    error: string;
} {
    return { success: false, error: extractZodMessage(safeParseError) };
}
