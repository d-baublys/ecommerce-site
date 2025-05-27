import { BagItem, Product, Sizes, VALID_CATEGORIES, VALID_SIZES } from "./definitions";

export function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
    let timer: ReturnType<typeof setTimeout>;
    return function (...args: Parameters<T>) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
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
    return (price / 100).toString();
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
        gender: VALID_CATEGORIES[0],
        price: 0,
        slug: "",
        src: "",
        alt: "",
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
