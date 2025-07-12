describe("Search overlay", () => {
    beforeEach(() => {
        cy.visitHome();
    });

    it("opens the search overlay when 'Search' button clicked", () => {
        cy.get("[aria-label='Search']").click();
        cy.get("#search-overlay-container").should("exist");
    });

    it("gives focus to the input on opening", () => {
        cy.get("[aria-label='Search']").click();
        cy.get("input[name='search']").should("be.focused");
    });

    it("should stack the search overlay above the navbar", () => {
        cy.get("[aria-label='Search'").click();
        cy.get("#navbar").should("not.be.visible");
    });

    it("navigates to search results page on 'Enter' key press", () => {
        cy.get("[aria-label='Search']").click();
        cy.get("input[name='search']").type("logo");
        cy.get("form").submit();
        cy.url().should("contain", "/results?q=logo");
    });

    it("navigates to search results page on submit button click", () => {
        cy.get("[aria-label='Search']").click();
        cy.get("input[name='search']").type("logo");
        cy.get("button[type='submit']").click();
        cy.url().should("contain", "/results?q=logo");
    });

    it("closes the search overlay as expected", () => {
        cy.get("[aria-label='Search']").click();
        cy.get("[aria-label='Close search']").click();
        cy.get("#search-overlay-container").should("not.exist");
        cy.get("#navbar").should("be.visible");
    });

    it("restores focus when search overlay is closed", () => {
        cy.get("[aria-label='Search']").click();
        cy.get("[aria-label='Close search']").click();
        cy.get("[aria-label='Search']").should("have.focus");
    });
});
