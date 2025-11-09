import { fakeUuid } from "../../src/lib/test-factories";
import { CypressTestProductData } from "../../src/lib/types";
import { buildProductUrl } from "../../src/lib/utils";

let testProductLink: string;
let testProductId: string;

describe("Dynamic route redirects", () => {
    before(() => {
        cy.task("getTestProductSavedData").then((data: CypressTestProductData) => {
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

    it("redirects 'products' routes without a slug segment", () => {
        cy.visit(`/products/${fakeUuid}`);
        cy.location("pathname").should("eq", "/category/all");
    });

    it("redirects to canonical product page if slug segment doesn't match product slug", () => {
        cy.visit(`/products/${testProductId}/mismatched-slug`);
        cy.location("pathname").should("eq", testProductLink);
        cy.contains("button", "Add to Bag").should("be.visible");
    });
});

describe("Dynamic invalid routes", () => {
    it("renders 'not found' page for 'category' routes with an invalid slug segment", () => {
        cy.visit("/category/a-slug", { failOnStatusCode: false });
        cy.location("pathname").should("eq", "/category/a-slug");
        cy.contains("Oops! It seems the page you're looking for doesn't exist.").should(
            "be.visible"
        );
    });

    it("redirects main 'product' routes with an invalid 'id' segment", () => {
        cy.visit("/products/some-id");
        cy.location("pathname").should("eq", "/category/all");
    });

    it("renders 'not found' page for admin 'product' routes with an invalid 'id' segment", () => {
        cy.logInAsAdmin();
        cy.visit("/admin/products/some-id", { failOnStatusCode: false });
        cy.location("pathname").should("eq", "/admin/products/some-id");
        cy.contains("Oops! It seems the page you're looking for doesn't exist.").should(
            "be.visible"
        );
    });

    it("renders 'not found' page for admin 'order' routes with an invalid 'id' segment", () => {
        cy.logInAsAdmin();
        cy.visit("/admin/orders/some-id", { failOnStatusCode: false });
        cy.location("pathname").should("eq", "/admin/orders/some-id");
        cy.contains("Oops! It seems the page you're looking for doesn't exist.").should(
            "be.visible"
        );
    });
});
