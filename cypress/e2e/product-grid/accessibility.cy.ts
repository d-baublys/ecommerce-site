describe("Product grid page desktop accessbility tests", () => {
    beforeEach(() => {
        cy.breakpointLarge();
        cy.visitCategoryPage();
    });

    it("prevents focus to filters when filter accordion is collapsed", () => {
        cy.get(".desktop-filtering").contains("button", "Size").focus();
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get(".desktop-filtering").contains("button", "Price").should("have.focus");
    });

    it("allows focus to filters when filter accordion is open", () => {
        cy.get(".desktop-filtering").contains("button", "Size").click();
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get(".desktop-filtering").contains("button", "Price").should("not.have.focus");
    });

    it("has no accessibility violations in the base page state", () => {
        cy.injectAxe();
        cy.checkA11y();
    });

    it("has no accessibility violations when filter accordions are open", () => {
        cy.openSizeAccordionDesktop();
        cy.openPriceAccordionDesktop();
        cy.injectAxe();
        cy.checkA11y();
    });
});

describe("Product grid page mobile accessbility tests", () => {
    beforeEach(() => {
        cy.breakpointLessThanLarge();
        cy.visitCategoryPage();
    });

    it("has no accessibility violations in the base page state", () => {
        cy.injectAxe();
        cy.checkA11y();
    });

    it("has no accessibility violations when the filtering menu and and filter accordions are open", () => {
        cy.contains("button", "Filter").click();
        cy.openSizeAccordionMobile();
        cy.openPriceAccordionMobile();
        cy.injectAxe();
        cy.checkA11y();
    });
});
