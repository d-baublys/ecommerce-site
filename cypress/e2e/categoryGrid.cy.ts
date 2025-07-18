import { VALID_SIZES, PRICE_FILTER_OPTIONS } from "../../src/lib/definitions";

describe("Category grid page desktop viewport tests", () => {
    beforeEach(() => {
        cy.largeBreakpoint();
        cy.visit("/category/all");
        cy.wait(1000);
    });

    it("has correct number of items", () => {
        cy.get(".grid-tile-container .product-tile").should("have.length", "15");
        cy.contains(/15\s*Items/); // 16 total less 1 unstocked
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
        cy.get(".grid-tile-container .product-tile").should("have.length", "7");
        cy.contains(/7\s*Items/);
    });

    it("filters correctly on compound size filter selection", () => {
        cy.contains("button", "Size").click();
        cy.contains(".size-btn-container button", "XS").click();
        cy.wait(1000);
        cy.contains(".size-btn-container button", "XXL").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", "15");
        cy.contains(/15\s*Items/);
    });

    it("filters correctly on single price filter selection", () => {
        cy.contains("button", "Price").click();
        cy.contains(".price-btn-container button", "Over").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", "1");
        cy.contains(/1\s*Item/);
    });

    it("filters correctly on compound price filter selection", () => {
        cy.contains("button", "Price").click();
        cy.contains(".price-btn-container button", "0-").click();
        cy.wait(1000);
        cy.contains(".price-btn-container button", "Over").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", "5");
        cy.contains(/5\s*Items/);
    });

    it("filters correctly on combined size and price filter selection", () => {
        cy.contains("button", "Size").click();
        cy.contains("button", "Price").click();
        cy.contains(".size-btn-container button", "XXL").click();
        cy.wait(1000);
        cy.contains(".price-btn-container button", "Over").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", "0");
        cy.contains(/0\s*Items/);
    });
});

describe("Category grid page mobile viewport base tests", () => {
    beforeEach(() => {
        cy.lessThanLargeBreakpoint();
        cy.visit("/category/all");
        cy.wait(1000);
    });

    it("has correct number of items", () => {
        cy.get(".grid-tile-container .product-tile").should("have.length", "15");
        cy.contains(/15\s*Items/); // 16 total less 1 unstocked
    });

    it("shows the filter button", () => {
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

    it("should have the expected number of size filters", () => {
        cy.contains(".mobile-filtering button", "Size").click();
        cy.get(".mobile-filtering .size-btn-container li").should(
            "have.length",
            `${VALID_SIZES.length}`
        );
    });

    it("should have the expected number of price filters", () => {
        cy.contains(".mobile-filtering button", "Size").click();
        cy.get(".mobile-filtering .price-btn-container li").should(
            "have.length",
            `${Object.keys(PRICE_FILTER_OPTIONS).length}`
        );
    });

    it("filters correctly on single size filter selection", () => {
        cy.contains(".mobile-filtering button", "Size").click();
        cy.contains(".mobile-filtering .size-btn-container button", "XXL").click();
        cy.get("[aria-label='Close menu']").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", "7");
        cy.contains(/7\s*Items/);
    });

    it("filters correctly on compound size filter selection", () => {
        cy.contains(".mobile-filtering button", "Size").click();
        cy.contains(".mobile-filtering .size-btn-container button", "XS").click();
        cy.wait(1000);
        cy.contains(".mobile-filtering .size-btn-container button", "XXL").click();
        cy.get("[aria-label='Close menu']").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", "15");
        cy.contains(/15\s*Items/);
    });

    it("filters correctly on single price filter selection", () => {
        cy.contains(".mobile-filtering button", "Price").click();
        cy.contains(".mobile-filtering .price-btn-container button", "Over").click();
        cy.get("[aria-label='Close menu']").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", "1");
        cy.contains(/1\s*Item/);
    });

    it("filters correctly on compound price filter selection", () => {
        cy.contains(".mobile-filtering button", "Price").click();
        cy.contains(".mobile-filtering .price-btn-container button", "0-").click();
        cy.wait(1000);
        cy.contains(".mobile-filtering .price-btn-container button", "Over").click();
        cy.get("[aria-label='Close menu']").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", "5");
        cy.contains(/5\s*Items/);
    });

    it("filters correctly on combined size and price filter selection", () => {
        cy.contains(".mobile-filtering button", "Size").click();
        cy.contains(".mobile-filtering button", "Price").click();
        cy.contains(".mobile-filtering .size-btn-container button", "XXL").click();
        cy.wait(1000);
        cy.contains(".mobile-filtering .price-btn-container button", "Over").click();
        cy.get("[aria-label='Close menu']").click();
        cy.wait(1000);
        cy.get(".grid-tile-container .product-tile").should("have.length", "0");
        cy.contains(/0\s*Items/);
    });
});

describe("Category grid page viewport-agnostic tests", () => {
    beforeEach(() => {
        cy.visit("/category/all");
        cy.wait(1000);
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

describe("Category grid page accessbility tests", () => {
    beforeEach(() => {
        cy.largeBreakpoint();
        cy.visit("/category/all");
        cy.wait(1000);
    });

    it("should prevent focus to filters when accordion sections are collapsed", () => {
        cy.contains("button", "Size").focus();
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.contains("button", "Price").should("have.focus");
    });

    it("should allow focus to filters when accordion sections are open", () => {
        cy.contains("button", "Size").click();
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.contains("button", "Price").should("not.have.focus");
    });
});
