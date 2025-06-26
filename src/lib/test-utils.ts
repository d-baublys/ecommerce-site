import { Product, VALID_CATEGORIES } from "./definitions";
import { processDateForClient, slugify } from "./utils";

export function createTestProduct(overrides: Partial<Product> = {}): Product {
    const name = "Test Product 1";

    return {
        id: "test-id-1",
        name,
        gender: Object.keys(VALID_CATEGORIES)[0] as keyof typeof VALID_CATEGORIES,
        price: 2500,
        slug: slugify(name),
        src: "/nonexistent-img.jpg",
        alt: "Test product image",
        dateAdded: processDateForClient(),
        stock: { s: 8, m: 3, l: 12 },
        ...overrides,
    };
}

export function createTestProductList() {
    const names = ["Test Product 1", "Test Product 2", "Test Product 3", "Test Product 4"];

    return [
        {
            id: "test-id-1",
            name: names[0],
            gender: Object.keys(VALID_CATEGORIES)[0] as keyof typeof VALID_CATEGORIES,
            price: 5500,
            slug: slugify(names[0]),
            src: "/nonexistent-img.jpg",
            alt: "Test product image 1",
            dateAdded: processDateForClient(),
            stock: { s: 1, m: 0, l: 0 },
        },
        {
            id: "test-id-2",
            name: names[1],
            gender: Object.keys(VALID_CATEGORIES)[1] as keyof typeof VALID_CATEGORIES,
            price: 9900,
            slug: slugify(names[1]),
            src: "/nonexistent-img.jpg",
            alt: "Test product image 2",
            dateAdded: processDateForClient(),
            stock: { s: 1, m: 1, l: 0 },
        },
        {
            id: "test-id-3",
            name: names[2],
            gender: Object.keys(VALID_CATEGORIES)[1] as keyof typeof VALID_CATEGORIES,
            price: 20100,
            slug: slugify(names[2]),
            src: "/nonexistent-img.jpg",
            alt: "Test product image 3",
            dateAdded: processDateForClient(),
            stock: { s: 1, m: 1, l: 0 },
        },
        {
            id: "test-id-4",
            name: names[3],
            gender: Object.keys(VALID_CATEGORIES)[0] as keyof typeof VALID_CATEGORIES,
            price: 15000,
            slug: slugify(names[3]),
            src: "/nonexistent-img.jpg",
            alt: "Test product image 4",
            dateAdded: processDateForClient(),
            stock: { s: 0, m: 0, l: 0 },
        },
    ];
}
