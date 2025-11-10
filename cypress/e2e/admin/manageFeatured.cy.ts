describe("Manage featured products page", () => {
    beforeEach(() => {
        cy.logInAsAdmin(1);
        cy.visit("/admin/manage-featured");
        cy.location("pathname").should("eq", "/admin/manage-featured");
        cy.get("h1").contains("Manage Featured").should("be.visible");
    });

    after(() => {
        cy.task("deleteTestManageFeaturedProducts");
    });

    it("shows correct initial message", () => {
        cy.contains("Featured item list is empty").should("be.visible");
    });

    it("appends products to the featured product list & shows 'pending changes' state buttons on search suggestion click", () => {
        cy.get("#manage-featured-search-container [aria-label='Search input']").type("logo");
        cy.get("#manage-featured-search-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("#manage-featured-search-container .suggestions-container li").first().click();
        cy.get("#manage-featured-container li").should("have.length", 1);
        cy.contains("button", "Save").should("be.visible");
        cy.contains("button", "Cancel").should("be.visible");
    });

    it("removes product on button click", () => {
        cy.get("#manage-featured-search-container [aria-label='Search input']").type("logo");
        cy.get("#manage-featured-search-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("#manage-featured-search-container .suggestions-container li").first().click();
        cy.get("#manage-featured-container li").should("have.length", 1);
        cy.get("[aria-label='Remove from list']").eq(0).click();
        cy.get("#manage-featured-container").should("not.exist");
    });

    it("doesn't append existing featured products to the list on search suggestion click", () => {
        cy.get("#manage-featured-search-container [aria-label='Search input']").type("logo");
        cy.get("#manage-featured-search-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("#manage-featured-search-container .suggestions-container li").first().click();
        cy.get("#manage-featured-container li").should("have.length", 1);

        cy.awaitInputBlur();
        cy.get("#manage-featured-search-container [aria-label='Search input']").type("logo");
        cy.get("#manage-featured-search-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("#manage-featured-search-container .suggestions-container li").first().click();
        cy.get("#manage-featured-container li").should("have.length", 1);
    });

    it("appends no more than the prescribed featured products limit", () => {
        cy.get("#manage-featured-search-container [aria-label='Search input']").type("l");
        cy.get("#manage-featured-search-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("#manage-featured-search-container .suggestions-container li").eq(0).click();
        cy.get("#manage-featured-container li").should("have.length", 1);

        cy.awaitInputBlur();
        cy.get("#manage-featured-search-container [aria-label='Search input']").type("l");
        cy.get("#manage-featured-search-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("#manage-featured-search-container .suggestions-container li").eq(1).click();
        cy.get("#manage-featured-container li").should("have.length", 2);

        cy.awaitInputBlur();
        cy.get("#manage-featured-search-container [aria-label='Search input']").type("l");
        cy.get("#manage-featured-search-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("#manage-featured-search-container .suggestions-container li").eq(2).click();
        cy.get("#manage-featured-container li").should("have.length", 3);

        cy.awaitInputBlur();
        cy.get("#manage-featured-search-container [aria-label='Search input']").type("l");
        cy.get("#manage-featured-search-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("#manage-featured-search-container .suggestions-container li").eq(3).click();
        cy.get("#manage-featured-container li").should("have.length", 4);

        cy.awaitInputBlur();
        cy.get("#manage-featured-search-container [aria-label='Search input']").type("l");
        cy.get("#manage-featured-search-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("#manage-featured-search-container .suggestions-container li").eq(4).click();
        cy.get("#manage-featured-container li").should("have.length", 5);

        cy.awaitInputBlur();
        cy.get("#manage-featured-search-container [aria-label='Search input']").type("l");
        cy.get("#manage-featured-search-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("#manage-featured-search-container .suggestions-container li").eq(5).click();
        cy.get("#manage-featured-container li").should("have.length", 5);
    });

    it("saves changes to the manage featured products list & hides 'pending changes' state buttons", () => {
        cy.get("#manage-featured-search-container [aria-label='Search input']").type("logo");
        cy.get("#manage-featured-search-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("#manage-featured-search-container .suggestions-container li").first().click();
        cy.get("#manage-featured-container li").should("have.length", 1);
        cy.contains("button", "Save").click();

        cy.contains("button", "Save").should("not.exist");
        cy.contains("button", "Cancel").should("not.exist");
        cy.reload();
        cy.get("#manage-featured-container li").should("have.length", 1);
    });

    it("hides 'pending changes' state buttons if current list state matches saved state", () => {
        cy.get("#manage-featured-container li").should("have.length", 1);
        cy.get("#manage-featured-search-container [aria-label='Search input']").type("white");
        cy.get("#manage-featured-search-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("#manage-featured-search-container .suggestions-container li").first().click();
        cy.get("#manage-featured-container li").should("have.length", 2);
        cy.get("[aria-label='Remove from list']").eq(1).click();
        cy.contains("button", "Save").should("not.exist");
        cy.contains("button", "Cancel").should("not.exist");
    });

    it("shows the 'leave page/stay on page' modal if page reloads in the 'pending changes' state", () => {
        let preventSpy: Cypress.Agent<sinon.SinonSpy>;

        cy.on("window:before:unload", (e) => {
            preventSpy = cy.spy(e, "preventDefault");
        });

        cy.get("#manage-featured-container li").should("have.length", 1);
        cy.get("#manage-featured-search-container [aria-label='Search input']").type("white");
        cy.get("#manage-featured-search-container .suggestions-container li").should(
            "have.length.greaterThan",
            0
        );
        cy.get("#manage-featured-search-container .suggestions-container li").first().click();
        cy.get("#manage-featured-container li").should("have.length", 2);

        cy.reload().then(() => {
            cy.wrap(preventSpy).should("have.been.calledOnce");
        });
    });

    it("has no accessibility violations", () => {
        cy.injectAxe();
        cy.checkA11y();
    });
});
