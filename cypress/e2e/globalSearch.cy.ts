describe("Global search functionality", () => {
    it("navigates to search results page on submit button click", () => {
        cy.visit("/");
        cy.get("[aria-label='Search']").click();
        cy.get("input[name='search']").type("logo");
        cy.get("button[type='submit']").click();
        cy.url().should("contain", "/results?q=logo");
    });
});
