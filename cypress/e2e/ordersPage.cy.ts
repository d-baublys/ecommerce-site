import { CypressTestDataDeleteParams, CypressTestProductData } from "../../src/lib/types";

let orderIds: CypressTestDataDeleteParams["orderIds"] = [];
let productIds: CypressTestDataDeleteParams["productIds"] = [];

describe("Orders page unauthenticated tests", () => {
    beforeEach(() => {
        cy.visit("/orders");
    });

    it("redirects to log in page", () => {
        cy.location("pathname").should("eq", "/login");
        cy.location("search").should("eq", "?redirect_after=orders");
    });

    it("automatically navigates to orders page after logging in from redirect", () => {
        cy.location("pathname").should("eq", "/login");
        cy.location("search").should("eq", "?redirect_after=orders");
        cy.logInFromCurrent();
        cy.contains("My Orders").should("be.visible");
        cy.location("pathname").should("eq", "/orders");
        cy.location("search").should("eq", "?from_login=true");
    });
});

describe("Orders page authenticated tests", () => {
    beforeEach(() => {
        cy.logInAsStandardUser();
        cy.visitOrdersPage();
    });

    it("shows correct message when logged in but no orders to show", () => {
        cy.contains("You have no orders yet!").should("be.visible");
    });

    it("redirects to login page on log out", () => {
        cy.get("[aria-label='Account']").should("be.visible");
        cy.get("[aria-label='Account']").click();
        cy.contains("button", "Log Out").should("be.visible");
        cy.contains("button", "Log Out").click();
        cy.get("#account-menu").should("not.be.visible");
        cy.location("pathname").should("eq", "/login");
        cy.location("search").should("eq", "?redirect_after=orders");
    });
});

describe("Orders page authenticated & seeded tests", () => {
    before(() => {
        cy.task("createCypressTestProduct").then((productData: CypressTestProductData) => {
            cy.task("createCypressTestOrder", { testProductsData: [productData] }).then(
                (orderId: CypressTestDataDeleteParams["orderIds"][number]) => {
                    orderIds.push(orderId);
                    productIds.push(productData.id);
                }
            );
        });
    });

    beforeEach(() => {
        cy.logInAsAdmin();
        cy.visitOrdersPage();
    });

    after(() => {
        if (orderIds.length || productIds.length) {
            cy.task("deleteTestData", {
                orderIds,
                productIds,
            });
        }
    });

    it("renders correct number of order tiles", () => {
        cy.contains("You have no orders yet!").should("not.exist");
        cy.get("#order-tile-container .order-tile").should("have.length", 1);
    });
});
