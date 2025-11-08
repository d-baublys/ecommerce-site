/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import { adminEmail, adminPassword, standardEmail, standardPassword } from "./credentials";
import "cypress-axe";
import "cypress-file-upload";

declare global {
    namespace Cypress {
        interface Chainable {
            visitHome(): Chainable<void>;
            visitHomeAwaitPathnameSettle(): Chainable<void>;
            visitCategoryPage(): Chainable<void>;
            visitWishlist(): Chainable<void>;
            visitBag(): Chainable<void>;
            visitLogInPage(): Chainable<void>;
            visitCreateAccountPage(): Chainable<void>;
            visitAddProductPage(): Chainable<void>;
            visitOrdersPage(): Chainable<void>;
            visitAdminOrdersPage(): Chainable<void>;
            visitTestAdminProduct(testProductUrl: string): Chainable<void>;
            visitTestProduct(testProductUrl: string): Chainable<void>;
            logInAsAdmin(): Chainable<void>;
            logInAsStandardUser(): Chainable<void>;
            logInFromCurrent(): Chainable<void>;
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
            awaitPathnameSettle(): Chainable<void>;
            awaitInputBlur(): Chainable<void>;
            awaitTableSettle(): Chainable<void>;
            awaitWishlistUpdate(): Chainable<void>;
            awaitFilterUpdate(): Chainable<void>;
            resetDb(): Chainable<void>;
            resetUserCheckouts(): Chainable<void>;
            openSizeAccordionDesktop(): Chainable<void>;
            openSizeAccordionMobile(): Chainable<void>;
            openPriceAccordionDesktop(): Chainable<void>;
            openPriceAccordionMobile(): Chainable<void>;
        }
    }
}

Cypress.Commands.add("visitHome", () => {
    cy.visit("/");
    cy.location("pathname").should("eq", "/");
    cy.contains("Shop >>>").should("be.visible");
});

Cypress.Commands.add("visitHomeAwaitPathnameSettle", () => {
    cy.visitHome();
    cy.awaitPathnameSettle();
});

Cypress.Commands.add("visitCategoryPage", () => {
    cy.visit("/category/all");
    cy.location("pathname").should("eq", "/category/all");
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
    cy.contains("My Bag").should("be.visible");
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

Cypress.Commands.add("visitTestAdminProduct", (testProductUrl) => {
    cy.visit(testProductUrl);
    cy.location("pathname").should("eq", testProductUrl);
    cy.contains("Edit Product").should("be.visible");
});

Cypress.Commands.add("visitTestProduct", (testProductUrl) => {
    cy.visit(testProductUrl);
    cy.location("pathname").should("eq", testProductUrl);
    cy.contains("White & medium dark print").should("be.visible");
});

Cypress.Commands.add("logInAsAdmin", () => {
    cy.intercept("GET", "/api/auth/session").as("auth-check");
    cy.visit("/login");
    cy.get("input[name='email']").type(adminEmail);
    cy.get("input[name='password']").type(adminPassword);
    cy.get("button[type='submit']").click();
    cy.wait("@auth-check");
    cy.location("pathname").should("eq", "/");
    cy.contains("Shop >>>").should("be.visible");
});

Cypress.Commands.add("logInAsStandardUser", () => {
    cy.intercept("GET", "/api/auth/session").as("auth-check");
    cy.visit("/login");
    cy.get("input[name='email']").type(standardEmail);
    cy.get("input[name='password']").type(standardPassword);
    cy.get("button[type='submit']").click();
    cy.wait("@auth-check");
    cy.location("pathname").should("eq", "/");
    cy.contains("Shop >>>").should("be.visible");
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

Cypress.Commands.add("awaitPathnameSettle", () => {
    cy.wait(100); // prevent modals from prematurely closing from preceding pathname change
});

Cypress.Commands.add("awaitInputBlur", () => {
    cy.wait(200); // for fixed timeout on search bar blur
});

Cypress.Commands.add("awaitTableSettle", () => {
    cy.wait(100); // table row addition is very flaky without this
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
