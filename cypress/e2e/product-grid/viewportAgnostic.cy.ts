import { matchPriceRangeLabel } from "../../../src/lib/test-utils";

describe("Product grid page viewport-agnostic tests", () => {
    beforeEach(() => {
        cy.largeBreakpoint();
        cy.visit("/category/all");
        cy.get("[aria-label='Loading indicator']").should("not.exist");
    });

    it("toggles item wishlisting on heart icon click", () => {
        cy.get(".grid-tile-container .product-tile").first().as("test-tile");
        cy.get("@test-tile").trigger("mouseover");
        cy.get("@test-tile").find("[aria-label='Add or remove from wishlist']").click();
        cy.visit("/wishlist");
        cy.get(".grid-tile-container .product-tile").should("have.length", 1);
        cy.contains(/1\s*Item/).should("be.visible");

        cy.go("back");
        cy.get(".grid-tile-container .product-tile").first().as("test-tile");
        cy.get("@test-tile").trigger("mouseover");
        cy.get("@test-tile").find("[aria-label='Add or remove from wishlist']").click();
        cy.go("forward");
        cy.get(".grid-tile-container .product-tile").should("have.length", 0);
        cy.contains(/0\s*Items/).should("be.visible");
        cy.contains("Your wishlist is empty!").should("be.visible");
    });

    it("displays correct number of size options on quick add click", () => {
        cy.get(".desktop-filtering").contains("button", "Price").click();
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(1, "200"))
            .click();
        cy.get("[aria-label='Loading indicator']").should("not.exist");
        cy.get(".grid-tile-container .product-tile").first().as("test-tile");

        cy.get("@test-tile").trigger("mouseover");
        cy.get("@test-tile").contains("button", "Quick Add").click();

        cy.get("@test-tile").contains("button", /^L$/).should("be.visible");
        cy.get("@test-tile").contains("button", /^XL$/).should("be.visible");
        cy.get("@test-tile").find(".lower-hover-container li").should("have.length", 2);
    });

    it("adds product to the bag on quick add size icon click, shows modal, & updates navbar UI", () => {
        cy.get(".bag-count-badge").should("not.exist");
        cy.get(".desktop-filtering").contains("button", "Price").click();
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(1, "200"))
            .click();
        cy.get("[aria-label='Loading indicator']").should("not.exist");
        cy.get(".grid-tile-container .product-tile").first().as("test-tile");

        cy.get("@test-tile").trigger("mouseover");
        cy.get("@test-tile").contains("button", "Quick Add").click();
        cy.get("@test-tile").find(".lower-hover-container li").first().click();
        cy.get(".bag-confirm-modal").should("be.visible");
        cy.get("#close-modal-button").click();

        cy.visit("/bag");
        cy.get("[data-testid='bag-tile-ul'] .bag-tile").should("have.length", 1);
        cy.get(".bag-count-badge").should("be.visible");
        cy.get(".bag-count-badge").should("have.text", "1");
    });

    it("locks scrolling when bag confirm modal is open", () => {
        cy.get(".desktop-filtering").contains("button", "Price").click();
        cy.get(".desktop-filtering .price-btn-container button").first().click();
        cy.get("[aria-label='Loading indicator']").should("not.exist");
        cy.get(".grid-tile-container .product-tile").first().as("test-tile");

        cy.assertNoScroll();
        cy.get("@test-tile").trigger("mouseover");
        cy.get("@test-tile").contains("button", "Quick Add").click();
        cy.get("@test-tile").find(".lower-hover-container li").first().click();
        cy.get(".bag-confirm-modal").should("be.visible");
        cy.assertScrollHookCssExist();
        cy.performTestScroll();
        cy.assertNoScroll();

        cy.get("#close-modal-button").click();
        cy.assertScrollHookCssNotExist();
        cy.assertNoScroll();
    });

    it("removes a size option in quick add if it becomes unstocked", () => {
        cy.get(".desktop-filtering").contains("button", "Price").click();
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(1, "200"))
            .click();
        cy.get("[aria-label='Loading indicator']").should("not.exist");
        cy.get(".grid-tile-container .product-tile").first().as("test-tile");

        cy.get("@test-tile").trigger("mouseover");
        cy.get("@test-tile").contains("button", "Quick Add").click();
        cy.get("@test-tile").find(".lower-hover-container li").first().click();
        cy.get("@test-tile").trigger("mouseout", { force: true });
        cy.get("#close-modal-button").click();

        cy.get("@test-tile").trigger("mouseover");
        cy.get("@test-tile").contains("button", "Quick Add").click();

        cy.get("@test-tile").contains("button", /^L$/).should("not.exist");
        cy.get("@test-tile").find(".lower-hover-container li").should("have.length", 1);
    });

    it("displays quick add button substitute when product becomes completely unstocked", () => {
        cy.get(".desktop-filtering").contains("button", "Price").click();
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(1, "200"))
            .click();
        cy.get("[aria-label='Loading indicator']").should("not.exist");
        cy.get(".grid-tile-container .product-tile").first().as("test-tile");

        cy.get("@test-tile").trigger("mouseover");
        cy.get("@test-tile").contains("button", "Quick Add").click();
        cy.get("@test-tile").find(".lower-hover-container li").first().click();
        cy.get("@test-tile").trigger("mouseout", { force: true });
        cy.get("#close-modal-button").click();

        cy.get("@test-tile").trigger("mouseover");
        cy.get("@test-tile").find(".lower-hover-container").contains("button", "Quick Add").click();
        cy.get("@test-tile").find(".lower-hover-container li").first().click();
        cy.get("@test-tile").trigger("mouseout", { force: true });
        cy.get("#close-modal-button").click();

        cy.get("@test-tile").trigger("mouseover");
        cy.get("@test-tile").contains("button", "Quick Add").click();
        cy.get("@test-tile").find(".lower-hover-container li").first().click();
        cy.get("@test-tile").trigger("mouseout", { force: true });
        cy.get("#close-modal-button").click();

        cy.get("@test-tile").trigger("mouseover");

        cy.get("@test-tile").contains("button", "Quick Add").should("not.exist");
        cy.get("@test-tile").contains("Out of stock").should("be.visible");
    });

    it("sorts by price in ascending order correctly", () => {
        cy.get(".tile-price").then(($tilePrices) => {
            const prices = [...$tilePrices].map((price) =>
                parseFloat(price.innerText.replace("£", ""))
            );
            const sortedAsc = [...prices].sort((a, b) => a - b);

            expect(prices).to.not.deep.equal(sortedAsc);
        });
        cy.get("#sort-select").select("Price (Low to High)");
        cy.get("[aria-label='Loading indicator']").should("not.exist");
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
        cy.get("#sort-select").select("Price (High to Low)");
        cy.get("[aria-label='Loading indicator']").should("not.exist");
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
        cy.get("#sort-select").select("Newest");
        cy.get("[aria-label='Loading indicator']").should("not.exist");
        cy.get(".tile-price").then(($tiles) => {
            const dates = [...$tiles].map((tile) => new Date(tile.getAttribute("data-date-added")));
            const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());

            expect(dates).to.deep.equal(sortedDates);
        });
    });
});
