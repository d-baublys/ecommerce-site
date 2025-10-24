import { standardEmail } from "../support/credentials";

describe("Create account page base tests", () => {
    beforeEach(() => {
        cy.visit("/create-account");
        cy.location("pathname").should("eq", "/create-account");
        cy.contains("Create Account").should("be.visible");
    });

    it("shows error message when provided passwords do not match", () => {
        cy.get("input[name='email']").type("test@example.com");
        cy.get("input[name='password']").type("password123");
        cy.get("input[name='password-confirm']").type("password1234");
        cy.get("button[type='submit']").click();
        cy.contains("Your passwords do not match.").should("be.visible");
    });

    it("shows error message when provided email is invalid", () => {
        cy.get("input[name='email']").type("testexample.com");
        cy.get("input[name='password']").type("password123");
        cy.get("input[name='password-confirm']").type("password123");
        cy.get("button[type='submit']").click();
        cy.contains("Invalid email address.").should("be.visible");
    });

    it("shows error message when provided email is already used", () => {
        cy.get("input[name='email']").type(standardEmail);
        cy.get("input[name='password']").type("password123");
        cy.get("input[name='password-confirm']").type("password123");
        cy.get("button[type='submit']").click();
        cy.contains("An account with this email address already exists.").should("be.visible");
    });

    it("shows error message when provided password is too short", () => {
        cy.get("input[name='email']").type("test@example.com");
        cy.get("input[name='password']").type("123");
        cy.get("input[name='password-confirm']").type("123");
        cy.get("button[type='submit']").click();
        cy.contains("Password must be at least 8 characters long.").should("be.visible");
    });
});

describe("Create account page seeded tests", () => {
    before(() => {
        cy.visit("/create-account");
        cy.location("pathname").should("eq", "/create-account");
        cy.contains("Create Account").should("be.visible");
    });

    after(() => {
        cy.task("deleteTestUsers");
    });

    it("shows modal on successful account creation and link navigates to login page", () => {
        cy.get("input[name='email']").type("test@example.com");
        cy.get("input[name='password']").type("password123");
        cy.get("input[name='password-confirm']").type("password123");
        cy.get("button[type='submit']").click();
        cy.contains("Account created successfully.").should("be.visible");
        cy.contains("a", "Log In").click();
        cy.contains("Log In").should("be.visible");
    });
});
