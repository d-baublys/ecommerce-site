import { CypressSeedTestDataDelete } from "../../../../src/lib/definitions";
import { createFakeProduct } from "../../../../src/lib/test-factories";
import { buildAdminProductUrl, stringifyConvertPrice } from "../../../../src/lib/utils";

let productNameArr: CypressSeedTestDataDelete["productNameArr"] = [];
let testProductLink: string;

describe("Edit product page", () => {
    before(() => {
        cy.logInAsAdmin();
        cy.visit("/admin/products/add-product");
        cy.location("pathname").should("eq", "/admin/products/add-product");
        cy.contains("Add Product").should("be.visible");
        cy.awaitTableSettle();

        const testProduct = createFakeProduct();
        productNameArr.push(testProduct.name);

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
        cy.get("#overall-action-container").contains("button", "Add").click();
        cy.get("#overall-message-container")
            .contains("Product added successfully")
            .should("be.visible");

        cy.task("getTestProductSavedData", {
            productName: testProduct.name,
            src: testProduct.src,
        }).then((data: { id: string; slug: string }) => {
            testProductLink = buildAdminProductUrl(data.id);
        });
    });

    beforeEach(() => {
        cy.logInAsAdmin();
        productNameArr = [];
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

    it("shows 'delete' button", () => {
        cy.visit(testProductLink);
        cy.location("pathname").should("eq", testProductLink);
        cy.contains("Edit Product").should("be.visible");

        cy.contains("button", "Delete").should("be.visible");
    });

    it("reverts form to saved state on 'cancel' click", () => {
        const testProduct = createFakeProduct();

        cy.visit(testProductLink);
        cy.location("pathname").should("eq", testProductLink);
        cy.contains("Edit Product").should("be.visible");

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
        cy.get("#file-dialog-unit p").should("have.text", "test-image.png");
        cy.get("input[name='image-description']").should("have.value", testProduct.alt);
        cy.get("input[name='date-added']").should("have.value", testProduct.dateAdded);
        cy.get("[data-cy='quantity-input']").last().should("have.value", "10");
    });

    it("shows success message when all main form fields are valid & table is populated on main 'save' button click", () => {
        cy.visit(testProductLink);
        cy.location("pathname").should("eq", testProductLink);
        cy.contains("Edit Product").should("be.visible");

        cy.get("input[name='product-name']").clear().type("Test Product 2");
        cy.get("#stock-table-button-container").contains("button", "Edit").click();
        cy.get("[data-cy='quantity-input']").last().clear().type("20");
        cy.get("#stock-table-button-container").contains("button", "Apply").click();
        cy.get("#overall-action-container").contains("button", "Save").click();
        cy.get("#overall-message-container")
            .contains("Changes saved succesfully")
            .should("be.visible");
        // cy.contains("p", "Test Product 2").should("be.visible");
    });

    it("redirects to admin products page on product deletion", () => {
        cy.visit(testProductLink);
        cy.location("pathname").should("eq", testProductLink);
        cy.contains("Edit Product").should("be.visible");

        cy.contains("button", "Delete").click();
        cy.contains("button", "Confirm").click();
        cy.location("pathname").should("eq", "/admin/products");

        productNameArr = [];
    });
});
