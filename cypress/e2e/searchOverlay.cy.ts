describe("Search overlay base tests", () => {
    beforeEach(() => {
        cy.visitHome();
        cy.wait(1000);
        cy.get("[aria-label='Search']").click();
    });

    it("opens when navbar 'Search' button clicked", () => {
        cy.get("#search-overlay-container").should("exist");
    });

    it("stacks above the navbar", () => {
        cy.get("#navbar").should("not.be.visible");
    });

    it("navigates to search results page on 'Enter' key press when no suggestion is selected", () => {
        cy.get("#search-overlay-container input[name='search']").type("logo");
        cy.get("#search-overlay-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("form").submit(); // "Enter" press equivalent
        cy.wait(1000);
        cy.url().should("contain", "/results?q=logo");
    });

    it("navigates to the product page on 'Enter' key press when a suggestion is selected", () => {
        cy.get("#search-overlay-container input[name='search']").as("search-input");

        cy.get("@search-input").type("logo");
        cy.get("#search-overlay-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("@search-input").trigger("keydown", { keyCode: 40 }); // arrow down
        cy.get("@search-input").trigger("keydown", { keyCode: 13 }); // enter
        cy.wait(1000);
        cy.url().should("contain", "/products/");
    });

    it("navigates to search results page on submit button click when no suggestion is selected", () => {
        cy.get("#search-overlay-container input[name='search']").type("logo");
        cy.get("#search-overlay-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("#search-overlay-container [aria-label='Submit search']").click();
        cy.wait(1000);
        cy.url().should("contain", "/results?q=logo");
    });

    it("navigates to search results page on submit button click when a suggestion is selected", () => {
        cy.get("#search-overlay-container input[name='search']").as("search-input");

        cy.get("@search-input").type("logo");
        cy.get("#search-overlay-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("@search-input").trigger("keydown", { keyCode: 40 }); // arrow down
        cy.get("#search-overlay-container [aria-label='Submit search']").click();
        cy.wait(1000);
        cy.url().should("contain", "/results?q=");
    });

    it("navigates to the product page on suggestion click", () => {
        cy.get("#search-overlay-container input[name='search']").type("logo");

        cy.get("#search-overlay-container .suggestions-container li").as("suggestions-list");

        cy.get("@suggestions-list").should("have.length.greaterThan", 0);
        cy.get("@suggestions-list").first().click();
        cy.wait(1000);
        cy.url().should("contain", "/products/");
    });

    it("shows fallback when there are no suggestions", () => {
        cy.get("#search-overlay-container input[name='search']").type("logoo");

        cy.get("#search-overlay-container .suggestions-container li").as("suggestions-list");

        cy.get("@suggestions-list").should("have.length", 1);
        cy.get("@suggestions-list").first().should("have.text", "No results found");
        cy.get("@suggestions-list").first().click();
        cy.wait(1000);
        cy.location("pathname").should("eq", "/");
    });

    it("closes as expected", () => {
        cy.get("#search-overlay-container [aria-label='Close search']").click();
        cy.get("#search-overlay-container").should("not.exist");
        cy.get("#navbar").should("be.visible");
    });
});

describe("Search overlay accessibility tests", () => {
    beforeEach(() => {
        cy.visitHome();
        cy.wait(1000);
        cy.get("[aria-label='Search']").click();
    });

    it("gives focus to the input on opening", () => {
        cy.get("#search-overlay-container input[name='search']").should("be.focused");
    });

    it("restores focus on closing", () => {
        cy.get("#search-overlay-container [aria-label='Close search']").click();
        cy.get("[aria-label='Search']").should("have.focus");
    });

    it("traps focus correctly", () => {
        cy.get("#search-overlay-container input[name='search']").as("search-input");

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
});
