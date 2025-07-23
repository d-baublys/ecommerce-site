import { email, password } from "../support/credentials";

describe("Admin products page", () => {
    beforeEach(() => {
        cy.visit("/admin");
        cy.get("input[name='username']").type(email);
        cy.get("input[name='password']").type(password);
        cy.get("button[type='submit']").click();
        cy.location("pathname").should("eq", "/admin");
        cy.visit("/admin/products");
    });

    it("has no accessibility violations", () => {
        cy.wait(500);
        cy.injectAxe();
        cy.checkA11y();
    });
});
