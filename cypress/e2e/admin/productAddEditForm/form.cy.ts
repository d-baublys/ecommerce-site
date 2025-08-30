import { CypressSeedTestDataDelete } from "../../../../src/lib/definitions";
import { createFakeProduct } from "../../../../src/lib/test-factories";
import { stringifyConvertPrice } from "../../../../src/lib/utils";

let productNameArr: CypressSeedTestDataDelete["productNameArr"] = [];

describe("Product add/edit form base tests", () => {
    beforeEach(() => {
        cy.logInAsAdmin();
        cy.visit("/admin/products/add-product");
        cy.location("pathname").should("eq", "/admin/products/add-product");
        cy.contains("Add Product").should("be.visible");
        cy.awaitTableSettle();

        productNameArr = [];
    });

    afterEach(() => {
        if (productNameArr.length) {
            cy.task("getTestProductMultipleId", productNameArr).then((productIdArr) => {
                cy.task("deleteTestData", {
                    productIdArr,
                });
            });
        }
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

    it("shows error message if any main form fields are empty", () => {
        cy.get("input[name='product-name']").type("test");
        cy.get("#overall-action-container").contains("button", "Add").click();
        cy.get("#overall-message-container")
            .contains("Invalid data values. Please check and try again.")
            .should("be.visible");
    });

    it("shows error message if stock table is left empty", () => {
        const testProduct = createFakeProduct();

        cy.get("input[name='product-name']").type(testProduct.name);
        cy.get("select[name='product-category']").select(testProduct.gender);
        cy.get("input[name='product-price']")
            .clear()
            .type(`${stringifyConvertPrice(testProduct.price)}`);
        cy.get("input[name='image-path']").attachFile("test-image.png");
        cy.get("input[name='image-description']").type(testProduct.alt);
        cy.get("input[name='date-added']").type(testProduct.dateAdded);
        cy.get("#overall-action-container").contains("button", "Add").click();
        cy.get("#overall-message-container")
            .contains("Invalid data values. Please check and try again.")
            .should("be.visible");
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
