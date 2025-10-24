describe("Product stock table base tests", () => {
    beforeEach(() => {
        cy.logInAsAdmin();
        cy.visit("/admin/products/add-product");
        cy.location("pathname").should("eq", "/admin/products/add-product");
        cy.contains("Add Product").should("be.visible");
        cy.get("#stock-table").should("be.visible");
        cy.awaitTableSettle();
    });

    it("shows correct buttons for empty table 'display' mode", () => {
        cy.get("#stock-table-button-container")
            .contains("button", "+ Add Size")
            .should("be.visible");
        cy.get("#stock-table-button-container").contains("button", "Edit").should("not.exist");
    });

    it("reverts table to saved state on main form 'cancel' button click", () => {
        cy.get("#stock-table-button-container").contains("button", "+ Add Size").click();
        cy.get("[data-cy='table-row']").should("have.length", 1);
        cy.get("[data-cy='size-input']").last().type("s");
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.get("#stock-table-button-container").contains("button", /^Add$/).click();
        cy.get("[data-cy='size-input']").should("have.value", "S");
        cy.get("[data-cy='quantity-input']").should("have.value", 10);

        cy.get("#stock-table-button-container").contains("button", "+ Add Size").click();
        cy.get("[data-cy='table-row']").should("have.length", 2);
        cy.get("[data-cy='size-input']").last().type("m");
        cy.get("[data-cy='quantity-input']").last().type("10");

        cy.get("#overall-action-container").contains("button", "Cancel").click();
        cy.get("[data-cy='table-row']").should("have.length", 0);
    });

    it("doesn't show the 'leave page/stay on page' modal if page reloads without any committed table data", () => {
        let preventSpy: Cypress.Agent<sinon.SinonSpy>;

        cy.on("window:before:unload", (e) => {
            preventSpy = cy.spy(e, "preventDefault");
        });

        cy.get("#stock-table-button-container").contains("button", "+ Add Size").click();
        cy.get("[data-cy='size-input']").last().type("s");
        cy.get("[data-cy='quantity-input']").last().type("10");

        cy.reload().then(() => {
            cy.wrap(preventSpy).should("not.have.been.called");
        });
    });

    it("shows the 'leave page/stay on page' modal if page reloads in the form 'pending changes' state", () => {
        let preventSpy: Cypress.Agent<sinon.SinonSpy>;

        cy.on("window:before:unload", (e) => {
            preventSpy = cy.spy(e, "preventDefault");
        });

        cy.get("#stock-table-button-container").contains("button", "+ Add Size").click();
        cy.get("[data-cy='size-input']").last().type("s");
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.get("#stock-table-button-container").contains("button", /^Add$/).click();

        cy.reload().then(() => {
            cy.wrap(preventSpy).should("have.been.calledOnce");
        });
    });
});

describe("Product stock table 'display' mode", () => {
    beforeEach(() => {
        cy.logInAsAdmin();
        cy.visit("/admin/products/add-product");
        cy.location("pathname").should("eq", "/admin/products/add-product");
        cy.contains("Add Product").should("be.visible");
        cy.get("#stock-table").should("be.visible");
        cy.awaitTableSettle();

        cy.get("#stock-table-button-container").contains("button", "+ Add Size").click();
        cy.get("[data-cy='size-input']").last().type("s");
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.get("#stock-table-button-container").contains("button", /^Add$/).click();
    });

    it("shows correct buttons for populated table", () => {
        cy.get("#stock-table-button-container").contains("button", "Edit").should("be.visible");
        cy.get("#stock-table-button-container")
            .contains("button", "+ Add Size")
            .should("be.visible");
    });

    it("disables input and hides border indicators for both columns", () => {
        cy.get("[data-cy='size-input']").last().should("be.disabled");
        cy.get("[data-cy='quantity-input']").last().should("be.disabled");
        cy.get("[data-cy='size-input']")
            .last()
            .should("have.css", "border-color", "rgb(255, 255, 255)");
        cy.get("[data-cy='quantity-input']")
            .last()
            .should("have.css", "border-color", "rgb(255, 255, 255)");
    });
});
describe("Product stock table 'edit' mode", () => {
    beforeEach(() => {
        cy.logInAsAdmin();
        cy.visit("/admin/products/add-product");
        cy.location("pathname").should("eq", "/admin/products/add-product");
        cy.contains("Add Product").should("be.visible");
        cy.get("#stock-table").should("be.visible");
        cy.awaitTableSettle();

        cy.get("#stock-table-button-container").contains("button", "+ Add Size").click();
        cy.get("[data-cy='size-input']").last().type("s");
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.get("#stock-table-button-container").contains("button", /^Add$/).click();
    });

    it("shows correct buttons", () => {
        cy.get("#stock-table-button-container").contains("button", "Edit").click();
        cy.get("#stock-table-button-container").contains("button", "Apply");
        cy.get("#stock-table-button-container").contains("button", "Cancel").should("be.visible");
    });

    it("enables input and shows border indicator only for quantity inputs", () => {
        cy.get("#stock-table-button-container").contains("button", "Edit").click();

        cy.get("[data-cy='size-input']").last().should("be.disabled");
        cy.get("[data-cy='quantity-input']").last().should("be.enabled");
        cy.get("[data-cy='size-input']")
            .last()
            .should("have.css", "border-color", "rgb(255, 255, 255)");
        cy.get("[data-cy='quantity-input']")
            .last()
            .should("have.css", "border-color", "rgb(23, 23, 23)");
    });

    it("displays error message when quantity is edited to an invalid value", () => {
        cy.get("#stock-table-button-container").contains("button", "Edit").click();
        cy.get("[data-cy='quantity-input']").clear().type("-20");
        cy.get("#stock-table-button-container").contains("button", "Apply").click();
        cy.get("#stock-table-message-container")
            .contains("Invalid quantity value")
            .should("be.visible");
    });

    it("displays trashcan icon adjacent to every table row", () => {
        cy.get("#stock-table-button-container").contains("button", "+ Add Size").click();
        cy.get("[data-cy='size-input']").last().type("m");
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.get("#stock-table-button-container").contains("button", /^Add$/).click();
        cy.get("[data-cy='table-row']").should("have.length", 2);
        cy.get("#stock-table .stock-row-delete").should("not.exist");

        cy.get("#stock-table-button-container").contains("button", "Edit").click();
        cy.get("#stock-table .stock-row-delete").should("have.length", 2);
    });

    it("deletes table row on trashcan icon click", () => {
        cy.get("#stock-table-button-container").contains("button", "+ Add Size").click();
        cy.get("[data-cy='table-row']").should("have.length", 2);
        cy.get("[data-cy='size-input']").last().type("m");
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.get("#stock-table-button-container").contains("button", /^Add$/).click();

        cy.get("[data-cy='table-row']").should("have.length", 2);
        cy.get("#stock-table-button-container").contains("button", "Edit").click();
        cy.get("#stock-table .stock-row-delete").last().click();
        cy.get("[data-cy='table-row']").should("have.length", 1);
    });

    it("reverts table to provisional state on 'cancel' click", () => {
        cy.get("[data-cy='size-input']").should("have.value", "S");
        cy.get("[data-cy='quantity-input']").should("have.value", 10);

        cy.get("#stock-table-button-container").contains("button", "Edit").click();
        cy.get("[data-cy='quantity-input']").last().type("{backspace}");
        cy.get("[data-cy='quantity-input']").last().type("5");
        cy.get("[data-cy='quantity-input']").last().should("have.value", 15);

        cy.get("#stock-table-button-container").contains("button", "Cancel").click();
        cy.get("[data-cy='quantity-input']").last().should("have.value", 10);
    });
});
describe("Product stock table 'add' mode", () => {
    beforeEach(() => {
        cy.logInAsAdmin();
        cy.visit("/admin/products/add-product");
        cy.location("pathname").should("eq", "/admin/products/add-product");
        cy.contains("Add Product").should("be.visible");
        cy.get("#stock-table").should("be.visible");
        cy.awaitTableSettle();
        cy.get("#stock-table-button-container").contains("button", "+ Add Size").click();
    });

    it("shows correct buttons", () => {
        cy.get("#stock-table-button-container").contains("button", /^Add$/).should("be.visible");
        cy.get("#stock-table-button-container").contains("button", "Cancel").should("be.visible");
    });

    it("enables input and shows border indicators for both columns", () => {
        cy.get("[data-cy='size-input']").last().should("be.enabled");
        cy.get("[data-cy='quantity-input']").last().should("be.enabled");
        cy.get("[data-cy='size-input']")
            .last()
            .should("have.css", "border-color", "rgb(23, 23, 23)");
        cy.get("[data-cy='quantity-input']")
            .last()
            .should("have.css", "border-color", "rgb(23, 23, 23)");
    });

    it("permits adding valid size and stock quantity", () => {
        cy.get("[data-cy='size-input']").last().type("s");
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.get("#stock-table-button-container").contains("button", /^Add$/).click();
        cy.get("#stock-table-button-container").contains("button", /^Add$/).should("not.exist");
    });

    it("displays error message when adding with an empty size value", () => {
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.assertTableMessage("Invalid size value");
    });

    it("displays error message when adding with an empty quantity value", () => {
        cy.get("[data-cy='size-input']").last().type("s");
        cy.assertTableMessage("Invalid quantity value");
    });

    it("displays error message when adding an invalid size", () => {
        cy.get("[data-cy='size-input']").last().type("xd");
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.assertTableMessage("Invalid size value");
    });

    it("displays error message when adding an invalid quantity", () => {
        cy.get("[data-cy='size-input']").last().type("s");
        cy.get("[data-cy='quantity-input']").last().type("-10");
        cy.assertTableMessage("Invalid quantity value");
    });

    it("displays error message when adding a duplicate size", () => {
        cy.get("[data-cy='size-input']").last().type("s");
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.get("#stock-table-button-container").contains("button", /^Add$/).click();

        cy.get("#stock-table-button-container").contains("button", "+ Add Size").click();
        cy.get("[data-cy='size-input']").last().type("s");
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.assertTableMessage("Duplicate size value");
    });

    it("reverts table to provisional state on 'cancel' click", () => {
        cy.get("[data-cy='size-input']").last().type("s");
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.get("#stock-table-button-container").contains("button", /^Add$/).click();
        cy.get("[data-cy='size-input']").should("have.value", "S");
        cy.get("[data-cy='quantity-input']").should("have.value", 10);
        cy.get("[data-cy='table-row']").should("have.length", 1);

        cy.get("#stock-table-button-container").contains("button", "+ Add Size").click();
        cy.get("[data-cy='size-input']").last().type("m");
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.get("[data-cy='table-row']").should("have.length", 2);

        cy.get("#stock-table-button-container").contains("button", "Cancel").click();
        cy.get("[data-cy='size-input']").should("have.value", "S");
        cy.get("[data-cy='quantity-input']").should("have.value", 10);
        cy.get("[data-cy='table-row']").should("have.length", 1);
    });
});
