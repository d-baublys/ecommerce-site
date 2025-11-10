import { CypressTestDataDeleteParams, CypressTestProductData } from "../../src/lib/types";
import { buildAdminProductUrl, buildProductUrl } from "../../src/lib/utils";

let testProductLink: string;
let testProductId: string;

let orderIds: CypressTestDataDeleteParams["orderIds"] = [];
let productIds: CypressTestDataDeleteParams["productIds"] = [];

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
        cy.visit(`/products/${testProductId}`);
        cy.location("pathname").should("eq", "/category/all");
    });

    it("redirects to canonical product page if slug segment doesn't match product slug", () => {
        cy.visit(`/products/${testProductId}/mismatched-slug`);
        cy.location("pathname").should("eq", testProductLink);
        cy.contains("button", "Add to Bag").should("be.visible");
    });
});

describe("Invalid dynamic routes", () => {
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

describe("Valid dynamic route titles", () => {
    before(() => {
        cy.task("getTestProductSavedData").then((data: CypressTestProductData) => {
            testProductLink = buildProductUrl(data.id, data.slug);
            testProductId = data.id;
        });

        cy.createTestOrder({ orderIds, productIds });
    });

    it("shows correct titles for category pages", () => {
        cy.visitCategoryPage();
        cy.title().should("match", /All Products | DB Wear/);
        cy.visitCategoryPage("mens");
        cy.title().should("match", /Men's | DB Wear/);
        cy.visitCategoryPage("womens");
        cy.title().should("match", /Women's | DB Wear/);
    });

    it("shows correct title for main 'product' pages", () => {
        cy.visitTestProduct(testProductLink);
        cy.title().should("match", /White & medium dark print | DB Wear/);
    });

    it("shows correct title for individual 'admin' orders", () => {
        cy.logInAsAdmin();
        cy.visit(`/admin/orders/${orderIds[0]}`);
        cy.location("pathname").should("eq", `/admin/orders/${orderIds[0]}`);
        cy.title().should("match", new RegExp(`Order #${orderIds[0]} | DB Wear`));
    });
});

describe("Dynamic route breadcrumbs", () => {
    it("shows correct breadcrumbs for category pages and segments navigate correctly", () => {
        cy.visitCategoryPage();
        cy.assertBreadcrumbs("Home/Category/All");

        cy.get("#breadcrumbs li").eq(1).click();
        cy.location("pathname").should("eq", "/category/all");

        cy.visitCategoryPage();
        cy.get("#breadcrumbs li").eq(2).click();
        cy.location("pathname").should("eq", "/category/all");
    });

    it("shows correct breadcrumbs for 'main' product pages and segments navigate correctly", () => {
        cy.visitTestProduct(testProductLink);
        cy.assertBreadcrumbs("Home/Products/White & medium dark print");

        cy.get("#breadcrumbs li").eq(1).click();
        cy.location("pathname").should("eq", "/category/all");

        cy.visitTestProduct(testProductLink);
        cy.get("#breadcrumbs li").eq(2).click();
        cy.location("pathname").should("eq", testProductLink);
    });

    it("shows correct breadcrumbs for admin product pages and segments navigate correctly", () => {
        const url = buildAdminProductUrl(testProductId);

        cy.logInAsAdmin();
        cy.visitTestAdminProduct(url);
        cy.assertBreadcrumbs("Home/Admin/Products/White & medium dark print");

        cy.get("#breadcrumbs li").eq(1).click();
        cy.location("pathname").should("eq", "/admin");

        cy.visitTestAdminProduct(url);
        cy.get("#breadcrumbs li").eq(2).click();
        cy.location("pathname").should("eq", "/admin/products");

        cy.visitTestAdminProduct(url);
        cy.get("#breadcrumbs li").eq(3).click();
        cy.location("pathname").should("eq", url);
    });

    it("shows correct breadcrumbs for admin order pages and segments navigate correctly", () => {
        const url = `/admin/orders/${orderIds[0]}`;

        cy.logInAsAdmin();
        cy.visit(url);
        cy.assertBreadcrumbs(`Home/Admin/Orders/${orderIds[0]}`);

        cy.get("#breadcrumbs li").eq(1).click();
        cy.location("pathname").should("eq", "/admin");

        cy.visit(url);
        cy.get("#breadcrumbs li").eq(2).click();
        cy.location("pathname").should("eq", "/admin/orders");

        cy.visit(url);
        cy.get("#breadcrumbs li").eq(3).click();
        cy.location("pathname").should("eq", url);
    });

    after(() => {
        cy.clearTestData({ productIds, orderIds });
    });
});
