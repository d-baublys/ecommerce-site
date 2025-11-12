describe("Search results page", () => {
    beforeEach(() => {
        cy.visitHome();
        cy.get("[aria-label='Search']").click();
        cy.get("#search-overlay-container [aria-label='Search input']").as("search-input");
    });

    it("shows a message when search returns no results", () => {
        cy.get("@search-input").type("type");
        cy.get("form").submit(); // "Enter" press equivalent
        cy.contains("Results for").should("be.visible");
        cy.get(".grid-tile-container .product-tile").should("have.length", 0);
        cy.contains("No products matching your search").should("be.visible");
        cy.contains(/0\s*Items/).should("be.visible");
        cy.contains('Results for "type"').should("be.visible");
    });

    it("shows all expected products when search returns results", () => {
        cy.get("@search-input").type("lOgO");
        cy.get("form").submit(); // "Enter" press equivalent
        cy.contains("Results for").should("be.visible");
        cy.get(".grid-tile-container .product-tile").should("have.length", 5); // 6 less 1 unstocked
        cy.contains(/5\s*Items/).should("be.visible");
        cy.contains('Results for "lOgO"').should("be.visible");
    });
});
