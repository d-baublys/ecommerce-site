import { matchPriceRangeLabel, matchSizeLabel } from "../../../src/lib/test-utils";

describe("Product grid page viewport-agnostic tests", () => {
    beforeEach(() => {
        cy.breakpointLarge();
        cy.visitCategoryPage();
    });

    it("toggles item wishlisting on heart icon click", () => {
        cy.get(".grid-tile-container .product-tile").first().as("test-tile");
        cy.get("@test-tile").trigger("mouseover");
        cy.get("@test-tile").find("[aria-label='Add or remove from wishlist']").click();
        cy.awaitWishlistUpdate();
        cy.visitWishlist();
        cy.get(".grid-tile-container .product-tile").should("have.length", 1);
        cy.contains(/1\s*Item/).should("be.visible");

        cy.visitCategoryPage();
        cy.get(".grid-tile-container .product-tile").first().as("test-tile");
        cy.get("@test-tile").trigger("mouseover");
        cy.get("@test-tile").find("[aria-label='Add or remove from wishlist']").click();
        cy.awaitWishlistUpdate();
        cy.visitWishlist();
        cy.get(".grid-tile-container .product-tile").should("have.length", 0);
        cy.contains(/0\s*Items/).should("be.visible");
        cy.contains("Your wishlist is empty!").should("be.visible");
    });

    it("displays correct number of size options on quick add click", () => {
        cy.openPriceAccordionDesktop();
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(1, "200"))
            .click();
        cy.awaitFilterUpdate();
        cy.get(".grid-tile-container .product-tile").first().as("test-tile");

        cy.get("@test-tile").trigger("mouseover");
        cy.get("@test-tile").contains("button", "Quick Add").click();

        cy.get("@test-tile").contains("button", /^L$/).should("be.visible");
        cy.get("@test-tile").contains("button", /^XL$/).should("be.visible");
        cy.get("@test-tile").find(".lower-hover-container li").should("have.length", 2);
    });

    it("adds product to the bag on quick add size icon click, shows modal, & updates navbar UI", () => {
        cy.get(".bag-count-badge").should("not.exist");
        cy.openPriceAccordionDesktop();
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(1, "200"))
            .click();
        cy.awaitFilterUpdate();
        cy.get(".grid-tile-container .product-tile").first().as("test-tile");

        cy.get("@test-tile").trigger("mouseover");
        cy.get("@test-tile").contains("button", "Quick Add").click();
        cy.get("@test-tile").find(".lower-hover-container li").first().click();
        cy.get(".bag-confirm-modal").should("be.visible");
        cy.get("#close-modal-button").click();

        cy.visitBag();
        cy.get("[data-testid='bag-tile-ul'] .bag-tile").should("have.length", 1);
        cy.get(".bag-count-badge").should("be.visible");
        cy.get(".bag-count-badge").should("have.text", "1");
    });

    it("locks scrolling when bag confirm modal is open", () => {
        cy.openPriceAccordionDesktop();
        cy.get(".desktop-filtering .price-btn-container button").first().click();
        cy.awaitFilterUpdate();
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
        cy.openPriceAccordionDesktop();
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(1, "200"))
            .click();
        cy.awaitFilterUpdate();
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
        cy.openPriceAccordionDesktop();
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(1, "200"))
            .click();
        cy.awaitFilterUpdate();
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
        cy.awaitFilterUpdate();
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
        cy.awaitFilterUpdate();
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
        cy.awaitFilterUpdate();
        cy.get(".tile-price").then(($tiles) => {
            const dates = [...$tiles].map((tile) => new Date(tile.getAttribute("data-date-added")));
            const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());

            expect(dates).to.deep.equal(sortedDates);
        });
    });

    it("resets size filters on client-side pathname change", () => {
        cy.openSizeAccordionDesktop();
        cy.get(".desktop-filtering .size-btn-container")
            .contains("button", matchSizeLabel(7, "XXL"))
            .click();
        cy.awaitFilterUpdate();
        cy.get(".grid-tile-container .product-tile").should("have.length", 7);
        cy.contains(/7\s*Items/).should("be.visible");

        cy.get("nav").contains("All").click();
        cy.get(".grid-tile-container .product-tile").should("have.length", 15);
        cy.awaitFilterUpdate();
        cy.contains(/15\s*Items/).should("be.visible");
    });

    it("resets price filters on client-side pathname change", () => {
        cy.openPriceAccordionDesktop();
        cy.get(".desktop-filtering .price-btn-container")
            .contains("button", matchPriceRangeLabel(1, "200"))
            .click();
        cy.awaitFilterUpdate();
        cy.get(".grid-tile-container .product-tile").should("have.length", 1);
        cy.contains(/1\s*Item/).should("be.visible");

        cy.get("nav").contains("All").click();
        cy.get(".grid-tile-container .product-tile").should("have.length", 15);
        cy.awaitFilterUpdate();
        cy.contains(/15\s*Items/).should("be.visible");
    });

    it("resets sort on client-side pathname change", () => {
        cy.get("#sort-select").select("Price (Low to High)");
        cy.awaitFilterUpdate();
        cy.get(".tile-price").then((tilePrices) => {
            const prices = [...tilePrices].map((price) =>
                parseFloat(price.innerText.replace("£", ""))
            );
            const sortedAsc = [...prices].sort((a, b) => a - b);

            expect(prices).to.deep.equal(sortedAsc);
        });

        cy.get("nav").contains("All").click();
        cy.get(".grid-tile-container .product-tile").should("have.length", 15);
        cy.awaitFilterUpdate();
        cy.get(".tile-price").then(($tilePrices) => {
            const prices = [...$tilePrices].map((price) =>
                parseFloat(price.innerText.replace("£", ""))
            );
            const sortedDesc = [...prices].sort((a, b) => b - a);

            expect(prices).to.not.deep.equal(sortedDesc);
        });
    });
});
