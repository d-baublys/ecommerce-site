import { email, password } from "../support/credentials";

describe("Admin route protection", () => {
    it("redirects to admin log in page if accessing an admin path unauthenticated", () => {
        cy.visit("/admin");
        cy.location("pathname").should("eq", "/admin/login");
    });

    it("shows the correct UI on successful admin login", () => {
        cy.visit("/admin");
        cy.get("input[name='username']").type(email);
        cy.get("input[name='password']").type(password);
        cy.get("button[type='submit']").click();
        cy.contains("Admin Actions").should("be.visible");
    });
});
