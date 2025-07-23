import { email, password } from "../support/credentials";

describe("Admin route protection", () => {
    beforeEach(() => {
        cy.visit("/admin");
    });

    it("redirects to admin log in page if accessing an admin path unauthenticated", () => {
        cy.location("pathname").should("eq", "/admin/login");
    });

    it("shows the correct UI on successful admin login", () => {
        cy.get("input[name='username']").type(email);
        cy.get("input[name='password']").type(password);
        cy.get("button[type='submit']").click();
        cy.location("pathname").should("eq", "/admin");
        cy.contains("Admin Actions").should("be.visible");
    });
});
