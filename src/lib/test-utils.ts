import { Product, VALID_CATEGORIES } from "./definitions";
import { processDateForClient } from "./utils";

export function createTestProduct(overrides: Partial<Product> = {}): Product {
    return {
        id: "test-id-1",
        name: "Test Product 1",
        gender: Object.keys(VALID_CATEGORIES)[0] as keyof typeof VALID_CATEGORIES,
        price: 2500,
        slug: "test-product-1",
        src: "/nonexistent-img.jpg",
        alt: "Test product image",
        dateAdded: processDateForClient(),
        stock: { s: 8, m: 3, l: 12 },
        ...overrides,
    };
}
