import { matchPriceRangeLabel, matchSizeLabel } from "../../../src/lib/test-utils";

describe("Product grid page desktop viewport tests", () => {
    beforeEach(() => {
        cy.breakpointLarge();
        cy.visitCategoryPage();
    });

    it("displays the correct number of items", () => {
        cy.get(".grid-tile-container .product-tile").should("have.length", 15);
        cy.contains(/15\s*Items/).should("be.visible"); // 16 total less 1 unstocked
    });

    it("displays the expected UI for the viewport", () => {
        cy.get("#filter-aside").should("be.visible");
        cy.contains("button", "Filter").should("not.be.visible");
    });

    it("displays the correct number of size filters", () => {
        cy.openSizeAccordionDesktop();
        cy.get(".desktop-filtering .size-btn-container li").should("have.length", 6);
        cy.get(".desktop-filtering .size-btn-container")
            .contains("button", matchSizeLabel(7, "XS"))
            .should("be.visible");
        cy.get(".desktop-filtering .size-btn-container")
            .contains("button", matchSizeLabel(14, "S"))
            .should("be.visible");
        cy.get(".desktop-filtering .size-btn-container")
            .contains("button", matchSizeLabel(14, "M"))
            .should("be.visible");
        cy.get(".desktop-filtering .size-btn-container")
            .contains("button", matchSizeLabel(15, "L"))
            .should("be.visible");
        cy.get(".desktop-filtering .size-btn-container")
            .contains("button", matchSizeLabel(15, "XL"))
            .should("be.visible");
        cy.get(".desktop-filtering .size-btn-container")
            .contains("button", matchSizeLabel(7, "XXL"))
            .should("be.visible");
    });

    it("displays the correct number of price filters", () => {
        cy.openPriceAccordionDesktop();
        cy.get(".desktop-filtering .price-btn-container li").should("have.length", 5);
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(4, "0", "49"))
            .should("be.visible");
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(4, "50", "99"))
            .should("be.visible");
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(4, "100", "149"))
            .should("be.visible");
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(2, "150", "199"))
            .should("be.visible");
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(4, "0", "49"))
            .should("be.visible");
    });

    it("filters correctly on single size filter selection", () => {
        cy.openSizeAccordionDesktop();
        cy.get(".desktop-filtering .size-btn-container")
            .contains("button", matchSizeLabel(7, "XXL"))
            .click();
        cy.awaitFilterUpdate();
        cy.get(".grid-tile-container .product-tile").should("have.length", 7);
        cy.contains(/7\s*Items/).should("be.visible");
    });

    it("filters correctly on compound size filter selection", () => {
        cy.openSizeAccordionDesktop();
        cy.get(".desktop-filtering .size-btn-container")
            .contains("button", matchSizeLabel(7, "XS"))
            .click();
        cy.awaitFilterUpdate();
        cy.get(".desktop-filtering .size-btn-container")
            .contains("button", matchSizeLabel(7, "XXL"))
            .click();
        cy.awaitFilterUpdate();
        cy.get(".grid-tile-container .product-tile").should("have.length", 14);
        cy.contains(/14\s*Items/).should("be.visible");
    });

    it("filters correctly on single price filter selection", () => {
        cy.openPriceAccordionDesktop();
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(1, "200"))
            .click();
        cy.awaitFilterUpdate();
        cy.get(".grid-tile-container .product-tile").should("have.length", 1);
        cy.contains(/1\s*Item/).should("be.visible");
    });

    it("filters correctly on compound price filter selection", () => {
        cy.openPriceAccordionDesktop();
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(4, "0", "49"))
            .click();
        cy.awaitFilterUpdate();
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(1, "200"))
            .click();
        cy.awaitFilterUpdate();
        cy.get(".grid-tile-container .product-tile").should("have.length", 5);
        cy.contains(/5\s*Items/).should("be.visible");
    });

    it("filters correctly on combined size and price filter selection", () => {
        cy.openSizeAccordionDesktop();
        cy.openPriceAccordionDesktop();
        cy.get(".desktop-filtering .size-btn-container")
            .contains("button", matchSizeLabel(7, "XXL"))
            .click();
        cy.awaitFilterUpdate();
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(1, "200"))
            .click();
        cy.awaitFilterUpdate();
        cy.get(".grid-tile-container .product-tile").should("have.length", 0);
        cy.contains(/0\s*Items/).should("be.visible");
    });

    it("displays the correct message when filtering returns no results", () => {
        cy.openSizeAccordionDesktop();
        cy.openPriceAccordionDesktop();
        cy.get(".desktop-filtering .size-btn-container")
            .contains("button", matchSizeLabel(7, "XXL"))
            .click();
        cy.awaitFilterUpdate();
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(1, "200"))
            .click();
        cy.awaitFilterUpdate();
        cy.contains("No products matching your filter").should("be.visible");
    });

    it("opens only accordions with active filters on page load", () => {
        cy.openSizeAccordionDesktop();
        cy.get(".desktop-filtering .size-btn-container")
            .contains("button", matchSizeLabel(7, "XXL"))
            .click();
        cy.awaitFilterUpdate();
        cy.get(".desktop-filtering .size-btn-container").should("be.visible");
        cy.get(".desktop-filtering .price-btn-container").should("not.be.visible");
        cy.reload();
        cy.get("#loading-indicator").should("not.exist");
        cy.contains(/\d+\s*Item(s)?/).should("be.visible");
        cy.get(".desktop-filtering .size-btn-container").should("be.visible");
        cy.get(".desktop-filtering .price-btn-container").should("not.be.visible");
    });

    it("displays conditional product tile elements on mouse hover only", () => {
        cy.get(".grid-tile-container .product-tile").first().as("test-tile");
        cy.get("@test-tile").find("[aria-label='Add or remove from wishlist']").should("not.exist");
        cy.get("@test-tile").find(".lower-hover-container").should("not.exist");
        cy.get("@test-tile").trigger("mouseover");
        cy.get("@test-tile")
            .find("[aria-label='Add or remove from wishlist']")
            .should("be.visible");
        cy.get("@test-tile").find(".lower-hover-container").should("be.visible");
        cy.get("@test-tile").trigger("mouseout");
        cy.get("@test-tile").find("[aria-label='Add or remove from wishlist']").should("not.exist");
        cy.get("@test-tile").find(".lower-hover-container").should("not.exist");
    });
});
