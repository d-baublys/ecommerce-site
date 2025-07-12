describe("Navbar", () => {
    it("shows the expected navbar items in mobile viewports", () => {
        cy.lessThanSmallBreakpoint();
        cy.visitHome();
        cy.get("#main-entry").should("not.be.visible");
        cy.get("[aria-label='Search']").should("be.visible");
        cy.get("[aria-label='Wishlist']").should("not.be.visible");
        cy.get("[aria-label='Bag']").should("not.be.visible");
        cy.get("[aria-label='Account']").should("not.be.visible");
        cy.get("[aria-label='Menu']").should("be.visible");
    });

    it("shows the expected navbar items in larger-than-mobile viewports", () => {
        cy.smallBreakpoint();
        cy.visitHome();
        cy.get("#main-entry").should("be.visible");
        cy.get("[aria-label='Search']").should("be.visible");
        cy.get("[aria-label='Wishlist']").should("be.visible");
        cy.get("[aria-label='Bag']").should("be.visible");
        cy.get("[aria-label='Account']").should("be.visible");
        cy.get("[aria-label='Menu']").should("not.be.visible");
    });

    it("shows the mobile-only menu & the expected menu items", () => {
        cy.lessThanSmallBreakpoint();
        cy.visitHome();
        cy.get("[aria-label='Menu']").click();
        cy.get("#nav-mobile-menu").should("be.visible");
        cy.get("#mobile-entry").should("be.visible");
        cy.get("[aria-label='Wishlist']").should("be.visible");
        cy.get("[aria-label='Bag']").should("be.visible");
        cy.get("[aria-label='Account']").should("be.visible");
    });

    it("should stack the mobile-only menu above the navbar", () => {
        cy.lessThanSmallBreakpoint();
        cy.visitHome();
        cy.get("[aria-label='Menu'").click();
        cy.get("#navbar").should("not.be.visible");
    });

    it("closes the mobile-only menu as expected", () => {
        cy.lessThanSmallBreakpoint();
        cy.visitHome();
        cy.get("[aria-label='Menu']").click();
        cy.get("#nav-mobile-menu").should("be.visible");
        cy.get("[aria-label='Close menu']").click();
        cy.get("#nav-mobile-menu").should("not.be.visible");
        cy.get("#navbar").should("be.visible");
    });

    it("hides the mobile-only menu if window is resized to larger-than-mobile width", () => {
        cy.lessThanSmallBreakpoint();
        cy.visitHome();
        cy.get("[aria-label='Menu']").click();
        cy.get("#nav-mobile-menu").should("be.visible");
        cy.get("#mobile-entry").should("be.visible");
        cy.smallBreakpoint();
        cy.get("#nav-mobile-menu").should("not.be.visible");
    });

    it("restores focus when mobile-only menu is closed", () => {
        cy.lessThanSmallBreakpoint();
        cy.visitHome();
        cy.get("[aria-label='Menu']").click();
        cy.get("[aria-label='Close menu']").click();
        cy.get("[aria-label='Menu']").should("have.focus");
    });

    it("navigates correctly when clicking 'Shop' link", () => {
        cy.visitHome();
        cy.get("#main-entry").click();
        cy.url().should("contain", "/category/all");
    });

    it("navigates correctly when clicking the site logo", () => {
        cy.visit("/admin");
        cy.get("#site-logo").click();
        cy.url().should("contain", "/");
    });

    it("navigates correctly when clicking 'Wishlist' link button", () => {
        cy.visitHome();
        cy.get("[aria-label='Wishlist']").click();
        cy.url().should("contain", "/wishlist");
    });

    it("navigates correctly when clicking 'Bag' link button", () => {
        cy.visitHome();
        cy.get("[aria-label='Bag']").click();
        cy.url().should("contain", "/bag");
    });

    it("shouldn't open the account menu when not logged in as admin", () => {
        cy.visitHome();
        cy.get("[aria-label='Account']").click();
        cy.get("#account-menu").should("not.be.visible");
    });

    it("shows the account menu & the expected menu items when logged in as admin", () => {
        cy.logInAsAdmin();
        cy.get("[aria-label='Account']").click();
        cy.get("#account-menu").should("be.visible");
        cy.contains("button", "Log Out").should("be.visible");
    });

    it("should stack the account menu above the navbar", () => {
        cy.logInAsAdmin();
        cy.get("[aria-label='Account']").click();
        cy.get("#navbar").should("not.be.visible");
    });

    it("closes the account menu as expected", () => {
        cy.logInAsAdmin();
        cy.get("[aria-label='Account']").click();
        cy.get("[aria-label='Close menu']").click();
        cy.get("#account-menu").should("not.be.visible");
        cy.get("#navbar").should("be.visible");
    });

    it("restores focus when account menu is closed", () => {
        cy.logInAsAdmin();
        cy.get("[aria-label='Account']").click();
        cy.get("[aria-label='Close menu']").click();
        cy.get("[aria-label='Account']").should("have.focus");
    });

    it("doesn't render admin button when unauthenticated", () => {
        cy.visitHome();
        cy.get("[aria-label='Admin']").should("not.exist");
    });

    it("renders admin button when authenticated", () => {
        cy.logInAsAdmin();
        cy.get("[aria-label='Admin']").should("exist");
    });

    it("navigates correctly when clicking 'Admin' link button", () => {
        cy.logInAsAdmin();
        cy.get("[aria-label='Admin']").should("exist");
        cy.visit("/");
        cy.location("pathname").should("eq", "/");
        cy.get("[aria-label='Admin']").click();
        cy.location("pathname").should("eq", "/admin");
    });

    it("stickies the navbar only when scrolling up", () => {
        cy.visitHome();
        cy.scrollTo("center", { duration: 500 });
        cy.get("#navbar").should("have.class", "top-[calc(var(--nav-height)*-1)]");
        cy.get("#navbar").should("not.be.visible");
        cy.scrollTo("top", { duration: 500 });
        cy.get("#navbar").should("be.visible");
        cy.get("#navbar").should("have.class", "top-0");
    });
});
