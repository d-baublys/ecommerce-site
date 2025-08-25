describe("Login page", () => {
    beforeEach(() => {
        cy.visit("/login");
    });

    it("navigates to homepage after successful login by default", () => {
        cy.logInAsStandardUser();
        cy.location("pathname").should("eq", "/");
    });

    it("has no accessibility violations", () => {
        cy.wait(500);
        cy.injectAxe();
        cy.checkA11y();
    });
});
