describe("Admin route protection", () => {
    it("redirects to log in page if accessing root admin path unauthenticated", () => {
        cy.visit("/admin");
        cy.location("pathname").should("eq", "/login");
    });

    it("redirects to log in page if accessing an admin subpath unauthenticated", () => {
        cy.visit("/admin/products");
        cy.location("pathname").should("eq", "/login");
    });

    it("redirects to log in page if accessing root admin path when logged in as a standard user", () => {
        cy.logInAsStandardUser();
        cy.location("pathname").should("eq", "/");
        cy.visit("/admin");
        cy.location("pathname").should("eq", "/login");
    });

    it("redirects to log in page if accessing an admin subpath when logged in as a standard user", () => {
        cy.logInAsStandardUser();
        cy.location("pathname").should("eq", "/");
        cy.visit("/admin/products");
        cy.location("pathname").should("eq", "/login");
    });

    it("permits accessing root admin path when logged in as an admin", () => {
        cy.logInAsAdmin();
        cy.location("pathname").should("eq", "/");
        cy.visit("/admin");
        cy.location("pathname").should("eq", "/admin");
        cy.contains("Admin Actions").should("be.visible");
    });

    it("permits accessing an admin subpath when logged in as an admin", () => {
        cy.logInAsAdmin();
        cy.location("pathname").should("eq", "/");
        cy.visit("/admin/products");
        cy.location("pathname").should("eq", "/admin/products");
        cy.contains("Products").should("be.visible");
    });
});
