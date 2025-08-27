describe("Admin products page", () => {
    beforeEach(() => {
        cy.logInAsAdmin();
        cy.visit("/admin/products");
        cy.location("pathname").should("eq", "/admin/products");
        cy.get("h1").contains("Products").should("be.visible");
    });

    it("has no accessibility violations", () => {
        cy.injectAxe();
        cy.checkA11y();
    });
});
