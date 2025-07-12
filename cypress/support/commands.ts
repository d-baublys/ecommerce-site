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

import { email, password } from "./credentials";

declare global {
    namespace Cypress {
        interface Chainable {
            logInAsAdmin(): Chainable<void>;
            visitHome(): Chainable<void>;
            lessThanSmallBreakpoint(): Chainable<void>;
            smallBreakpoint(): Chainable<void>;
        }
    }
}

Cypress.Commands.add("visitHome", () => {
    cy.visit("/");
});

Cypress.Commands.add("logInAsAdmin", () => {
    cy.intercept("GET", "/api/auth/session").as("auth-check");
    cy.visit("/admin");
    cy.get("input[name='username']").type(email);
    cy.get("input[name='password']").type(password);
    cy.get("button[type='submit']").click();
    cy.wait("@auth-check");
    cy.location("pathname").should("eq", "/admin");
});

Cypress.Commands.add("lessThanSmallBreakpoint", () => {
    cy.viewport(639, 600);
});

Cypress.Commands.add("smallBreakpoint", () => {
    cy.viewport(640, 600);
});
