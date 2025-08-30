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
import { buildProductUrl } from "../../src/lib/utils";

declare global {
    namespace Cypress {
        interface Chainable {
            logInAsAdmin(): Chainable<void>;
            logInAsStandardUser(): Chainable<void>;
            logInFromCurrent(): Chainable<void>;
            visitHome(): Chainable<void>;
            lessThanSmallBreakpoint(): Chainable<void>;
            smallBreakpoint(): Chainable<void>;
            lessThanLargeBreakpoint(): Chainable<void>;
            largeBreakpoint(): Chainable<void>;
            performTestScroll(): Chainable<void>;
            assertNoScroll(): Chainable<void>;
            assertScrollHookCssExist(): Chainable<void>;
            assertScrollHookCssNotExist(): Chainable<void>;
            awaitPathnameSettle(): Chainable<void>;
            visitHomeAwaitPathnameSettle(): Chainable<void>;
            awaitInputBlur(): Chainable<void>;
            awaitTableSettle(): Chainable<void>;
            visitTestAdminProduct(testProductLink: string): Chainable<void>;
            visitTestProduct(): Chainable<void>;
        }
    }
}

Cypress.Commands.add("visitHome", () => {
    cy.visit("/");
    cy.location("pathname").should("eq", "/");
    cy.contains("Shop >>>").should("be.visible");
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

Cypress.Commands.add("lessThanSmallBreakpoint", () => {
    cy.viewport(639, 600);
});

Cypress.Commands.add("smallBreakpoint", () => {
    cy.viewport(640, 600);
});

Cypress.Commands.add("largeBreakpoint", () => {
    cy.viewport(1024, 600);
});

Cypress.Commands.add("lessThanLargeBreakpoint", () => {
    cy.viewport(1023, 600);
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

Cypress.Commands.add("performTestScroll", () => {
    cy.scrollTo("bottom", { ensureScrollable: false });
});

Cypress.Commands.add("awaitPathnameSettle", () => {
    cy.wait(100); // prevent modals from prematurely closing from preceding pathname change
});

Cypress.Commands.add("visitHomeAwaitPathnameSettle", () => {
    cy.visitHome();
    cy.awaitPathnameSettle();
});

Cypress.Commands.add("awaitInputBlur", () => {
    cy.wait(200); // for fixed timeout on search bar blur
});

Cypress.Commands.add("awaitTableSettle", () => {
    cy.wait(100); // table row addition is very flaky without this
});

Cypress.Commands.add("visitTestAdminProduct", (testProductUrl) => {
    cy.visit(testProductUrl);
    cy.location("pathname").should("eq", testProductUrl);
    cy.contains("Edit Product").should("be.visible");
});

Cypress.Commands.add("visitTestProduct", () => {
    cy.task("getTestProductSavedData", {
        productName: "White & medium dark print",
        src: "/tshirt16.jpg",
    }).then((data: { id: string; slug: string }) => {
        const testProductLink = buildProductUrl(data.id, data.slug);
        cy.visit(testProductLink);
        cy.location("pathname").should("eq", testProductLink);
        cy.contains("White & medium dark print").should("be.visible");
    });
});
