describe("Login page", () => {
    beforeEach(() => {
        cy.visit("/login");
    });

    it("has no accessibility violations", () => {
        cy.wait(500);
        cy.injectAxe();
        cy.checkA11y();
    });
});
