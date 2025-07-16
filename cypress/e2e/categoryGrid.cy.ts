import { VALID_SIZES, PRICE_FILTER_OPTIONS } from "../../src/lib/definitions";

describe("Category grid page desktop viewport tests", () => {
    beforeEach(() => {
        cy.largeBreakpoint();
        cy.visit("/category/all");
        cy.wait(1000);
    });

    it("has correct number of items", () => {
        cy.get(".grid-tile-container .product-tile").should("have.length", "16");
        cy.contains(/16\s*Items/);
    });

    it("doesn't show the filter button", () => {
        cy.contains("button", "Filter").should("not.be.visible");
    });

    it("should have the expected number of size filters", () => {
        cy.contains("button", "Size").click();
        cy.get(".size-btn-container li").should("have.length", `${VALID_SIZES.length}`);
    });

    it("should have the expected number of price filters", () => {
        cy.contains("button", "Size").click();
        cy.get(".price-btn-container li").should(
            "have.length",
            `${Object.keys(PRICE_FILTER_OPTIONS).length}`
        );
    });

    it("filters correctly on single size filter selection", () => {
        cy.contains("button", "Size").click();
        cy.contains(".size-btn-container button", "XXL").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", "8");
        cy.contains(/8\s*Items/);
    });

    it("filters correctly on compound size filter selection", () => {
        cy.contains("button", "Size").click();
        cy.contains(".size-btn-container button", "XS").click();
        cy.contains(".size-btn-container button", "XXL").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", "16");
        cy.contains(/16\s*Items/);
    });

    it("filters correctly on single price filter selection", () => {
        cy.contains("button", "Price").click();
        cy.contains(".price-btn-container button", "Over").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", "2");
        cy.contains(/2\s*Items/);
    });

    it("filters correctly on compound price filter selection", () => {
        cy.contains("button", "Price").click();
        cy.contains(".price-btn-container button", "0-").click();
        cy.contains(".price-btn-container button", "Over").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", "6");
        cy.contains(/6\s*Items/);
    });

    it("filters correctly on combined size and price filter selection", () => {
        cy.contains("button", "Size").click();
        cy.contains("button", "Price").click();
        cy.contains(".size-btn-container button", "XXL").click();
        cy.contains(".price-btn-container button", "Over").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", "1");
        cy.contains(/1\s*Item/);
    });

    it("sorts by price in ascending order correctly", () => {
        cy.get(".tile-price").then(($tilePrices) => {
            const prices = [...$tilePrices].map((price) =>
                parseFloat(price.innerText.replace("£", ""))
            );
            const sortedAsc = [...prices].sort((a, b) => a - b);

            expect(prices).to.not.deep.equal(sortedAsc);
        });
        cy.get("#sort-select").select("a");
        cy.wait(1000);
        cy.get("#sort-select").find("option:selected").should("have.text", "Price (Low to High)");
        cy.get(".tile-price").then((tilePrices) => {
            const prices = [...tilePrices].map((price) =>
                parseFloat(price.innerText.replace("£", ""))
            );
            const sortedAsc = [...prices].sort((a, b) => a - b);

            expect(prices).to.deep.equal(sortedAsc);
        });
    });

    it("sorts by price in descending order correctly", () => {
        cy.get(".tile-price").then(($tilePrices) => {
            const prices = [...$tilePrices].map((price) =>
                parseFloat(price.innerText.replace("£", ""))
            );
            const sortedDesc = [...prices].sort((a, b) => b - a);

            expect(prices).to.not.deep.equal(sortedDesc);
        });
        cy.get("#sort-select").select("b");
        cy.wait(1000);
        cy.get("#sort-select").find("option:selected").should("have.text", "Price (High to Low)");
        cy.get(".tile-price").then((tilePrices) => {
            const prices = [...tilePrices].map((price) =>
                parseFloat(price.innerText.replace("£", ""))
            );
            const sortedDesc = [...prices].sort((a, b) => b - a);

            expect(prices).to.deep.equal(sortedDesc);
        });
    });

    it("sorts by date added correctly", () => {
        cy.get(".product-tile").then(($tiles) => {
            const dates = [...$tiles].map((tile) => new Date(tile.getAttribute("data-date-added")));
            const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());

            expect(dates).to.not.deep.equal(sortedDates);
        });
        cy.get("#sort-select").select("c");
        cy.wait(1000);
        cy.get("#sort-select").find("option:selected").should("have.text", "Newest");
        cy.get(".tile-price").then(($tiles) => {
            const dates = [...$tiles].map((tile) => new Date(tile.getAttribute("data-date-added")));
            const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());

            expect(dates).to.deep.equal(sortedDates);
        });
    });
});

describe("Category grid page mobile viewport tests", () => {
    beforeEach(() => {
        cy.lessThanLargeBreakpoint();
        cy.visit("/category/all");
        cy.wait(1000);
    });

    it("has correct number of items", () => {
        cy.get(".grid-tile-container .product-tile").should("have.length", "16");
        cy.contains(/16\s*Items/);
    });

    it("shows the filter button", () => {
        cy.contains("button", "Filter").should("be.visible");
    });

    it("should have the expected number of size filters", () => {
        cy.contains("button", "Filter").click();
        cy.contains(".mobile-filtering button", "Size").click();
        cy.get(".mobile-filtering .size-btn-container li").should(
            "have.length",
            `${VALID_SIZES.length}`
        );
    });

    it("should have the expected number of price filters", () => {
        cy.contains("button", "Filter").click();
        cy.contains(".mobile-filtering button", "Size").click();
        cy.get(".mobile-filtering .price-btn-container li").should(
            "have.length",
            `${Object.keys(PRICE_FILTER_OPTIONS).length}`
        );
    });

    it("filters correctly on compound size filter selection", () => {
        cy.contains("button", "Filter").click();
        cy.contains(".mobile-filtering button", "Size").click();
        cy.contains(".mobile-filtering button", "XS").click();
        cy.contains(".mobile-filtering button", "XXL").click();
        cy.get(".grid-tile-container .product-tile").should("have.length", "8");
        cy.contains(/8\s*Items/);
    });

    it("filters correctly on single price filter selection", () => {
        cy.contains("button", "Filter").click();
        cy.contains(".mobile-filtering button", "Price").click();
        cy.contains(".mobile-filtering button", "Over").click();
        cy.get(".grid-tile-container .product-tile").should("have.length", "2");
        cy.contains(/2\s*Items/);
    });

    it("filters correctly on compound price filter selection", () => {
        cy.contains("button", "Filter").click();
        cy.contains(".mobile-filtering button", "Price").click();
        cy.contains(".mobile-filtering button", "0-").click();
        cy.contains(".mobile-filtering  button", "Over").click();
        cy.get(".grid-tile-container .product-tile").should("have.length", "6");
        cy.contains(/6\s*Items/);
    });

    it("filters correctly on combined size and price filter selection", () => {
        cy.contains("button", "Filter").click();
        cy.contains(".mobile-filtering button", "Size").click();
        cy.contains(".mobile-filtering button", "Price").click();
        cy.contains(".mobile-filtering button", "XXL").click();
        cy.contains(".mobile-filtering button", "Over").click();
        cy.get(".grid-tile-container .product-tile").should("have.length", "1");
        cy.contains(/1\s*Item/);
    });
});

describe("Category grid page accessbility tests", () => {
    beforeEach(() => {
        cy.visit("/category/all");
        cy.wait(1000);
    });

    it("should prevent focus to filters when accordion sections are collapsed", () => {
        cy.largeBreakpoint();
        cy.contains("button", "Size").focus();
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.contains("button", "Price").should("have.focus");
    });

    it("should allow focus to filters when accordion sections are open", () => {
        cy.largeBreakpoint();
        cy.contains("button", "Size").click();
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.contains("button", "Price").should("not.have.focus");
    });
});
