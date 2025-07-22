import { matchPriceRangeLabel, matchSizeLabel } from "../../../src/lib/test-utils";

describe("Product grid page mobile viewport base tests", () => {
    beforeEach(() => {
        cy.lessThanLargeBreakpoint();
        cy.visit("/category/all");
        cy.wait(1000);
    });

    it("displays the correct number of items", () => {
        cy.get(".grid-tile-container .product-tile").should("have.length", 15);
        cy.contains(/15\s*Items/).should("be.visible"); // 16 total less 1 unstocked
    });

    it("displays the expected UI for the viewport", () => {
        cy.get("#filter-aside").should("not.be.visible");
        cy.contains("button", "Filter").should("be.visible");
    });
});

describe("Category grid page mobile viewport filtering tests", () => {
    beforeEach(() => {
        cy.lessThanLargeBreakpoint();
        cy.visit("/category/all");
        cy.wait(1000);
        cy.contains("button", "Filter").click();
    });

    it("displays the correct number of size filters", () => {
        cy.get(".mobile-filtering").contains("button", "Size").click();
        cy.get(".mobile-filtering .size-btn-container li").should("have.length", 6);
        cy.get(".mobile-filtering .size-btn-container")
            .contains("button", matchSizeLabel(7, "XS"))
            .should("be.visible");
        cy.get(".mobile-filtering .size-btn-container")
            .contains("button", matchSizeLabel(14, "S"))
            .should("be.visible");
        cy.get(".mobile-filtering .size-btn-container")
            .contains("button", matchSizeLabel(14, "M"))
            .should("be.visible");
        cy.get(".mobile-filtering .size-btn-container")
            .contains("button", matchSizeLabel(15, "L"))
            .should("be.visible");
        cy.get(".mobile-filtering .size-btn-container")
            .contains("button", matchSizeLabel(15, "XL"))
            .should("be.visible");
        cy.get(".mobile-filtering .size-btn-container")
            .contains("button", matchSizeLabel(7, "XXL"))
            .should("be.visible");
    });

    it("displays the correct number of price filters", () => {
        cy.get(".mobile-filtering").contains("button", "Price").click();
        cy.get(".mobile-filtering .price-btn-container li").should("have.length", 5);
        cy.get(".mobile-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(4, "0", "49"))
            .should("be.visible");
        cy.get(".mobile-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(4, "50", "99"))
            .should("be.visible");
        cy.get(".mobile-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(4, "100", "149"))
            .should("be.visible");
        cy.get(".mobile-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(2, "150", "199"))
            .should("be.visible");
        cy.get(".mobile-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(4, "0", "49"))
            .should("be.visible");
    });

    it("filters correctly on single size filter selection", () => {
        cy.get(".mobile-filtering").contains("button", "Size").click();
        cy.get(".mobile-filtering .size-btn-container")
            .contains("button", matchSizeLabel(7, "XXL"))
            .click();
        cy.get("[aria-label='Close menu']").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", 7);
        cy.contains(/7\s*Items/).should("be.visible");
    });

    it("filters correctly on compound size filter selection", () => {
        cy.get(".mobile-filtering").contains("button", "Size").click();
        cy.get(".mobile-filtering .size-btn-container")
            .contains("button", matchSizeLabel(7, "XS"))
            .click();
        cy.wait(1000);
        cy.get(".mobile-filtering .size-btn-container")
            .contains("button", matchSizeLabel(7, "XXL"))
            .click();
        cy.get("[aria-label='Close menu']").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", 14);
        cy.contains(/14\s*Items/).should("be.visible");
    });

    it("filters correctly on single price filter selection", () => {
        cy.get(".mobile-filtering").contains("button", "Price").click();
        cy.get(".mobile-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(1, "200"))
            .click();
        cy.get("[aria-label='Close menu']").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", 1);
        cy.contains(/1\s*Item/).should("be.visible");
    });

    it("filters correctly on compound price filter selection", () => {
        cy.get(".mobile-filtering").contains("button", "Price").click();
        cy.get(".mobile-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(4, "0", "49"))
            .click();
        cy.wait(1000);
        cy.get(".mobile-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(1, "200"))
            .click();
        cy.get("[aria-label='Close menu']").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", 5);
        cy.contains(/5\s*Items/).should("be.visible");
    });

    it("filters correctly on combined size and price filter selection", () => {
        cy.get(".mobile-filtering").contains("button", "Size").click();
        cy.get(".mobile-filtering").contains("button", "Price").click();
        cy.get(".mobile-filtering .size-btn-container")
            .contains("button", matchSizeLabel(7, "XXL"))
            .click();
        cy.wait(1000);
        cy.get(".mobile-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(1, "200"))
            .click();
        cy.get("[aria-label='Close menu']").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", 0);
        cy.contains(/0\s*Items/).should("be.visible");
    });

    it("displays the correct message when filtering returns no results", () => {
        cy.get(".mobile-filtering").contains("button", "Size").click();
        cy.get(".mobile-filtering").contains("button", "Price").click();
        cy.get(".mobile-filtering .size-btn-container")
            .contains("button", matchSizeLabel(7, "XXL"))
            .click();
        cy.wait(1000);
        cy.get(".mobile-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(1, "200"))
            .click();
        cy.get("[aria-label='Close menu']").click();
        cy.wait(1000);
        cy.contains("No products matching your filter").should("be.visible");
    });
});

describe("Category grid page mobile viewport tile touch tests", () => {
    beforeEach(() => {
        cy.lessThanLargeBreakpoint();
        cy.visit("/category/all");
        cy.wait(1000);
    });

    it("displays conditional product tile elements when touch is held longer than prescribed period", () => {
        cy.get(".grid-tile-container .product-tile").first().as("test-tile");
        cy.get("@test-tile").find("[aria-label='Add or remove from wishlist']").should("not.exist");
        cy.get("@test-tile").find(".lower-hover-container").should("not.exist");
        cy.get("@test-tile").trigger("touchstart");
        cy.wait(400);
        cy.get("@test-tile").trigger("touchend");
        cy.get("@test-tile")
            .find("[aria-label='Add or remove from wishlist']")
            .should("be.visible");
        cy.get("@test-tile").find(".lower-hover-container").should("be.visible");
    });

    it("prevents displaying conditional product tile elements when touch is held less than prescribed period", () => {
        cy.get(".grid-tile-container .product-tile").first().as("test-tile");
        cy.get("@test-tile").find("[aria-label='Add or remove from wishlist']").should("not.exist");
        cy.get("@test-tile").find(".lower-hover-container").should("not.exist");
        cy.get("@test-tile").trigger("touchstart");
        cy.wait(200);
        cy.get("@test-tile").trigger("touchend");
        cy.get("@test-tile").find("[aria-label='Add or remove from wishlist']").should("not.exist");
        cy.get("@test-tile").find(".lower-hover-container").should("not.exist");
    });

    it("removes conditional elements from tile when touch moves to another element", () => {
        cy.get(".grid-tile-container .product-tile").first().as("test-tile");
        cy.get("@test-tile").trigger("touchstart");
        cy.wait(400);
        cy.get("@test-tile").trigger("touchend");
        cy.get("@test-tile")
            .find("[aria-label='Add or remove from wishlist']")
            .should("be.visible");
        cy.get("@test-tile").find(".lower-hover-container").should("be.visible");
        cy.get('[aria-label="Category tabs"]').trigger("touchstart");
        cy.get("@test-tile").find("[aria-label='Add or remove from wishlist']").should("not.exist");
        cy.get("@test-tile").find(".lower-hover-container").should("not.exist");
    });
});
