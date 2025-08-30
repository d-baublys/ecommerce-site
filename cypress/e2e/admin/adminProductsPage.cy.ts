describe("Admin products page", () => {
    beforeEach(() => {
        cy.logInAsAdmin();
        cy.visit("/admin/products");
        cy.location("pathname").should("eq", "/admin/products");
        cy.get("h1").contains("Products").should("be.visible");
    });

    it("shows correct initial prompt", () => {
        cy.contains("Please select a filter or search by keyword").should("be.visible");
    });

    it("shows expected number of products on filter toggle on", () => {
        cy.contains("button", "Men's").click();
        cy.get("#admin-products-container li").should("have.length", 8);

        cy.contains("button", "Women's").click();
        cy.get("#admin-products-container li").should("have.length", 8);
    });

    it("reverts to initial state on filter toggle off", () => {
        cy.contains("button", "Men's").click();
        cy.get("#admin-products-container li").should("have.length", 8);

        cy.contains("button", "Men's").click();
        cy.get("#admin-products-container").should("not.exist");
        cy.contains("Please select a filter or search by keyword").should("be.visible");
    });

    it("shows expected number of products when search query returns results", () => {
        cy.get("#admin-product-search-container [aria-label='Search input']").type("logo");
        cy.get("#admin-products-container li").should("have.length.greaterThan", 0);
    });

    it("shows expected message when search query returns no results", () => {
        cy.get("#admin-product-search-container [aria-label='Search input']").type("logoo");
        cy.get("#admin-products-container").should("not.exist");
        cy.contains("No products matching your search");
    });

    it("reverts to initial state on search query key input delete without any filters", () => {
        cy.get("#admin-product-search-container [aria-label='Search input']").type("logo");
        cy.get("#admin-products-container li").should("have.length.greaterThan", 0);

        cy.get("#admin-product-search-container [aria-label='Search input']").type(
            "{backspace}{backspace}{backspace}{backspace}"
        );
        cy.get("#admin-products-container").should("not.exist");
        cy.contains("Please select a filter or search by keyword").should("be.visible");
    });

    it("reverts to initial state on 'clear' button search query delete without any filters", () => {
        cy.get("#admin-product-search-container [aria-label='Search input']").type("logo");
        cy.get("#admin-products-container li").should("have.length.greaterThan", 0);

        cy.get("#admin-product-search-container [aria-label='Clear search']").click();
        cy.get("#admin-products-container").should("not.exist");
        cy.contains("Please select a filter or search by keyword").should("be.visible");
    });

    it("shows expected number of products with combined filter toggle & search query", () => {
        cy.contains("button", "Women's").click();
        cy.get("#admin-product-search-container [aria-label='Search input']").type("logo");
        cy.get("#admin-products-container li").should("have.length", 2);
    });

    it("shows expected number of products on search query key input delete after combined filter toggle & search query", () => {
        cy.contains("button", "Women's").click();
        cy.get("#admin-product-search-container [aria-label='Search input']").type("logo");
        cy.get("#admin-products-container li").should("have.length", 2);
        cy.get("#admin-product-search-container [aria-label='Search input']").type(
            "{backspace}{backspace}{backspace}{backspace}"
        );
        cy.get("#admin-products-container li").should("have.length", 8);
    });

    it("shows expected number of products on 'clear' button search query delete after combined filter toggle & search query", () => {
        cy.contains("button", "Women's").click();
        cy.get("#admin-product-search-container [aria-label='Search input']").type("logo");
        cy.get("#admin-products-container li").should("have.length", 2);
        cy.get("#admin-product-search-container [aria-label='Clear search']").click();
        cy.get("#admin-products-container li").should("have.length", 8);
    });

    it("doesn't trigger search when search query is whitespace-only without any filters", () => {
        cy.get("#admin-product-search-container [aria-label='Search input']").type(" ");
        cy.get("#admin-products-container").should("not.exist");
        cy.contains("Please select a filter or search by keyword");
        cy.get("#admin-product-search-container [aria-label='Search input']").type("   ");
        cy.get("#admin-products-container").should("not.exist");
        cy.contains("Please select a filter or search by keyword");
    });

    it("doesn't trigger search when search query is whitespace-only with a filter on", () => {
        cy.contains("button", "Women's").click();
        cy.get("#admin-products-container li").should("have.length", 8);
        cy.get("#admin-product-search-container [aria-label='Search input']").type(" ");
        cy.get("#admin-products-container li").should("have.length", 8);
        cy.get("#admin-product-search-container [aria-label='Search input']").type("   ");
        cy.get("#admin-products-container li").should("have.length", 8);
    });

    it("triggers search correctly when search query contains whitespace", () => {
        cy.get("#admin-product-search-container [aria-label='Search input']").type("white");
        cy.get("#admin-products-container li").should("have.length.greaterThan", 1);
        cy.get("#admin-product-search-container [aria-label='Search input']").type(" & medium");
        cy.get("#admin-products-container li").should("have.length", 1);
    });

    it("navigates to admin product edit page on product tile click", () => {
        cy.contains("button", "Men's").click();
        cy.get("#admin-products-container li").first().click();
        cy.url().should("contain", "/admin/products/");
        cy.contains("h1", "Edit Product").should("be.visible");
    });

    it("navigates to admin product add page on link click", () => {
        cy.contains("a", "+ Add Product").click();
        cy.location("pathname").should("eq", "/admin/products/add-product");
        cy.contains("Add Product").should("be.visible");
    });

    it("has no accessibility violations", () => {
        cy.injectAxe();
        cy.checkA11y();
    });
});
