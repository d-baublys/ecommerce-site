describe("Admin login page", () => {
    beforeEach(() => {
        cy.visit("/admin/login");
    });

    it("has no accessibility violations", () => {
        cy.wait(500);
        cy.injectAxe();
        cy.checkA11y();
    });
});
