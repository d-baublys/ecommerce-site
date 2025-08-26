import { CypressSeedTestProduct } from "../../src/lib/definitions";

describe("Orders page base tests", () => {
    beforeEach(() => {
        cy.visit("/orders");
    });

    it("redirects to log in page when unauthenticated", () => {
        cy.location("pathname").should("eq", "/login");
        cy.location("search").should("eq", "?redirect_after=orders");
    });

    it("shows correct message when logged in but no orders to show", () => {
        cy.logInAsAdmin();
        cy.visit("/orders");
        cy.contains("You have no orders yet!").should("be.visible");
    });

    it("automatically navigates back to orders page after logging in on redirect", () => {
        cy.location("pathname").should("eq", "/login");
        cy.location("search").should("eq", "?redirect_after=orders");
        cy.logInFromCurrent();
        cy.location("pathname").should("eq", "/orders");
        cy.location("search").should("eq", "?from_login=true");
    });

    it("redirects to login page on log out", () => {
        cy.logInAsStandardUser();
        cy.visit("/orders");
        cy.location("pathname").should("eq", "/orders");
        cy.get("[aria-label='Account']").click();
        cy.get("#account-menu").should("be.visible");
        cy.contains("button", "Log Out").click();
        cy.wait(500);
        cy.location("pathname").should("eq", "/login");
        cy.location("search").should("eq", "?redirect_after=orders");
    });

    it("renders correct number of order tiles", () => {
        cy.task("seedTestProduct").then((firstTestProductData: CypressSeedTestProduct) => {
            cy.task("seedTestOrder", { productsDataArr: [firstTestProductData] }).then(
                (firstOrderId) => {
                    cy.wait(500);
                    cy.logInAsAdmin();
                    cy.visit("/orders");
                    cy.contains("You have no orders yet!").should("not.exist");
                    cy.get("#order-tile-container .order-tile").should("have.length", 1);
                    cy.task("deleteTestData", {
                        orderIdArr: [firstOrderId],
                        productIdArr: [firstTestProductData.id],
                    });
                }
            );
        });
    });
});
