describe("Login/signup page", () => {
    beforeEach(() => {
        cy.visitLogInPage();
    });

    it("displays labels within the input & without displaying 'required' message by default", () => {
        cy.get("#email-input span").should("have.css", "top", "0px");
        cy.get("#password-input span").should("have.css", "top", "0px");
        cy.contains("p", "Please fill out this field.").should("not.exist");
    });

    it("displays input labels with correct text colour by default", () => {
        cy.get("#email-input span").should("have.css", "color", "rgb(23, 23, 23)");
        cy.get("#password-input span").should("have.css", "color", "rgb(23, 23, 23)");
    });

    it("displays labels above the input on input focus", () => {
        cy.get("#email-input input").click();
        cy.get("#email-input span").should("have.css", "top", "-32px");
    });

    it("changes label to red text colour & displays 'required' message if input is empty on input blur", () => {
        cy.get("#email-input input").click();
        cy.contains("h1", "Log In").click();
        cy.get("#email-input span").should("have.css", "color", "oklch(0.637 0.237 25.331)");
        cy.get("#email-input").contains("p", "Please fill out this field.").should("be.visible");
        cy.get("#email-input")
            .contains("p", "Please fill out this field.")
            .should("have.css", "color", "oklch(0.637 0.237 25.331)");
    });

    it("restores default label text colour & hides 'required' message if input gains a value", () => {
        cy.get("#email-input input").click();
        cy.contains("h1", "Log In").click();

        cy.get("#email-input input").type("123");
        cy.get("#email-input span").should("have.css", "top", "-32px");
        cy.get("#email-input span").should("have.css", "color", "rgb(23, 23, 23)");
        cy.get("#email-input").contains("p", "Please fill out this field.").should("not.exist");
    });

    it("switches inputs to 'required' feedback state if left empty immediately on submission", () => {
        cy.get("button[type='submit']").click();

        cy.get("#email-input span").should("have.css", "color", "oklch(0.637 0.237 25.331)");
        cy.get("#email-input").contains("p", "Please fill out this field.").should("be.visible");
        cy.get("#email-input")
            .contains("p", "Please fill out this field.")
            .should("have.css", "color", "oklch(0.637 0.237 25.331)");

        cy.get("#password-input span").should("have.css", "color", "oklch(0.637 0.237 25.331)");
        cy.get("#password-input").contains("p", "Please fill out this field.").should("be.visible");
        cy.get("#password-input")
            .contains("p", "Please fill out this field.")
            .should("have.css", "color", "oklch(0.637 0.237 25.331)");
    });

    it("has no accessibility violations", () => {
        cy.injectAxe();
        cy.checkA11y();
    });
});
