describe("Product grid page accessbility tests", () => {
    beforeEach(() => {
        cy.largeBreakpoint();
        cy.visit("/category/all");
        cy.wait(1000);
    });

    it("prevents focus to filters when accordion sections are collapsed", () => {
        cy.get(".desktop-filtering").contains("button", "Size").focus();
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get(".desktop-filtering").contains("button", "Price").should("have.focus");
    });

    it("allows focus to filters when accordion sections are open", () => {
        cy.get(".desktop-filtering").contains("button", "Size").click();
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get(".desktop-filtering").contains("button", "Price").should("not.have.focus");
    });
});
