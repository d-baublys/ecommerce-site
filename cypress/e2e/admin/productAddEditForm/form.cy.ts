describe("Product add/edit form base tests", () => {
    beforeEach(() => {
        cy.logInAsAdmin();
        cy.visitAddProductPage();
        cy.awaitTableSettle();
    });

    it("doesn't show 'pending add' state buttons by default", () => {
        cy.get("#overall-action-container").contains("button", "Add").should("not.exist");
        cy.get("#overall-action-container").contains("button", "Cancel").should("not.exist");
    });

    it("shows 'pending add' state buttons on any input field entry", () => {
        cy.get("input[name='product-name']").type("test");
        cy.get("#overall-action-container").contains("button", "Add").should("be.visible");
        cy.get("#overall-action-container").contains("button", "Cancel").should("be.visible");
    });

    it("shows the 'leave page/stay on page' modal if page reloads in the 'pending changes' state", () => {
        let preventSpy: Cypress.Agent<sinon.SinonSpy>;

        cy.on("window:before:unload", (e) => {
            preventSpy = cy.spy(e, "preventDefault");
        });

        cy.get("input[name='product-name']").type("test");

        cy.reload().then(() => {
            cy.wrap(preventSpy).should("have.been.calledOnce");
        });
    });

    it("shows expected message when product name is too short", () => {
        cy.get("input[name='product-name']").type("tes");
        cy.assertFormMessage("Product name must be at least 4 characters long");
    });

    it("shows expected message when product price is too low", () => {
        cy.get("input[name='product-name']").type("test");
        cy.get("input[name='product-price']").clear().type("0.99");
        cy.assertFormMessage("Price must be at least 1.00");
    });

    it("shows expected message when image filepath is left empty", () => {
        cy.get("input[name='product-name']").type("test");
        cy.get("input[name='product-price']").clear().type("1.00");
        cy.assertFormMessage("Invalid image filepath");
    });

    it("shows expected message when image description is too short", () => {
        cy.get("input[name='product-name']").type("test");
        cy.get("input[name='product-price']").clear().type("1.00");
        cy.get("input[name='image-path']").attachFile("test-image.png");
        cy.get("input[name='image-description']").type("tes");
        cy.assertFormMessage("Image description must be at least 4 characters long");
    });

    it("shows error message if stock table is left empty", () => {
        cy.get("input[name='product-name']").type("test");
        cy.get("input[name='product-price']").clear().type("1.00");
        cy.get("input[name='image-path']").attachFile("test-image.png");
        cy.get("input[name='image-description']").type("test");
        cy.assertFormMessage("Stock table must include at least one size");
    });

    it("shows 'pending add' state buttons on stock table addition", () => {
        cy.get("#stock-table-button-container").contains("button", "+ Add Size").click();
        cy.get("#overall-action-container").contains("button", "Add").should("not.exist");
        cy.get("#overall-action-container").contains("button", "Cancel").should("not.exist");

        cy.get("[data-cy='size-input']").last().type("s");
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.get("#stock-table-button-container").contains("button", /^Add$/).click();
        cy.get("#overall-action-container").contains("button", "Add").should("be.visible");
        cy.get("#overall-action-container").contains("button", "Cancel").should("be.visible");
    });

    it("shows error message if main 'add' button is clicked while table is in 'add' mode", () => {
        cy.get("#stock-table-button-container").contains("button", "+ Add Size").click();
        cy.get("[data-cy='size-input']").last().type("s");
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.get("#stock-table-button-container").contains("button", /^Add$/).click();

        cy.get("#stock-table-button-container").contains("button", "+ Add Size").click();
        cy.get("[data-cy='size-input']").last().type("m");
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.get("#overall-action-container").contains("button", "Add").click();
        cy.get("#overall-message-container")
            .contains("Please apply pending stock changes before saving")
            .should("be.visible");
    });

    it("shows error message if main 'add' button is clicked while table is in 'edit' mode", () => {
        cy.get("#stock-table-button-container").contains("button", "+ Add Size").click();
        cy.get("[data-cy='size-input']").last().type("s");
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.get("#stock-table-button-container").contains("button", /^Add$/).click();

        cy.get("#stock-table-button-container").contains("button", "Edit").click();
        cy.get("#overall-action-container").contains("button", "Add").click();
        cy.get("#overall-message-container")
            .contains("Please apply pending stock changes before saving")
            .should("be.visible");
    });
});
