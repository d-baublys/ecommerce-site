import { email, password } from "../support/credentials";

describe("Navbar", () => {
    it("shows the expected navbar items in mobile viewports", () => {
        cy.viewport(639, 600);
        cy.visit("/");
        cy.get("#main-entry").should("not.be.visible");
        cy.get("[aria-label='Search']").should("be.visible");
        cy.get("[aria-label='Wishlist']").should("not.be.visible");
        cy.get("[aria-label='Bag']").should("not.be.visible");
        cy.get("[aria-label='Account']").should("not.be.visible");
        cy.get("[aria-label='Menu']").should("be.visible");
    });

    it("shows the expected navbar items in larger-than-mobile viewports", () => {
        cy.viewport(640, 600);
        cy.visit("/");
        cy.get("#main-entry").should("be.visible");
        cy.get("[aria-label='Search']").should("be.visible");
        cy.get("[aria-label='Wishlist']").should("be.visible");
        cy.get("[aria-label='Bag']").should("be.visible");
        cy.get("[aria-label='Account']").should("be.visible");
        cy.get("[aria-label='Menu']").should("not.be.visible");
    });

    it("shows the mobile-only menu & the expected menu items", () => {
        cy.viewport(639, 600);
        cy.visit("/");
        cy.get("[aria-label='Menu']").click();
        cy.get("#nav-mobile-menu").should("be.visible");
        cy.get("#mobile-entry").should("be.visible");
        cy.get("[aria-label='Wishlist']").should("be.visible");
        cy.get("[aria-label='Bag']").should("be.visible");
        cy.get("[aria-label='Account']").should("be.visible");
    });

    it("should stack the mobile-only menu above the navbar", () => {
        cy.viewport(639, 600);
        cy.visit("/");
        cy.get("[aria-label='Menu'").click();
        cy.get("#navbar").should("not.be.visible");
    });

    it("closes the mobile-only menu as expected", () => {
        cy.viewport(639, 600);
        cy.visit("/");
        cy.get("[aria-label='Menu']").click();
        cy.get("#nav-mobile-menu").should("be.visible");
        cy.get("[aria-label='Close menu']").click();
        cy.get("#nav-mobile-menu").should("not.be.visible");
        cy.get("#navbar").should("be.visible");
    });

    it("hides the mobile-only menu if window is resized to larger-than-mobile width", () => {
        cy.viewport(639, 600);
        cy.visit("/");
        cy.get("[aria-label='Menu']").click();
        cy.get("#nav-mobile-menu").should("be.visible");
        cy.get("#mobile-entry").should("be.visible");
        cy.viewport(640, 600);
        cy.get("#nav-mobile-menu").should("not.be.visible");
    });

    it("navigates correctly when clicking 'Shop' link", () => {
        cy.visit("/");
        cy.get("#main-entry").click();
        cy.url().should("contain", "/category/all");
    });

    it("navigates correctly when clicking the site logo", () => {
        cy.visit("/admin");
        cy.get("#site-logo").click();
        cy.url().should("contain", "/");
    });

    it("opens the search overlay when 'Search' button clicked", () => {
        cy.visit("/");
        cy.get("[aria-label='Search']").click();
        cy.get("#search-overlay-container").should("exist");
    });

    it("should stack the search overlay above the navbar", () => {
        cy.visit("/");
        cy.get("[aria-label='Search'").click();
        cy.get("#navbar").should("not.be.visible");
    });

    it("closes the search overlay as expected", () => {
        cy.visit("/");
        cy.get("[aria-label='Search']").click();
        cy.get("[aria-label='Close search']").click();
        cy.get("#search-overlay-container").should("not.exist");
        cy.get("#navbar").should("be.visible");
    });

    it("navigates correctly when clicking 'Wishlist' link button", () => {
        cy.visit("/");
        cy.get("[aria-label='Wishlist']").click();
        cy.url().should("contain", "/wishlist");
    });

    it("navigates correctly when clicking 'Bag' link button", () => {
        cy.visit("/");
        cy.get("[aria-label='Bag']").click();
        cy.url().should("contain", "/bag");
    });

    it("shouldn't open the account menu when not logged in as admin", () => {
        cy.visit("/");
        cy.get("[aria-label='Account']").click();
        cy.get("#account-menu").should("not.be.visible");
    });

    it("shows the account menu & the expected menu items when logged in as admin", () => {
        cy.visit("/admin");
        cy.get("input[name='username']").type(email);
        cy.get("input[name='password']").type(password);
        cy.get("button[type='submit']").click();
        cy.wait(500);
        cy.get("[aria-label='Account']").click();
        cy.get("#account-menu").should("be.visible");
        cy.contains("button", "Log Out").should("be.visible");
    });

    it("should stack the account menu above the navbar", () => {
        cy.visit("/admin");
        cy.get("input[name='username']").type(email);
        cy.get("input[name='password']").type(password);
        cy.get("button[type='submit']").click();
        cy.wait(500);
        cy.get("[aria-label='Account']").click();
        cy.get("#navbar").should("not.be.visible");
    });

    it("closes the account menu as expected", () => {
        cy.visit("/admin");
        cy.get("input[name='username']").type(email);
        cy.get("input[name='password']").type(password);
        cy.get("button[type='submit']").click();
        cy.wait(500);
        cy.get("[aria-label='Account']").click();
        cy.get("[aria-label='Close menu']").click();
        cy.get("#account-menu").should("not.be.visible");
        cy.get("#navbar").should("be.visible");
    });

    it("doesn't render admin button when unauthenticated", () => {
        cy.visit("/");
        cy.get("[aria-label='Admin']").should("not.exist");
    });

    it("renders admin button when authenticated", () => {
        cy.visit("/admin/login");
        cy.get("input[name='username']").type(email);
        cy.get("input[name='password']").type(password);
        cy.get("button[type='submit']").click();
        cy.wait(500);
        cy.get("[aria-label='Admin']").should("exist");
    });

    it("navigates correctly when clicking 'Admin' link button", () => {
        cy.visit("/admin/login");
        cy.get("input[name='username']").type(email);
        cy.get("input[name='password']").type(password);
        cy.get("button[type='submit']").click();
        cy.wait(500);
        cy.visit("/");
        cy.get("[aria-label='Admin']").click();
        cy.url().should("contain", "/admin");
    });
});
