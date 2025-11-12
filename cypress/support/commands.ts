/// <reference types="cypress" />

import { adminEmail, adminPassword, standardEmail, standardPassword } from "./credentials";
import "cypress-axe";
import "cypress-file-upload";
import {
    Categories,
    CypressTestDataDeleteParams,
    CypressTestProductData,
} from "../../src/lib/types";

declare global {
    namespace Cypress {
        interface Chainable {
            visitHome(): Chainable<void>;
            visitCategoryPage(categoryId?: "all" | Categories): Chainable<void>;
            visitWishlist(): Chainable<void>;
            visitBag(): Chainable<void>;
            visitLogInPage(): Chainable<void>;
            visitCreateAccountPage(): Chainable<void>;
            visitAddProductPage(): Chainable<void>;
            visitOrdersPage(): Chainable<void>;
            visitAdminOrdersPage(): Chainable<void>;
            visitTestProduct(testProductUrl: string): Chainable<void>;
            visitTestAdminProduct(testAdminProductUrl: string): Chainable<void>;
            logInAsAdmin(featuredCount?: number): Chainable<void>;
            logInAsStandardUser(): Chainable<void>;
            logInFromCurrent(): Chainable<void>;
            logOut(): Chainable<void>;
            breakpointLessThanSmall(): Chainable<void>;
            breakpointSmall(): Chainable<void>;
            breakpointLessThanLarge(): Chainable<void>;
            breakpointLarge(): Chainable<void>;
            performTestScroll(): Chainable<void>;
            assertNoScroll(): Chainable<void>;
            assertScrollHookCssExist(): Chainable<void>;
            assertScrollHookCssNotExist(): Chainable<void>;
            assertFormMessage(expectedMessage: string): Chainable<void>;
            assertTableMessage(expectedMessage: string): Chainable<void>;
            assertHomeSettled(featuredCount?: number): Chainable<void>;
            assertBreadcrumbs(targetJoinedBreadcrumbs: string): Chainable<void>;
            awaitInputBlur(): Chainable<void>;
            awaitTableSettle(): Chainable<void>;
            awaitBagUpdate(): Chainable<void>;
            awaitWishlistUpdate(): Chainable<void>;
            awaitFilterUpdate(): Chainable<void>;
            resetDb(): Chainable<void>;
            resetUserCheckouts(): Chainable<void>;
            openSizeAccordionDesktop(): Chainable<void>;
            openSizeAccordionMobile(): Chainable<void>;
            openPriceAccordionDesktop(): Chainable<void>;
            openPriceAccordionMobile(): Chainable<void>;
            buildTestBag(testProductLink: string): Chainable<void>;
            decrementTestProductStock(testProductAdminLink: string): Chainable<void>;
            createReservedItems(testProductLink: string): Chainable<void>;
            createTestOrder({
                orderIds,
                productIds,
            }: {
                productIds: CypressTestDataDeleteParams["productIds"];
                orderIds: CypressTestDataDeleteParams["orderIds"];
            }): Chainable<void>;
            clearTestData({
                orderIds,
                productIds,
            }: {
                productIds: CypressTestDataDeleteParams["productIds"];
                orderIds?: CypressTestDataDeleteParams["orderIds"];
            }): Chainable<void>;
        }
    }
}

Cypress.Commands.add("visitHome", () => {
    cy.visit("/");
    cy.assertHomeSettled();
});

Cypress.Commands.add("visitCategoryPage", (categoryId) => {
    cy.visit(`/category/${categoryId ?? "all"}`);
    cy.location("pathname").should("eq", `/category/${categoryId ?? "all"}`);
    cy.get("#loading-indicator").should("not.exist");
    cy.contains(/\d+\s*Item(s)?/).should("be.visible");
});

Cypress.Commands.add("visitWishlist", () => {
    cy.visit("/wishlist");
    cy.contains(/\d+\s*Item(s)?/).should("be.visible");
});

Cypress.Commands.add("visitBag", () => {
    cy.visit("/bag");
    cy.location("pathname").should("eq", "/bag");
    cy.contains("My Bag").should("exist");
});

Cypress.Commands.add("visitLogInPage", () => {
    cy.visit("/login");
    cy.location("pathname").should("eq", "/login");
    cy.contains("Log In").should("be.visible");
});

Cypress.Commands.add("visitCreateAccountPage", () => {
    cy.visit("/create-account");
    cy.location("pathname").should("eq", "/create-account");
    cy.contains("Create Account").should("be.visible");
});

Cypress.Commands.add("visitAddProductPage", () => {
    cy.visit("/admin/products/add-product");
    cy.location("pathname").should("eq", "/admin/products/add-product");
    cy.contains("Add Product").should("be.visible");
});

Cypress.Commands.add("visitOrdersPage", () => {
    cy.visit("/orders");
    cy.location("pathname").should("eq", "/orders");
    cy.contains("My Orders").should("be.visible");
});

Cypress.Commands.add("visitAdminOrdersPage", () => {
    cy.visit("/admin/orders");
    cy.location("pathname").should("eq", "/admin/orders");
    cy.contains("Orders").should("be.visible");
});

Cypress.Commands.add("visitTestAdminProduct", (testAdminProductUrl) => {
    cy.visit(testAdminProductUrl);
    cy.location("pathname").should("eq", testAdminProductUrl);
    cy.contains("Edit Product").should("be.visible");
    cy.awaitTableSettle();
});

Cypress.Commands.add("visitTestProduct", (testProductUrl) => {
    cy.visit(testProductUrl);
    cy.location("pathname").should("eq", testProductUrl);
    cy.contains("White & medium dark print").should("be.visible");
});

Cypress.Commands.add("logInAsAdmin", (featuredCount) => {
    cy.intercept("GET", "/api/auth/session").as("auth-check");
    cy.visit("/login");
    cy.get("input[name='email']").type(adminEmail);
    cy.get("input[name='password']").type(adminPassword);
    cy.get("button[type='submit']").click();
    cy.wait("@auth-check");
    cy.assertHomeSettled(featuredCount);
});

Cypress.Commands.add("logInAsStandardUser", () => {
    cy.intercept("GET", "/api/auth/session").as("auth-check");
    cy.visit("/login");
    cy.get("input[name='email']").type(standardEmail);
    cy.get("input[name='password']").type(standardPassword);
    cy.get("button[type='submit']").click();
    cy.wait("@auth-check");
    cy.assertHomeSettled();
});

Cypress.Commands.add("logOut", () => {
    cy.intercept("/api/auth/signout").as("log-out");

    cy.get("#navbar [aria-label='Account']").should("exist").click();
    cy.get("#account-menu").should("exist").and("be.visible");
    cy.contains("button", "Log Out").should("exist").and("be.visible").click();
    cy.wait("@log-out").its("response.statusCode").should("eq", 200);
    cy.get("#account-menu").should("not.be.visible");
});

Cypress.Commands.add("logInFromCurrent", () => {
    cy.intercept("GET", "/api/auth/session").as("auth-check");
    cy.get("input[name='email']").type(standardEmail);
    cy.get("input[name='password']").type(standardPassword);
    cy.get("button[type='submit']").click();
    cy.wait("@auth-check");
});

Cypress.Commands.add("breakpointLessThanSmall", () => {
    cy.viewport(639, 600);
});

Cypress.Commands.add("breakpointSmall", () => {
    cy.viewport(640, 600);
});

Cypress.Commands.add("breakpointLessThanLarge", () => {
    cy.viewport(1023, 600);
});

Cypress.Commands.add("breakpointLarge", () => {
    cy.viewport(1024, 600);
});

Cypress.Commands.add("performTestScroll", () => {
    cy.scrollTo("bottom", { ensureScrollable: false });
});

Cypress.Commands.add("assertNoScroll", () => {
    cy.window().then(($window) => {
        expect($window.scrollY).to.equal(0);
    });
});

Cypress.Commands.add("assertScrollHookCssExist", () => {
    cy.get("body").should("have.css", "overflow", "hidden");
    cy.get("body").should("have.css", "position", "fixed");
});

Cypress.Commands.add("assertScrollHookCssNotExist", () => {
    cy.get("body").should("not.have.css", "overflow", "hidden");
    cy.get("body").should("not.have.css", "position", "fixed");
});

Cypress.Commands.add("assertFormMessage", (expectedMessage) => {
    cy.get("#overall-action-container").contains("button", /^Add$/).click();
    cy.get("#overall-message-container").contains(expectedMessage).should("be.visible");
});

Cypress.Commands.add("assertTableMessage", (expectedMessage) => {
    cy.get("#stock-table-button-container").contains("button", /^Add$/).click();
    cy.get("#stock-table-message-container").contains(expectedMessage).should("be.visible");
});

Cypress.Commands.add("assertHomeSettled", (featuredCount = 2) => {
    cy.location("pathname").should("eq", "/");
    for (let i = 0; i < featuredCount; i++) {
        cy.get(`#featured-${i + 1}`).should("be.visible");
    }
});

Cypress.Commands.add("assertBreadcrumbs", (targetJoinedBreadcrumbs) => {
    cy.get("#breadcrumbs li").then(($items) => {
        const joined = [...$items].map((item) => item.innerText).join("");
        expect(joined).to.equal(targetJoinedBreadcrumbs);
    });
});

Cypress.Commands.add("awaitInputBlur", () => {
    cy.wait(200); // for fixed timeout on search bar blur
});

Cypress.Commands.add("awaitTableSettle", () => {
    cy.wait(100); // table row addition is very flaky without this
});

Cypress.Commands.add("awaitBagUpdate", () => {
    cy.wait(300); // for fixed delayed bag update
});

Cypress.Commands.add("awaitWishlistUpdate", () => {
    cy.wait(300); // for fixed delayed wishlist update
});

Cypress.Commands.add("awaitFilterUpdate", () => {
    cy.get("#loading-indicator").should("exist");
    cy.wait(400); // for fixed minimum throttling period
    cy.get("#loading-indicator").should("not.exist");
});

Cypress.Commands.add("resetDb", () => {
    cy.exec("npm run db:reset:test");
});

Cypress.Commands.add("resetUserCheckouts", () => {
    cy.visitBag();
});

Cypress.Commands.add("openSizeAccordionDesktop", () => {
    cy.get(".desktop-filtering").contains("button", "Size").click();
    cy.get(".desktop-filtering .size-btn-container").should("be.visible");
});

Cypress.Commands.add("openSizeAccordionMobile", () => {
    cy.get(".mobile-filtering").contains("button", "Size").click();
    cy.get(".mobile-filtering .size-btn-container").should("be.visible");
});

Cypress.Commands.add("openPriceAccordionDesktop", () => {
    cy.get(".desktop-filtering").contains("button", "Price").click();
    cy.get(".desktop-filtering .price-btn-container").should("be.visible");
});

Cypress.Commands.add("openPriceAccordionMobile", () => {
    cy.get(".mobile-filtering").contains("button", "Price").click();
    cy.get(".mobile-filtering .price-btn-container").should("be.visible");
});

Cypress.Commands.add("buildTestBag", (testProductLink) => {
    cy.visitTestProduct(testProductLink);
    cy.get("[aria-label='Size selection']").select("L");
    cy.contains("button", "Add to Bag").click();
    cy.get(".bag-confirm-modal").should("be.visible");
    cy.get("#close-modal-button").click();
    cy.get("[aria-label='Size selection']").select("XL");
    cy.contains("button", "Add to Bag").click();
    cy.get(".bag-confirm-modal").should("be.visible");
    cy.get("#close-modal-button").click();
    cy.contains("button", "Add to Bag").click();
    cy.get(".bag-confirm-modal").should("be.visible");
    cy.get("#close-modal-button").click();
});

Cypress.Commands.add("decrementTestProductStock", (testProductAdminLink) => {
    cy.logInAsAdmin();
    cy.visitTestAdminProduct(testProductAdminLink);
    cy.get("#stock-table-button-container").contains("button", "Edit").click();
    cy.get("[data-cy='quantity-input']").eq(3).should("not.be.disabled").clear();
    cy.get("[data-cy='quantity-input']").eq(4).clear().type("{moveToEnd}1");
    cy.get("#stock-table-button-container").contains("button", "Apply").click();
    cy.get("#overall-action-container").contains("button", "Save").click();
    cy.get("#overall-message-container").contains("Changes saved succesfully").should("be.visible");
});

Cypress.Commands.add("createReservedItems", (testProductLink) => {
    cy.intercept("POST", "/api/create-checkout-session").as("create-checkout-session");

    cy.logInAsAdmin();
    cy.visitTestProduct(testProductLink);
    cy.get("[aria-label='Size selection']").select("L");
    cy.contains("button", "Add to Bag").click();
    cy.get(".bag-confirm-modal").should("be.visible");
    cy.get("#close-modal-button").click();
    cy.visitBag();
    cy.contains("button", "Checkout").click();
    cy.get("#loading-indicator").should("exist");
    cy.wait("@create-checkout-session").its("response.statusCode").should("eq", 200);
    cy.get("#loading-indicator").should("not.exist");
    cy.logOut();
});

Cypress.Commands.add("createTestOrder", ({ productIds, orderIds }) => {
    cy.task("createCypressTestProduct").then((productData: CypressTestProductData) => {
        cy.task("createCypressTestOrder", { testProductsData: [productData] }).then(
            (orderId: CypressTestDataDeleteParams["orderIds"][number]) => {
                orderIds.push(orderId);
                productIds.push(productData.id);
            }
        );
    });
});

Cypress.Commands.add("clearTestData", ({ productIds, orderIds }) => {
    cy.task("deleteTestData", {
        orderIds,
        productIds,
    });
});
