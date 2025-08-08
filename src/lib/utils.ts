import { Stock } from "@prisma/client";
import {
    BagItem,
    Product,
    PRODUCT_BASE_FIELDS,
    ProductBase,
    Sizes,
    VALID_CATEGORIES,
    VALID_SIZES,
    ProductSortKey,
    SORT_OPTIONS,
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

export function checkStock(productData: Product, productSize: Sizes, bag: BagItem[]) {
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

export function isValidStock(value: number) {
    return value >= 0;
}

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function isValidPrice(value: string) {
    return /^\d+(\.\d{1,2})?$/.test(value) && !isNaN(Number(value));
}

export function convertValidPrice(price: string) {
    return Math.round(Number(price) * 100);
}

export function stringifyConvertPrice(price: number) {
    return (price / 100).toFixed(2).toString();
}

export function slugify(name: string) {
    return name.toLowerCase().split(" ").join("-");
}

export function formatImagePath(filePath: string) {
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

export function containsClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) {
    const element = document.getElementById(id);
    return element ? element.contains(e.target as Node) : false;
}

export function areProductListsEqual(listA: Product[], listB: Product[]) {
    if (listA.length !== listB.length) return false;
    return listA.every((productA, idx) => productA.id === listB[idx].id);
}

function areStocksEqual(stockA: Product["stock"], stockB: Product["stock"]) {
    const keysA = Object.keys(stockA) as Sizes[];
    const keysB = Object.keys(stockB) as Sizes[];

    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => stockA[key] === stockB[key]);
}

export function areProductsEqual(productA: Product, productB: Product) {
    for (const key of Object.keys(productA) as (keyof Product)[]) {
        if (key === "stock") continue;

        if (productA[key] !== productB[key]) {
            return false;
        }
    }

    return areStocksEqual(productA.stock, productB.stock);
}

export function mapStockForDb(productData: Product) {
    return Object.entries(productData.stock).map(([size, quantity]) => ({
        productId: productData.id,
        size: size as Sizes,
        quantity,
    }));
}

export function buildStockObj(stock: Stock[]) {
    return stock.reduce((acc, stockItem) => {
        acc[stockItem.size] = stockItem.quantity;
        return acc;
    }, {} as Product["stock"]);
}

export function extractProductFields(product: Product) {
    const keys = Object.keys(PRODUCT_BASE_FIELDS) as (keyof ProductBase)[];
    const resultInitial = Object.fromEntries(keys.map((key) => [key, product[key]])) as ProductBase;
    const result = { ...resultInitial, dateAdded: new Date(resultInitial.dateAdded) };

    return result;
}

export function processDateForClient(date?: Date) {
    return (date ? date : new Date()).toISOString().split("T")[0];
}

export function pluralise(word: string, count: number) {
    return count === 1 ? word : word + "s";
}

export function extractFilters<T extends string>(
    param: string | null,
    validValues: readonly T[] | T[]
) {
    if (!param) return [];
    return param.split("|").filter((val): val is T => validValues.includes(val as T));
}

export function extractSort(param: string | null) {
    return param && param in SORT_OPTIONS ? (param as ProductSortKey) : "placeholder";
}

export function isolateInteraction(e: React.TouchEvent | React.MouseEvent | React.KeyboardEvent) {
    e.preventDefault();
}

export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function createBagItem(product: Product, size: Sizes): BagItem {
    return { product, size, quantity: 1 };
}

export function buildProductUrl(slug: string) {
    return `/products/${encodeURIComponent(slug)}`;
}

export function getAllTabbable(container: HTMLElement) {
    return container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
}

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 12);
}

export async function comparePasswords(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}
