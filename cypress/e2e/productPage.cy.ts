describe("Product page", () => {
    beforeEach(() => {
        cy.visit("/products/white-&-medium-dark-print");
    });

    it("disables 'add to bag' button by default", () => {
        cy.contains("button", "Add to Bag").should("be.disabled");
    });

    it("includes all applicable sizes as options", () => {
        cy.get("[aria-label='Size selection'] option:not([hidden])").should("have.length", 5);
    });

    it("appends 'out of stock' to unstocked size options", () => {
        cy.get("[aria-label='Size selection'] option:disabled:not([hidden])").each(($option) => {
            cy.wrap($option).should("contain.text", "- out of stock");
        });
    });

    it("doesn't append 'out of stock' to stocked size options", () => {
        cy.get("[aria-label='Size selection'] option:not([disabled]):not([hidden])").each(
            ($option) => {
                cy.wrap($option).should("not.contain.text", "- out of stock");
            }
        );
    });

    it("disables unstocked size options", () => {
        cy.get("[aria-label='Size selection'] option:not([disabled]):not([hidden])").as(
            "enabled-options"
        );
        cy.get("@enabled-options").should("have.length", 2);
        cy.get("@enabled-options").eq(0).should("have.text", "L");
        cy.get("@enabled-options").eq(1).should("have.text", "XL");
    });

    it("enables 'add to bag' button once a stocked size is selected", () => {
        cy.get("[aria-label='Size selection']").select("L");
        cy.contains("button", "Add to Bag").should("be.enabled");
    });

    it("adds product to the bag on 'add to bag' button click and updates navbar UI", () => {
        cy.get("[aria-label='Size selection']").select("L");
        cy.contains("button", "Add to Bag").click();
        cy.get("[aria-label='Size selection']").select("XL");
        cy.contains("button", "Add to Bag").click();
        cy.contains("button", "Add to Bag").click();
        cy.visit("/bag");
        cy.get("[data-testid='bag-tile-ul'] .bag-tile").should("have.length", 2); // 2 sizes, 3 total quantity
        cy.get(".bag-count-badge").should("have.text", "3");
    });

    it("disables size option and 'add to bag' button if all remaining stock is reserved in the bag", () => {
        cy.get("[aria-label='Size selection']").select("L");
        cy.get("[aria-label='Size selection'] option:not([disabled]):not([hidden])").as(
            "enabled-options"
        );
        cy.contains("button", "Add to Bag").click();
        cy.get("@enabled-options").should("have.length", 1);
        cy.get("@enabled-options").eq(0).should("have.text", "XL");
        cy.get("[aria-label='Size selection'] option").should("contain.text", "L - out of stock");
        cy.contains("button", "Add to Bag").should("be.disabled");
    });

    it("toggles product wishlisting on 'add to wishlist' button click", () => {
        cy.contains("button", "Add to Wishlist").click();
        cy.visit("/wishlist");
        cy.get(".grid-tile-container .product-tile").should("have.length", 1);
        cy.contains(/1\s*Item/).should("be.visible");
        cy.visit("/products/white-&-medium-dark-print");
        cy.contains("button", "Remove from Wishlist").click();
        cy.go("back");
        cy.get(".grid-tile-container .product-tile").should("have.length", 0);
        cy.contains(/0\s*Items/).should("be.visible");
    });

    it("has no accessibility violations in the base page state", () => {
        cy.wait(500);
        cy.injectAxe();
        cy.checkA11y();
    });

    it("has no accessibility violations when a size is selected", () => {
        cy.get("[aria-label='Size selection']").select("L");
        cy.wait(500);
        cy.injectAxe();
        cy.checkA11y();
    });
});
