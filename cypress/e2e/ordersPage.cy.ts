import { CypressTestDataDeleteParams, CypressTestProductData, Order } from "../../src/lib/types";

let orderIdArr: CypressTestDataDeleteParams["orderIdArr"] = [];
let productIdArr: CypressTestDataDeleteParams["productIdArr"] = [];

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
        cy.visit("/orders");
        cy.location("pathname").should("eq", "/orders");
        cy.contains("My Orders").should("be.visible");
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
            cy.task("createCypressTestOrder", { productsDataArr: [productData] }).then(
                (orderId: Order["id"]) => {
                    orderIdArr.push(orderId);
                    productIdArr.push(productData.id);
                }
            );
        });
    });

    beforeEach(() => {
        cy.logInAsAdmin();
        cy.visit("/orders");
        cy.location("pathname").should("eq", "/orders");
        cy.contains("My Orders").should("be.visible");
    });

    after(() => {
        if (orderIdArr.length || productIdArr.length) {
            cy.task("deleteTestData", {
                orderIdArr,
                productIdArr,
            });
        }
    });

    it("renders correct number of order tiles", () => {
        cy.contains("You have no orders yet!").should("not.exist");
        cy.get("#order-tile-container .order-tile").should("have.length", 1);
    });
});
