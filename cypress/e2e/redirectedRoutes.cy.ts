import { CypressSeedTestProduct } from "../../src/lib/definitions";
import { buildProductUrl } from "../../src/lib/utils";

let testProductLink: string;
let testProductId: string;

describe("Redirected routes", () => {
    before(() => {
        cy.task("getTestProductSavedData").then((data: CypressSeedTestProduct) => {
            testProductLink = buildProductUrl(data.id, data.slug);
            testProductId = data.id;
        });
    });

    it("redirects 'category' routes without a category segment", () => {
        cy.visit("/category");
        cy.location("pathname").should("eq", "/category/all");
    });

    it("redirects 'products' routes without id and slug segments", () => {
        cy.visit("/products");
        cy.location("pathname").should("eq", "/category/all");
    });

    it("redirects 'products' routes without an id segment", () => {
        cy.visit("/products/test-id-1");
        cy.location("pathname").should("eq", "/category/all");
    });

    it("redirects to canonical product page if slug segment doesn't match product slug", () => {
        cy.visit(`/products/${testProductId}/mismatched-slug`);
        cy.location("pathname").should("eq", testProductLink);
        cy.contains("button", "Add to Bag").should("be.visible");
    });
});
