import { buildTestProduct } from "../../../../src/lib/test-factories";
import { CypressTestDataDeleteParams } from "../../../../src/lib/types";
import { processDateForClient, stringifyConvertPrice } from "../../../../src/lib/utils";

let productNames: CypressTestDataDeleteParams["productNames"] = [];
const testProduct = buildTestProduct();

describe("Add product page", () => {
    beforeEach(() => {
        cy.logInAsAdmin();
        cy.visitAddProductPage();
        cy.awaitTableSettle();

        cy.get("input[name='product-name']").type(testProduct.name);
        cy.get("select[name='product-category']").select(testProduct.gender);
        cy.get("input[name='product-price']")
            .clear()
            .type(`${stringifyConvertPrice(testProduct.price)}`);
        cy.get("input[name='image-path']").attachFile("test-image.png");
        cy.get("input[name='image-description']").type(testProduct.alt);
        cy.get("input[name='date-added']").type(processDateForClient(testProduct.dateAdded));
        cy.get("#stock-table-button-container").contains("button", "+ Add Size").click();
        cy.get("[data-cy='size-input']").last().type("s");
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.get("#stock-table-button-container").contains("button", /^Add$/).click();
    });

    afterEach(() => {
        if (productNames.length) {
            cy.task("getTestProductMultipleIds", productNames).then((productIds) => {
                cy.task("deleteTestData", {
                    productIds,
                });
            });
        }
    });

    it("reverts form to default state on 'cancel' click", () => {
        cy.get("#overall-action-container").contains("button", "Cancel").click();

        cy.get("input[name='product-name']").should("have.value", "");
        cy.get("select[name='product-category']").should("have.value", "mens");
        cy.get("input[name='product-price']").should("have.value", "0.00");
        cy.get("#file-dialog-unit p").should("have.text", "");
        cy.get("input[name='image-description']").should("have.value", "");
        cy.get("input[name='date-added']").should("have.value", processDateForClient(new Date()));
        cy.get("#stock-table tbody tr").should("not.exist");
    });

    it("shows success message when all main form fields are valid & table is populated on main 'add' button click", () => {
        cy.get("#overall-action-container").contains("button", "Add").click();
        cy.get("#overall-message-container")
            .contains("Product added successfully")
            .should("be.visible");

        productNames.push(testProduct.name);
    });

    it("hides all operation buttons after successful product creation", () => {
        cy.get("#overall-action-container").contains("button", "Add").click();

        cy.get("#overall-action-container button").should("have.length", 0);
        cy.get("#stock-table-button-container button").should("have.length", 0);

        productNames.push(testProduct.name);
    });

    it("doesn't show the 'leave page/stay on page' modal if page reloads after successful product creation", () => {
        let preventSpy: Cypress.Agent<sinon.SinonSpy>;

        cy.on("window:before:unload", (e) => {
            preventSpy = cy.spy(e, "preventDefault");
        });

        cy.get("#overall-action-container").contains("button", "Add").click();
        cy.get("#overall-action-container button").should("have.length", 0);

        cy.reload().then(() => {
            cy.wrap(preventSpy).should("not.have.been.called");
        });

        productNames.push(testProduct.name);
    });
});
