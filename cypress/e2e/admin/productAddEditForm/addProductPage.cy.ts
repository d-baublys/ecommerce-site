import { CypressSeedTestDataDelete } from "../../../../src/lib/definitions";
import { createFakeProduct } from "../../../../src/lib/test-factories";
import { processDateForClient, stringifyConvertPrice } from "../../../../src/lib/utils";

let productNameArr: CypressSeedTestDataDelete["productNameArr"] = [];
const testProduct = createFakeProduct();

describe("Add product page", () => {
    beforeEach(() => {
        cy.logInAsAdmin();
        cy.visit("/admin/products/add-product");
        cy.location("pathname").should("eq", "/admin/products/add-product");
        cy.contains("Add Product").should("be.visible");
        cy.awaitTableSettle();

        cy.get("input[name='product-name']").type(testProduct.name);
        cy.get("select[name='product-category']").select(testProduct.gender);
        cy.get("input[name='product-price']")
            .clear()
            .type(`${stringifyConvertPrice(testProduct.price)}`);
        cy.get("input[name='image-path']").attachFile("test-image.png");
        cy.get("input[name='image-description']").type(testProduct.alt);
        cy.get("input[name='date-added']").type(testProduct.dateAdded);
        cy.get("#stock-table-button-container").contains("button", "+ Add Size").click();
        cy.get("[data-cy='size-input']").last().type("s");
        cy.get("[data-cy='quantity-input']").last().type("10");
        cy.get("#stock-table-button-container").contains("button", /^Add$/).click();
    });

    after(() => {
        if (productNameArr.length) {
            cy.task("getTestProductMultipleId", productNameArr).then((productIdArr) => {
                cy.task("deleteTestData", {
                    productIdArr,
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

        productNameArr.push(testProduct.name);
    });
});
