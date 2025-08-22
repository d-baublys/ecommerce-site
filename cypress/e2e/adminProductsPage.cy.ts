describe("Admin products page", () => {
    beforeEach(() => {
        cy.logInAsAdmin();
        cy.visit("/admin/products");
    });

    it("has no accessibility violations", () => {
        cy.wait(500);
        cy.injectAxe();
        cy.checkA11y();
    });
});
