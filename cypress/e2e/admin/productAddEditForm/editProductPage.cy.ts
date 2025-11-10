import { buildTestProduct } from "../../../../src/lib/test-factories";
import {
    CypressTestDataDeleteParams,
    CypressTestProductData,
    Product,
} from "../../../../src/lib/types";
import { buildAdminProductUrl, processDateForClient } from "../../../../src/lib/utils";

let productIds: CypressTestDataDeleteParams["productIds"] = [];
const testProduct: Product = buildTestProduct();
let testProductPath: string;

describe("Edit product page", () => {
    before(() => {
        cy.task("createCypressTestProduct").then((data: CypressTestProductData) => {
            testProductPath = buildAdminProductUrl(data.id);
            productIds.push(data.id);
        });
    });

    beforeEach(() => {
        cy.logInAsAdmin();
        cy.visitTestAdminProduct(testProductPath);
    });

    after(() => {
        cy.clearTestData({ productIds });
    });

    it("shows 'delete' button", () => {
        cy.contains("button", "Delete").should("be.visible");
    });

    it("reverts form to saved state on 'cancel' click", () => {
        cy.get("input[name='product-name']").type("Replaced name");
        cy.get("select[name='product-category']").select("womens");
        cy.get("input[name='product-price']").clear().type("50.00");
        cy.get("input[name='image-path']").attachFile("test-image.png");
        cy.get("input[name='image-description']").type("Replaced description");
        cy.get("input[name='date-added']").type("2025-01-01");
        cy.get("#stock-table-button-container").contains("button", "Edit").click();
        cy.get("[data-cy='quantity-input']").last().clear().type("20");
        cy.get("#stock-table-button-container").contains("button", "Apply").click();
        cy.get("#overall-action-container").contains("button", "Cancel").click();

        cy.get("input[name='product-name']").should("have.value", testProduct.name);
        cy.get("select[name='product-category']").should("have.value", "mens");
        cy.get("input[name='product-price']").should("have.value", "25.00");
        cy.get("#file-dialog-unit p").should("have.text", "nonexistent-img-1.jpg");
        cy.get("input[name='image-description']").should("have.value", testProduct.alt);
        cy.get("input[name='date-added']").should(
            "have.value",
            processDateForClient(testProduct.dateAdded)
        );
        cy.get("[data-cy='quantity-input']").last().should("have.value", "12");
    });

    it("shows success message & updates tile when all main form fields are valid & table is populated on main 'save' button click", () => {
        cy.contains("p", "TEST PRODUCT 1").should("be.visible");
        cy.get("input[name='product-name']").clear().type("Test Product 2");
        cy.get("#stock-table-button-container").contains("button", "Edit").click();
        cy.get("[data-cy='quantity-input']").last().clear().type("20");
        cy.get("#stock-table-button-container").contains("button", "Apply").click();
        cy.get("#overall-action-container").contains("button", "Save").click();
        cy.get("#overall-message-container")
            .contains("Changes saved succesfully")
            .should("be.visible");
        cy.contains("p", "TEST PRODUCT 2").should("be.visible");
    });

    it("redirects to admin products page on product deletion", () => {
        cy.contains("button", "Delete").click();
        cy.contains("button", "Confirm").click();
        cy.location("pathname").should("eq", "/admin/products");

        productIds = [];
    });
});
