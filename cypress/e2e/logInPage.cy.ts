import { standardEmail, standardPassword } from "../support/credentials";

describe("Login page", () => {
    beforeEach(() => {
        cy.visit("/login");
        cy.location("pathname").should("eq", "/login");
        cy.contains("Log In").should("be.visible");
    });

    it("navigates to homepage after successful login by default", () => {
        cy.logInAsStandardUser();
        cy.location("pathname").should("eq", "/");
    });

    it("shows error message when provided email is incorrect", () => {
        cy.get("input[name='email']").type("test@example.com");
        cy.get("input[name='password']").type(standardPassword);
        cy.get("button[type='submit']").click();
        cy.contains("Incorrect email address or password. Please try again.").should("be.visible");
    });

    it("shows error message when provided password is incorrect", () => {
        cy.get("input[name='email']").type(standardEmail);
        cy.get("input[name='password']").type("password123");
        cy.get("button[type='submit']").click();
        cy.contains("Incorrect email address or password. Please try again.").should("be.visible");
    });

    it("doesn't submit form when any inputs are empty", () => {
        cy.get("input[name='email']").type(standardEmail);
        cy.get("button[type='submit']").click();
        cy.location("pathname").should("eq", "/login");
        cy.contains("Log In").should("be.visible");
    });

    it("navigates to account creation page on link click", () => {
        cy.contains("a", /Click here to create one/).click();
        cy.location("pathname").should("eq", "/create-account");
        cy.contains("Create Account").should("be.visible");
    });
});
