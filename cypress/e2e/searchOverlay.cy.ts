describe("Search overlay base tests", () => {
    beforeEach(() => {
        cy.visitHome();
        cy.get("[aria-label='Search']").click();
        cy.get("#search-overlay-container").should("exist").and("be.visible");
    });

    it("opens when navbar 'Search' button clicked", () => {
        cy.get("#search-overlay-container [aria-label='Search input']").should("be.visible");
    });

    it("closes as expected", () => {
        cy.get("#search-overlay-container [aria-label='Close search']").click();
        cy.get("#search-overlay-container").should("not.exist");
        cy.get("#navbar").should("be.visible");
    });

    it("closes on pathname change", () => {
        cy.get("#search-overlay-container [aria-label='Close search']").click();

        cy.get("#navbar [aria-label='Bag']").click();
        cy.location("pathname").should("eq", "/bag");
        cy.contains("My Bag").should("be.visible");
        cy.get("[aria-label='Search']").click();
        cy.get("#search-overlay-container").should("exist");
        cy.go("back");
        cy.get("#search-overlay-container").should("not.exist");
    });

    it("stacks above the navbar", () => {
        cy.get("#navbar").should("not.be.visible");
    });

    it("navigates to search results page on 'Enter' key press when no suggestion is selected", () => {
        cy.get("#search-overlay-container [aria-label='Search input']").type("logo");
        cy.get("#search-overlay-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("form").submit(); // "Enter" press equivalent
        cy.get("#search-overlay-container").should("not.exist");
        cy.url().should("contain", "/results?q=logo");
        cy.get(".grid-tile-container .product-tile").should("have.length.greaterThan", 0);
    });

    it("navigates to the product page on 'Enter' key press when a suggestion is selected", () => {
        cy.get("#search-overlay-container [aria-label='Search input']").as("search-input");

        cy.get("@search-input").type("logo");
        cy.get("#search-overlay-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("@search-input").trigger("keydown", { keyCode: 40 }); // arrow down
        cy.get("@search-input").trigger("keydown", { keyCode: 13 }); // enter
        cy.get("#search-overlay-container").should("not.exist");
        cy.url().should("contain", "/products/");
        cy.contains("Add to Bag").should("be.visible");
    });

    it("navigates to search results page on submit button click when no suggestion is selected", () => {
        cy.get("#search-overlay-container [aria-label='Search input']").type("logo");
        cy.get("#search-overlay-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("#search-overlay-container [aria-label='Submit search']").click();
        cy.get("#search-overlay-container").should("not.exist");
        cy.url().should("contain", "/results?q=logo");
        cy.get(".grid-tile-container .product-tile").should("have.length.greaterThan", 0);
    });

    it("navigates to search results page on submit button click when a suggestion is selected", () => {
        cy.get("#search-overlay-container [aria-label='Search input']").as("search-input");

        cy.get("@search-input").type("logo");
        cy.get("#search-overlay-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("@search-input").trigger("keydown", { keyCode: 40 }); // arrow down
        cy.get("#search-overlay-container [aria-label='Submit search']").click();
        cy.get("#search-overlay-container").should("not.exist");
        cy.url().should("contain", "/results?q=");
        cy.get(".grid-tile-container .product-tile").should("have.length.greaterThan", 0);
    });

    it("navigates to the product page on suggestion click", () => {
        cy.get("#search-overlay-container [aria-label='Search input']").type("logo");

        cy.get("#search-overlay-container .suggestions-container li").as("suggestions-list");

        cy.get("@suggestions-list").should("have.length.greaterThan", 0);
        cy.get("@suggestions-list").first().click();
        cy.get("#search-overlay-container").should("not.exist");
        cy.url().should("contain", "/products/");
        cy.contains("Add to Bag").should("be.visible");
    });

    it("shows fallback when there are no suggestions", () => {
        cy.get("#search-overlay-container [aria-label='Search input']").type("logoo");

        cy.get("#search-overlay-container .suggestions-container li").as("suggestions-list");

        cy.get("@suggestions-list").should("have.length", 1);
        cy.get("@suggestions-list").first().should("have.text", "No results found");
        cy.get("@suggestions-list").first().click();
        cy.get("#search-overlay-container").should("exist");
        cy.location("pathname").should("eq", "/");
    });

    it("excludes unstocked products from suggestions", () => {
        cy.get("#search-overlay-container [aria-label='Search input']").type("logo");
        cy.get("#search-overlay-container .suggestions-container").should(
            "contain",
            "White & large dark logo"
        );
        cy.get("#search-overlay-container .suggestions-container").should(
            "not.contain",
            "Black & small company logo"
        );
    });

    it("doesn't trigger search when search query is whitespace-only", () => {
        cy.get("#search-overlay-container [aria-label='Search input']").type("  ");
        cy.get("#search-overlay-container .suggestions-container li").as("suggestions-list");

        cy.get("@suggestions-list").should("have.length", 1);
        cy.get("@suggestions-list").first().should("have.text", "No results found");
    });

    it("triggers search correctly when search query contains whitespace", () => {
        cy.get("#search-overlay-container [aria-label='Search input']").as("search-input");
        cy.get("@search-input").type("white");
        cy.get("#search-overlay-container .suggestions-container li").as("suggestions-list");
        cy.get("@suggestions-list").should("have.length.greaterThan", 0);
        cy.get("@search-input").type(" & medium");
        cy.get("@suggestions-list").should("have.length", 1);
    });

    it("locks scrolling when overlay is open", () => {
        cy.assertScrollHookCssExist();
        cy.performTestScroll();
        cy.assertNoScroll();
        cy.get("#search-overlay-container [aria-label='Close search']").click();
        cy.get("#search-overlay-container").should("not.exist");
        cy.assertScrollHookCssNotExist();
        cy.assertNoScroll();
    });
});

describe("Search overlay accessibility tests", () => {
    beforeEach(() => {
        cy.visitHome();
        cy.get("[aria-label='Search']").click();
        cy.get("#search-overlay-container").should("exist");
    });

    it("gives focus to the input on opening", () => {
        cy.get("#search-overlay-container [aria-label='Search input']").should("be.focused");
    });

    it("restores focus on closing", () => {
        cy.get("#search-overlay-container [aria-label='Close search']").click();
        cy.get("#search-overlay-container").should("not.exist");
        cy.get("[aria-label='Search']").should("have.focus");
    });

    it("traps focus correctly", () => {
        cy.get("#search-overlay-container [aria-label='Search input']").as("search-input");

        cy.get("@search-input").should("be.focused");
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get("#search-overlay-container [aria-label='Clear search']").should("be.focused");
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get("#search-overlay-container [aria-label='Close search']").should("be.focused");
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get("#search-overlay-container [aria-label='Submit search']").should("be.focused");
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get("@search-input").should("be.focused");
    });

    it("has no accessibility violations in the base page state", () => {
        cy.get("#search-overlay-container [aria-label='Search input']").should("be.focused");
        cy.injectAxe();
        cy.checkA11y();
    });

    it("has no accessibility violations when displaying suggestions", () => {
        cy.get("#search-overlay-container [aria-label='Search input']").type("logo");
        cy.get("#search-overlay-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.injectAxe();
        cy.checkA11y();
    });
});
