describe("Navbar base tests", () => {
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
        cy.wait(500);
        cy.get("[aria-label='Menu']").click();
        cy.get("#nav-mobile-menu").should("be.visible");
        cy.get("#mobile-entry").should("be.visible");
        cy.get("[aria-label='Wishlist']").should("be.visible");
        cy.get("[aria-label='Bag']").should("be.visible");
        cy.get("[aria-label='Account']").should("be.visible");
    });

    it("stacks the mobile-only menu above the navbar", () => {
        cy.lessThanSmallBreakpoint();
        cy.visitHome();
        cy.wait(500);
        cy.get("[aria-label='Menu'").click();
        cy.get("#navbar").should("not.be.visible");
    });

    it("closes the mobile-only menu as expected", () => {
        cy.lessThanSmallBreakpoint();
        cy.visitHome();
        cy.wait(500);
        cy.get("[aria-label='Menu']").click();
        cy.get("#nav-mobile-menu").should("be.visible");
        cy.get("[aria-label='Close menu']").click();
        cy.get("#nav-mobile-menu").should("not.be.visible");
        cy.get("#navbar").should("be.visible");
    });

    it("hides the mobile-only menu if window is resized to larger-than-mobile width", () => {
        cy.lessThanSmallBreakpoint();
        cy.visitHome();
        cy.wait(500);
        cy.get("[aria-label='Menu']").click();
        cy.get("#nav-mobile-menu").should("be.visible");
        cy.get("#mobile-entry").should("be.visible");
        cy.smallBreakpoint();
        cy.get("#nav-mobile-menu").should("not.be.visible");
    });

    it("navigates correctly when clicking 'Shop' link", () => {
        cy.visitHome();
        cy.get("#main-entry").click();
        cy.location("pathname").should("eq", "/category/all");
        cy.get("[aria-label='Loading indicator']").should("not.exist");
    });

    it("navigates correctly when clicking the site logo", () => {
        cy.visit("/admin");
        cy.get("#site-logo").click();
        cy.location("pathname").should("eq", "/");
    });

    it("navigates correctly when clicking 'Wishlist' link button", () => {
        cy.visitHome();
        cy.get("[aria-label='Wishlist']").click();
        cy.location("pathname").should("eq", "/wishlist");
    });

    it("navigates correctly when clicking 'Bag' link button", () => {
        cy.visitHome();
        cy.get("[aria-label='Bag']").click();
        cy.location("pathname").should("eq", "/bag");
    });

    it("redirects to login page when 'account' button is clicked unauthenticated", () => {
        cy.visitHome();
        cy.get("[aria-label='Account']").click();
        cy.location("pathname").should("eq", "/login");
        cy.get("#account-menu").should("not.be.visible");
    });

    it("opens the account menu & shows expected menu items when when 'account' button is clicked authenticated", () => {
        cy.logInAsStandardUser();
        cy.wait(500);
        cy.get("[aria-label='Account']").click();
        cy.get("#account-menu").should("be.visible");
        cy.contains("button", "Log Out").should("be.visible");
    });

    it("stacks the account menu above the navbar", () => {
        cy.logInAsStandardUser();
        cy.wait(500);
        cy.get("[aria-label='Account']").click();
        cy.get("#navbar").should("not.be.visible");
    });

    it("closes the account menu as expected", () => {
        cy.logInAsStandardUser();
        cy.wait(500);
        cy.get("[aria-label='Account']").click();
        cy.get("[aria-label='Close menu']").click();
        cy.get("#account-menu").should("not.be.visible");
        cy.get("#navbar").should("be.visible");
    });

    it("doesn't render admin button in the navbar when unauthenticated", () => {
        cy.visitHome();
        cy.get("[aria-label='Admin']").should("not.exist");
    });

    it("doesn't render admin button in the navbar when logged in as a standard user", () => {
        cy.logInAsStandardUser();
        cy.get("[aria-label='Admin']").should("not.exist");
    });

    it("renders admin button in the navbar when logged in as an admin", () => {
        cy.logInAsAdmin();
        cy.get("[aria-label='Admin']").should("exist");
    });

    it("doesn't render admin button in the navbar after admin log out", () => {
        cy.logInAsAdmin();
        cy.get("[aria-label='Admin']").should("exist");
        cy.wait(500);
        cy.get("[aria-label='Account']").click();
        cy.wait(500);
        cy.contains("button", "Log Out").click();
        cy.get("[aria-label='Admin']").should("not.exist");
    });

    it("doesn't render admin button in the mobile menu when unauthenticated", () => {
        cy.lessThanSmallBreakpoint();
        cy.visitHome();
        cy.wait(500);
        cy.get("[aria-label='Menu']").click();
        cy.get("[aria-label='Admin']").should("not.exist");
    });

    it("doesn't render admin button in the mobile menu when logged in as a standard user", () => {
        cy.lessThanSmallBreakpoint();
        cy.logInAsStandardUser();
        cy.wait(500);
        cy.get("[aria-label='Menu']").click();
        cy.get("[aria-label='Admin']").should("not.exist");
    });

    it("renders admin button in the mobile menu when logged in as an admin", () => {
        cy.lessThanSmallBreakpoint();
        cy.logInAsAdmin();
        cy.wait(500);
        cy.get("[aria-label='Menu']").click();
        cy.get("[aria-label='Admin']").should("exist");
    });

    it("doesn't render admin button in the mobile menu after admin log out", () => {
        cy.lessThanSmallBreakpoint();
        cy.logInAsAdmin();
        cy.wait(500);
        cy.get("[aria-label='Menu']").click();
        cy.get("[aria-label='Admin']").should("exist");
        cy.get("#nav-mobile-menu [aria-label='Account']").click();
        cy.wait(500);
        cy.contains("button", "Log Out").click();
        cy.get("[aria-label='Menu']").click();
        cy.wait(500);
        cy.get("[aria-label='Admin']").should("not.exist");
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

    it("locks scrolling when the mobile-only menu is open", () => {
        cy.lessThanSmallBreakpoint();
        cy.visitHome();
        cy.wait(500);
        cy.assertNoScroll();
        cy.get("[aria-label='Menu']").click();
        cy.assertScrollHookCssExist();
        cy.performTestScroll();
        cy.assertNoScroll();
        cy.get("[aria-label='Close menu']").click();
        cy.assertNoScroll();
        cy.assertScrollHookCssNotExist();
    });

    it("locks scrolling when the account menu is open", () => {
        cy.logInAsStandardUser();
        cy.visitHome();
        cy.wait(500);
        cy.assertNoScroll();
        cy.get("[aria-label='Account']").click();
        cy.assertScrollHookCssExist();
        cy.performTestScroll();
        cy.assertNoScroll();
        cy.get("[aria-label='Close menu']").click();
        cy.assertScrollHookCssNotExist();
        cy.assertNoScroll();
    });

    it("closes the mobile-only menu on pathname change", () => {
        cy.lessThanSmallBreakpoint();
        cy.visitHome();
        cy.wait(500);
        cy.visit("/login");
        cy.get("[aria-label='Menu']").click();
        cy.wait(500);
        cy.get("#nav-mobile-menu").should("be.visible");
        cy.go("back");
        cy.get("#nav-mobile-menu").should("not.be.visible");
    });

    it("closes the account menu on pathname change", () => {
        cy.logInAsStandardUser();
        cy.visitHome();
        cy.wait(500);
        cy.visit("/login");
        cy.get("[aria-label='Account']").click();
        cy.wait(500);
        cy.get("#account-menu").should("be.visible");
        cy.go("back");
        cy.get("#account-menu").should("not.be.visible");
    });
});

describe("Navbar accessibility tests", () => {
    it("restores focus when mobile-only menu is closed", () => {
        cy.lessThanSmallBreakpoint();
        cy.visitHome();
        cy.wait(500);
        cy.get("[aria-label='Menu']").click();
        cy.get("[aria-label='Close menu']").click();
        cy.get("[aria-label='Menu']").should("have.focus");
    });

    it("restores focus when account menu is closed", () => {
        cy.logInAsStandardUser();
        cy.wait(500);
        cy.get("[aria-label='Account']").click();
        cy.get("[aria-label='Close menu']").click();
        cy.get("[aria-label='Account']").should("have.focus");
    });

    it("traps focus in the expected tabbing sequence when the mobile-only menu is open", () => {
        cy.lessThanSmallBreakpoint();
        cy.visitHome();
        cy.wait(500);
        cy.get("[aria-label='Menu']").click();
        cy.get("[aria-label='Menu']").should("be.focused");
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get("#mobile-entry").should("be.focused");
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get("[aria-label='Wishlist']").should("be.focused");
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get("[aria-label='Bag']").should("be.focused");
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get("[aria-label='Account']").should("be.focused");
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get("[aria-label='Close menu']").should("be.focused");
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get("#mobile-entry").should("be.focused");
    });

    it("traps focus in the expected tabbing sequence when the account menu is open", () => {
        cy.logInAsStandardUser();
        cy.visitHome();
        cy.wait(500);
        cy.get("[aria-label='Account']").click();
        cy.get("[aria-label='Account']").should("be.focused");
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get("a").contains("My Orders").should("be.focused");
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get("button").contains("Log Out").should("be.focused");
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get("[aria-label='Close menu']").should("be.focused");
        cy.press(Cypress.Keyboard.Keys.TAB);
        cy.get("a").contains("My Orders").should("be.focused");
    });

    it("has no accessibility violations when the mobile-only menu is open", () => {
        cy.lessThanSmallBreakpoint();
        cy.logInAsStandardUser();
        cy.visitHome();
        cy.wait(500);
        cy.get("[aria-label='Menu']").click();
        cy.wait(500);
        cy.injectAxe();
        cy.checkA11y();
    });

    it("has no accessibility violations when the account menu is open", () => {
        cy.logInAsStandardUser();
        cy.visitHome();
        cy.wait(500);
        cy.get("[aria-label='Account']").click();
        cy.wait(500);
        cy.injectAxe();
        cy.checkA11y();
    });
});
